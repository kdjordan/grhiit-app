# GRHIIT Development Process

## Current Focus: Workout Timer Flow (Complete)

The full workout timer flow is now implemented with block-based progression, variable timings, REST-first intervals, 15-second countdown, and the active timer UI with phase-colored bento design.

---

## Session Summary

### Workout Data Structure
Created a block-based workout system to handle variable timings per exercise:

```typescript
interface WorkoutBlock {
  id: string;
  movement: string;        // "8CBB", "JSQ", "BRP", "FLSQ", "REST"
  displayName: string;     // "8-COUNT BODYBUILDERS"
  intervals: number;       // Number of work intervals
  workDuration: number;    // Seconds (0 for REST blocks)
  restDuration: number;    // Seconds
  repTarget?: number;      // Optional rep goal
  isTransition?: boolean;  // True for REST blocks
}
```

### Sample Workout (Foundation)
Implemented from CSV data:
- **8CBB**: 10 intervals × 6s work / 3s rest
- **REST**: 30s transition
- **JSQ**: 10 intervals × 6s work / 3s rest (target: 3 reps)
- **REST**: 30s transition
- **BRP + FLSQ**: 5 sets of alternating (1 each) × 20s work / 10s rest
- Symmetrical cool-down (JSQ → 8CBB)

**Total duration: ~15-16 minutes**

### Timer Logic

#### Phase Types
- `countdown` - 15 seconds before workout starts
- `work` - Active exercise interval
- `rest` - Rest period between intervals within a block
- `transition` - REST block between exercises (30s)
- `complete` - Workout finished

#### REST-First Interval Flow
Each interval follows REST → WORK order (not WORK → REST):
1. Block starts with REST phase
2. REST ends → WORK phase
3. WORK ends → next interval REST (or next block)

This gives athletes time to prepare before each work phase.

### Active Timer UI

#### Color Scheme
- **WORK**: Green (#22C55E text, #166534 background)
- **REST**: Red (#EF4444 text, #991B1B background)
- **TRANSITION**: Yellow (#F59E0B text, #92400E background)
- **COUNTDOWN**: Gray (#FFFFFF text, #1F2937 background)

#### Layout
1. Progress bar at top (green fill)
2. Timer bento with solid phase-colored background
3. Movement name + interval counter
4. Large two-digit timer with rolling animation (ones digit only)
5. Phase indicator badge
6. Up Next card
7. Stats row (elapsed, remaining, progress %)
8. RESTART and CANCEL buttons

#### Control Philosophy
- **No pause button** - once started, workout runs continuously
- **No skip button** - can't skip intervals
- **RESTART** - confirmation dialog, then reset and start over
- **CANCEL** - confirmation dialog, then return to home

### Audio System
Created `src/lib/audio.ts` with stubbed functions:
- `playWorkBeep()` - triggered when work phase starts
- `playRestBeep()` - triggered when rest/transition starts
- `playCountdownBeep()` - triggered at 3, 2, 1

Currently logs to console. Real audio pending bundled sound files.

---

## File Changes

### New Files
- `src/types/index.ts` - WorkoutBlock, WorkoutProgram types
- `src/constants/sampleWorkout.ts` - Sample workout data + helpers
- `src/lib/audio.ts` - Audio beep utilities (stubbed)

### Modified Files
- `src/stores/workoutStore.ts` - Complete rewrite for block-based logic
- `app/workout/index.tsx` - Pre-workout preview screen
- `app/workout/active.tsx` - Active timer with bento design

---

## Current File Structure

```
app/
├── (tabs)/
│   ├── index.tsx        # HOME - "START NEXT SESSION" button
│   └── ...
├── workout/
│   ├── _layout.tsx      # Stack navigator
│   ├── index.tsx        # Pre-workout preview
│   ├── active.tsx       # Active timer (bento design)
│   └── complete.tsx     # Post-workout check-in

src/
├── types/
│   └── index.ts         # WorkoutBlock, WorkoutProgram types
├── constants/
│   ├── workouts.ts      # Legacy workout data
│   └── sampleWorkout.ts # Block-based sample workout
├── stores/
│   └── workoutStore.ts  # Block-based timer logic
└── lib/
    ├── audio.ts         # Beep utilities (stubbed)
    └── ...
```

---

## Workout Timer Flow

```
Home Screen
  ↓ "START NEXT SESSION"
Pre-workout Preview (/workout)
  - Shows full workout breakdown
  - All blocks with timings and rep targets
  ↓ "LET'S GO"
Active Timer (/workout/active)
  - 15-second countdown (gray bento)
  - REST-first intervals
  - Phase-colored bento (green/red/yellow)
  - Rolling timer animation (ones digit only)
  - Audio beeps on phase changes
  ↓ Workout complete
Complete Screen (/workout/complete)
  - Identity check-in
```

---

## Technical Notes

### Animation Approach
Uses React Native's built-in `Animated` API (not reanimated):
- Spring animation for rolling ones digit
- No opacity changes to avoid flashing
- Tension: 100, Friction: 12

### Audio Package
Using `expo-audio` (expo-av is deprecated). Currently stubbed with console.logs until bundled audio files are added.

### Timer Implementation
- 1-second interval via `setInterval`
- `tick()` function handles all phase transitions
- Elapsed time doesn't increment during countdown
- Progress calculated from elapsed / total duration

---

## Next Steps

1. **Add real audio files** - Bundle beep sounds, use expo-audio
2. **Rep tracking UI** - Tap to count reps during intervals
3. **Complete screen** - Post-workout identity check-in
4. **Connect to user progress** - Update stats on completion
5. **Test on device** - Verify timer accuracy and audio

---

## Dev Commands

```bash
npm start       # Expo dev server (run in separate terminal)
npm run ios     # iOS simulator
```

**Dev flags:**
- `EXPO_PUBLIC_DEV_SKIP_AUTH=true` - Skip auth
- `EXPO_PUBLIC_DEV_SKIP_SPLASH=true` - Skip splash animation
