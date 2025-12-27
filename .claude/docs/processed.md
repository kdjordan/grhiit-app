# GRHIIT Processed Work Log

## Session: Dec 26, 2025

### Completed: Cumulative Stats Tracking in UserStore

**Goal**: Persist workout stats across sessions for progress tracking.

**New State in `userStore.ts`**:
- `totalSessions` - count of completed workouts
- `stats.brp` / `stats.flsq` - cumulative reps, intervals, sessions per movement
- `stats[movement]` - dynamic tracking for 8CBB, JSQ, etc.
- `totalCalories`, `averageHeartRate`, `maxHeartRate` - mock HealthKit data
- `recentSessions[]` - last 10 sessions with date, reps, duration, difficulty

**New Types**:
- `SessionStats` - passed when completing workout (reps, intervals, difficulty, duration)
- `MovementStats` - cumulative stats per movement type

**New Dev Flag**:
- `EXPO_PUBLIC_DEV_PERSIST_STATS=true` - generates mock HealthKit data (calories, heart rate)

**Updated Actions**:
- `completeWorkout(sessionStats)` - now accepts full session data, persists everything
- `resetStats()` - new action to clear cumulative stats (dev mode)

---

### Completed: Stats & Settings UI Overhaul

**Goal**: Match Statistics and Settings screens to Home screen design system.

**Design System Applied**:
| Element | Before | After |
|---------|--------|-------|
| Background | `#141414` / `#111` | `#000000` (pure black) |
| Bento cards | `#141414` + borders | `#1a1a1a`, no borders, 16px radius |
| Fonts | Generic `font-bold`, JetBrainsMono | SpaceGrotesk throughout |
| Icons | None / emoji | Feather icons, red `#EF4444` accent |

**Stats Screen** (`app/(tabs)/stats.tsx`):
- Horizontal scrolling stat bentos (Sessions, Total Time, Avg Time, Calories)
- Summit Reps section (BRP/FLSQ cards with totals + intervals)
- Heart Rate section (Avg BPM, Max BPM, Intensity)
- Recent Sessions list with workout IDs, dates, reps
- Empty state when no sessions
- **Reads real data from userStore**

**Settings Screen** (`app/(tabs)/settings.tsx`):
- Profile card with Feather user icon
- Grouped settings with icons (Notifications, Health, About, Developer)
- `SettingsRow` component with consistent styling
- Reset All Progress button (dev mode) - calls `resetProgress()` + `resetStats()`

---

### Completed: Home Screen Dynamic Stats

**Goal**: Replace hardcoded stats with real userStore data.

**Changes to `app/(tabs)/index.tsx`**:
- Added: `totalMinutes`, `totalCalories`, `recentSessions` from userStore
- TIME: `formatTotalTime(totalMinutes)` - shows `0:00` when fresh
- STREAK: Calculated from `recentSessions` - consecutive days
- KCAL: `totalCalories.toLocaleString()` - shows `0` when fresh
- BEST: `bestReps` from highest `totalReps` in recent sessions

---

## Session: Dec 25, 2025 (Latest)

### Completed: Share Screen Total Reps & Full Workout Data

**Goal**: Display total reps (not just per-interval) and include all workout movements in share templates.

**Changes to `complete.tsx`**:
- Extract workout summary from `workoutStore.workout.blocks`
- Count BRP and FLSQ intervals separately
- Aggregate other movements (8CBB, JSQ) with interval counts and timings
- Pass all data to share screen via route params

**Changes to `share.tsx`**:
- Parse new params: `brpIntervals`, `flsqIntervals`, `totalSummitIntervals`, `week`, `day`, `workoutName`, `otherMovements`
- Calculate total reps: `repsPerInterval × intervals`
- Updated all 4 templates to show totals:
  - **Minimal**: "18 BURPEES (3×6)" format
  - **Brutal**: Big summit total + "X TABATA INTERVALS"
  - **Stats**: Full breakdown with other movements (e.g., "20× 8CBB @ 6/3")
  - **Dark**: Summit total with calculation shown

---

### Completed: Icon-Only Tab Bar

**Goal**: Remove text labels from bottom navigation.

**Changes to `app/(tabs)/_layout.tsx`**:
- Added `tabBarShowLabel: false`
- Reduced height from 85px to 70px
- Removed `tabBarLabelStyle` (no longer needed)

---

## Session: Dec 25, 2025 (Continued)

### Completed: Dev Mode Workout Selection

**Goal**: Wire up workouts from JSON and allow selecting any workout for testing.

**Created**:
- `src/lib/workoutLoader.ts` - Functions to load workouts from JSON
- `src/stores/devStore.ts` - Dev-only state for workout selection

**Updated**:
- `src/types/index.ts` - Added `group` field to WorkoutBlock
- `src/components/ProgressGrid.tsx` - Tappable workouts in dev mode
- `app/(tabs)/index.tsx` - Dev mode handling, "TAP TO SELECT" hint
- `app/workout/index.tsx` - Loads from JSON, shows dev mode badge
- `scripts/convert-workouts.js` - Parses Group column from CSV
- `.env` - Added `EXPO_PUBLIC_DEV_WORKOUT_SELECT=true`

**How dev mode works**:
1. Enable via `EXPO_PUBLIC_DEV_WORKOUT_SELECT=true`
2. Progress grid shows green borders on workouts with JSON data
3. Tap to select → preview that workout
4. Preview shows "DEV MODE: week1-day2" badge
5. Timer runs selected workout

---

### Completed: Round Grouping in Preview

**Goal**: Collapse repeated BRP + FLSQ blocks into "X ROUNDS" display.

**CSV format** (new Group column):
```csv
movement,intervals,work,rest,Time,Group
BRP + FLSQ,2,20,10,60,A
REST,,,30,30,
BRP + FLSQ,2,20,10,60,A
```

**Preview display**:
- Blocks with same Group tag collapse into single card
- Shows "3 ROUNDS" badge, pattern, timing, rest between
- REST blocks between grouped items absorbed

---

### Completed: Session Preview Redesign

- Smaller, compact bentos (removed progress bars)
- REST blocks as yellow bentos (`#92400E/20` background)
- Stats: duration, total intervals, movements
- Round groups with special styling

---

## Current State

**Working**:
- CSV → JSON pipeline with Group support
- Dev mode workout selection
- Preview loads from JSON
- Timer runs selected workout
- Round grouping in preview

**Available workouts**: 3 (week1-day1 through week1-day3)

---

## Next Steps

1. **Test on device** - Verify share screen layout with new total reps display
2. **Implement actual sharing** - `react-native-view-shot` + `react-native-share`
3. **Dynamic rep pickers** - Pull movements from actual workout data (not hardcoded BRP/FLSQ)
4. **Persist rep data** - Store in userStore for stats/history
5. **Add remaining workouts** - Create CSV files for full program
6. **Remove JetBrains Mono** - Clean up unused font from bundle
