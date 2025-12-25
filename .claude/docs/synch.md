# GRHIIT Data Synchronization Architecture

## Overview

GRHIIT uses an offline-first architecture with background sync to Firebase. User data is stored locally for instant access and synced to cloud for backup, cross-device access, and aggregate marketing analytics.

## Data Flow

```
Workout Complete → Local Save → Background Sync → Firebase → Aggregate Update
```

## Local Storage

**Technology:** AsyncStorage (small data) or SQLite (workout history)

**Workout Completion Record:**
```typescript
interface WorkoutCompletion {
  id: string;                    // UUID
  userId: string;
  week: number;                  // 1-8
  day: number;                   // 1-3
  completedAt: number;           // Unix timestamp
  duration: number;              // Total seconds
  burpees: number;               // User-entered count
  flyingSquats: number;          // User-entered count
  feelRating: number;            // 1-5 scale
  heartRate?: {                  // Optional, when HealthKit connected
    avg: number;
    max: number;
    recovery: number;
  };
  synced: boolean;               // Sync status flag
}
```

**User Stats (cached locally):**
```typescript
interface UserStats {
  totalBurpees: number;
  totalFlyingSquats: number;
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: number;
}
```

## Firebase Firestore Structure

### User Workouts Collection

```
users/{userId}/workouts/{workoutId}
{
  week: 1,
  day: 1,
  completedAt: Timestamp,
  duration: 972,
  burpees: 120,
  flyingSquats: 240,
  feelRating: 4,
  heartRate: {
    avg: 165,
    max: 182,
    recovery: 140
  }
}
```

**Indexes needed:**
- `completedAt DESC` (for workout history queries)
- `week ASC, day ASC` (for progress tracking)

### User Stats Document

```
users/{userId}/stats
{
  totalBurpees: 2847,
  totalFlyingSquats: 5694,
  totalWorkouts: 24,
  totalMinutes: 324,
  currentStreak: 4,
  longestStreak: 12,
  lastWorkoutDate: Timestamp,
  cyclesCompleted: 1,
  lastUpdated: Timestamp
}
```

Updated via transaction on each workout save.

### Global Aggregate Stats

```
global/stats
{
  totalUsers: 247,
  totalWorkouts: 1523,
  totalBurpees: 182940,
  totalFlyingSquats: 365880,
  totalMinutes: 20301,
  activeUsers30d: 184,
  completedCycles: 31,
  lastUpdated: Timestamp
}
```

**Updated via Cloud Function on workout completion.**

## Sync Logic

### On Workout Completion

1. **Save locally** (instant)
   - Write to AsyncStorage/SQLite
   - Update local stats cache
   - Mark `synced: false`
   - Navigate to home (grid updates)

2. **Background sync** (asynchronous)
   - Check network connectivity
   - If online: sync to Firebase
   - On success: mark `synced: true`
   - On failure: retry with exponential backoff

3. **Trigger aggregate update**
   - Cloud Function increments global stats
   - Real-time marketing data available

### Sync Queue

Handle offline scenarios:

```typescript
interface SyncQueue {
  pendingWorkouts: WorkoutCompletion[];
  lastSyncAttempt: number;
  retryCount: number;
}
```

**Retry strategy:**
- Attempt 1: Immediate
- Attempt 2: 30 seconds
- Attempt 3: 2 minutes
- Attempt 4: 5 minutes
- Give up after 24 hours, log error

### On App Launch

```typescript
async function syncOnLaunch() {
  // 1. Check for unsynced workouts
  const unsynced = await getUnsyncedWorkouts();
  
  // 2. Attempt sync if online
  if (isOnline && unsynced.length > 0) {
    await syncWorkouts(unsynced);
  }
  
  // 3. Pull latest user stats from Firebase
  // (in case completed on other device)
  await refreshUserStats();
}
```

## Cloud Functions

### `onWorkoutComplete`

Triggered when new workout written to `users/{userId}/workouts/{workoutId}`

```typescript
export const onWorkoutComplete = functions.firestore
  .document('users/{userId}/workouts/{workoutId}')
  .onCreate(async (snap, context) => {
    const workout = snap.data();
    const { userId } = context.params;
    
    // 1. Update user stats
    await updateUserStats(userId, workout);
    
    // 2. Update global aggregate
    await updateGlobalStats(workout);
    
    // 3. Check for cycle completion
    const cycleComplete = await checkCycleCompletion(userId);
    if (cycleComplete) {
      await sendCycleCompleteNotification(userId);
    }
  });
```

### `updateUserStats`

