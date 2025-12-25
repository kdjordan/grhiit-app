# GRHIIT Processed Work Log

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

1. **Add Group column to CSVs** - Tag repeated blocks for round display
2. **Complete screen** - Post-workout identity check-in
3. **Test on device** - Verify timer + audio performance
4. **Add remaining workouts** - Create CSV files for full program