```typescript
async function updateUserStats(userId: string, workout: any) {
  const statsRef = db.doc(`users/${userId}/stats`);
  
  return db.runTransaction(async (transaction) => {
    const stats = await transaction.get(statsRef);
    const current = stats.data() || defaultStats;
    
    transaction.set(statsRef, {
      totalBurpees: current.totalBurpees + workout.burpees,
      totalFlyingSquats: current.totalFlyingSquats + workout.flyingSquats,
      totalWorkouts: current.totalWorkouts + 1,
      totalMinutes: current.totalMinutes + Math.floor(workout.duration / 60),
      currentStreak: calculateStreak(current, workout),
      longestStreak: Math.max(current.longestStreak, calculateStreak(current, workout)),
      lastWorkoutDate: workout.completedAt,
      lastUpdated: FieldValue.serverTimestamp()
    });
  });
}
```

### `updateGlobalStats`

```typescript
async function updateGlobalStats(workout: any) {
  const globalRef = db.doc('global/stats');
  
  return globalRef.update({
    totalWorkouts: FieldValue.increment(1),
    totalBurpees: FieldValue.increment(workout.burpees),
    totalFlyingSquats: FieldValue.increment(workout.flyingSquats),
    totalMinutes: FieldValue.increment(Math.floor(workout.duration / 60)),
    lastUpdated: FieldValue.serverTimestamp()
  });
}
```

## Marketing Dashboard Queries

### Real-time Aggregate Stats

```typescript
// Total burpees across all users
const globalStats = await db.doc('global/stats').get();
const totalBurpees = globalStats.data().totalBurpees;

// Last 30 days activity
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
const recentWorkouts = await db.collectionGroup('workouts')
  .where('completedAt', '>', thirtyDaysAgo)
  .get();
```

### Marketing Copy Examples

- "GRHIIT users have completed 182,940 burpees in the last 30 days"
- "Average user completes 740 burpees per 8-week cycle"
- "31 people have transformed through the complete program"
- "20,301 minutes of maximum effort logged"

## Privacy & Data Ownership

### User Data Rights

- **Export:** Users can download all their workout data (JSON format)
- **Delete:** Users can delete their account + all data
- **Anonymize:** Aggregate stats use no personal identifiers

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/workouts/{workoutId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /users/{userId}/stats {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Global stats read-only for all authenticated users
    match /global/stats {
      allow read: if request.auth != null;
      allow write: false; // Only Cloud Functions can write
    }
  }
}
```

## Implementation Checklist

### Phase 1: Local Storage (MVP)
- [ ] Create workout completion save function
- [ ] Update local stats cache
- [ ] Test offline functionality
- [ ] Grid updates on completion

### Phase 2: Firebase Sync
- [ ] Implement sync queue
- [ ] Background sync on completion
- [ ] Retry logic for failed syncs
- [ ] Sync on app launch

### Phase 3: Aggregate Stats
- [ ] Deploy Cloud Function for global stats
- [ ] User stats transaction updates
- [ ] Marketing dashboard queries
- [ ] Real-time stat display in app (optional)

### Phase 4: Advanced Features
- [ ] Cross-device sync
- [ ] Cycle completion detection
- [ ] Push notifications for streaks
- [ ] Data export functionality

## Error Handling

### Sync Failures

```typescript
try {
  await syncWorkoutToFirebase(workout);
} catch (error) {
  // Log error for monitoring
  console.error('Sync failed:', error);
  
  // Keep in queue for retry
  await addToSyncQueue(workout);
  
  // Don't block user - data is safe locally
  // UI shows "Syncing..." indicator if unsynced workouts exist
}
```

### Conflict Resolution

If same workout completed on multiple devices (rare):
- Use `completedAt` timestamp as source of truth
- Latest timestamp wins
- Merge stats (higher counts preferred)

## Monitoring & Analytics

### Key Metrics to Track

- Sync success rate
- Average sync latency
- Unsynced workout backlog
- Daily/weekly active users
- Workout completion rate (started vs. finished)
- Average reps per Tabata block
- Cycle completion rate

### Firebase Analytics Events

```typescript
analytics().logEvent('workout_complete', {
  week: 1,
  day: 1,
  duration: 972,
  burpees: 120,
  flyingSquats: 240,
  feelRating: 4
});

analytics().logEvent('cycle_complete', {
  totalBurpees: 2847,
  totalFlyingSquats: 5694,
  duration: 8 // weeks
});
```

## Future Enhancements

- **Social features:** Share workout completions
- **Leaderboards:** Top performers (opt-in)
- **Challenges:** Community burpee challenges
- **Coaching insights:** AI analysis of rep consistency
- **Heart rate zones:** Advanced performance tracking

---

**Last Updated:** 2025-12-24
**Version:** 1.0
**Status:** Architecture defined, implementation pending