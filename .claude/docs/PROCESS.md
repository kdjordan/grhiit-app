# GRHIIT Development Process

## Current Focus: CSV Pipeline & Movement Expansion

Major overhaul of workout CSV format to support complex interval types.

---

## Latest Session (Dec 27)

### Completed
- **CSV Pipeline Major Overhaul**
  - New format: `movement,intervals,work,rest,Time,Group,Type`
  - Type column: `SM` = smoker (no true rest, hold position)
  - REST rows now have `intervals=1` (not empty)
  - Orphan total row at bottom is ignored

- **Movement Notation System**
  - `+` = combo cycling (A → B → C → A → B → C... not sequential blocks)
  - `>` = sequence (multiple movements in one work phase)
  - `/` = choice (user picks either movement, e.g., `JLNG/LNG`)
  - `(X)` = exact rep target (e.g., `OGBRP (8)`)
  - `(X-Y)` = range rep target (e.g., `FLSQ (2-3)`)

- **New Movement Codes**
  - `6CBB` - 6-Count Bodybuilders
  - `STPSQ` - Stop Squats
  - `OGBRP` - Original Burpee (no push-up, continuous)
  - `PUBRP` - Push-up Burpee (with push-up, isolated)
  - `TH` - Thrusters
  - `ZPR` - Zippers
  - `PL` - Plank
  - `JJ` - Jumping Jacks
  - `JK` - Jacks

- **Smoker Block Support**
  - `PL > OGBRP` with Type=SM = plank hold during "rest"
  - Timer stays red (no true rest)
  - Movement name alternates: BURPEES → PLANK → BURPEES

- **Active Timer Fixes**
  - Fixed CircularTimer animation for same-duration phases
  - Added phase to phaseKey for unique animation triggers
  - Rep target display supports string ranges

- **Library Screen**
  - Expanded to 17 movements with descriptions

### Technical Decisions
- **OGBRP vs PUBRP**: Original burpee displays as "BURPEES", push-up variant as "PUSH-UP BURPEES"
- **Combo cycling**: `A + B + C` with 18 intervals = 6 cycles, each movement once per cycle
- **File naming**: `week2-day1.csv` not `week2-day4.csv` (days reset per week)

### Bug Fixes
- Fixed `averageHeartRate` variable name mismatch in userStore.ts

### Files Changed
- `scripts/convert-workouts.js` - Major rewrite for new notation
- `src/types/index.ts` - Added smoker, sequence, choice block properties
- `app/workout/active.tsx` - Smoker display, animation fix
- `app/(tabs)/library.tsx` - 17 movements
- `src/stores/userStore.ts` - Variable name fix

---

## Earlier Session (Dec 25 - Night)

### Completed
- **Post-Workout Complete Screen Redesign**
  - Red logomark with animated entrance (replaces green checkmark)
  - "WORKOUT COMPLETE" header (ChakraPetch 28px)
  - Time display from actual workout elapsed time
  - Removed HR card (no HealthKit yet)
  - 5 rapid beeps on completion via `playBlockCompleteBeep()`

- **Summit Rep Tracking**
  - "SUMMIT REPS" section with context: "How many reps per Tabata interval?"
  - Two tap-to-select buttons: BRP (4-12 range) and FLSQ (8-25 range)
  - Red "TAP" buttons by default → show number after selection
  - Modal picker with number grid for each movement
  - No keyboard needed - just tap the number

- **Difficulty Rating**
  - "How hard was this?" 1-5 scale
  - Red highlight on selected rating
  - "Easy" / "Brutal" labels

- **DONE Button Gating**
  - Button disabled (gray) until all 3 inputs filled:
    - BRP reps
    - FLSQ reps
    - Difficulty (1-5)
  - Enables with red background + glow when complete

- **Share Screen (`/workout/share`)**
  - Prompts user to share after completing workout
  - 4 template previews: Minimal, Brutal, Stats, Dark
  - Each template shows actual workout data (reps, week/day)
  - Platform buttons: Instagram, TikTok, X, Save to Photos
  - "Skip for now" option at bottom
  - Data passed via route params from complete screen

### Technical Decisions
- **Rep tracking model**: Reps per interval (pace held), not cumulative total
- **Tap picker vs input**: Modal grid picker for exhausted users - no keyboard
- **Required fields**: All three inputs required before proceeding
- **Share flow**: Complete → Share → Home (share is skippable)

### Files Changed
- `app/workout/complete.tsx` - Full redesign with rep pickers
- `app/workout/share.tsx` - New share screen with templates

---

## Earlier Session (Dec 25 - Evening)

### Completed
- **Workout Preview Screen Redesign**
  - Collapsed by default with "VIEW BREAKDOWN" toggle
  - Section headers: RAMP-UP → SUMMIT → RUN-OUT (not "cool-down")
  - Inline REST indicators (divider lines with duration)
  - Auto-generated taglines per workout name
  - Video placeholder container (16:9 aspect ratio)
  - LayoutAnimation for smooth expand/collapse

- **LIBRARY Tab Added**
  - New tab between TRAIN and STATS
  - Icon: `book-open`
  - Lists 8 movements with descriptions (removed High Knees)
  - Each card shows: name, code badge, description, video placeholder

- **TRAIN Screen Overhaul**
  - Loads actual workouts from JSON (Foundation, Build, Push, Fortify)
  - Removed difficulty bars and filter tabs
  - Shows movement tags per workout
  - Progression locking: must complete previous workout to unlock next
  - States: Completed (green check), Current (red play), Locked (lock icon)
  - Dev mode bypasses locks

- **UI Cleanup**
  - Removed play icons from START buttons (text only)
  - Removed duplicate `index 2.tsx` file causing extra tab
  - Dev shortcut: "SKIP → COMPLETE" button on preview screen

- **Dependency Cleanup**
  - Removed `expo-av` (deprecated in SDK 54)
  - Using `expo-audio` for sounds, `expo-video` for future video

### Technical Decisions
- **Section naming**: RUN-OUT (not COOL-DOWN) - maintaining intensity while fatigued
- **Taglines**: Auto-generated from workout name map with week fallbacks
- **Progression**: `workoutNumber = (week - 1) * 3 + day`

---

## Earlier Session (Dec 25)

### Completed
- **Color scheme corrected for red-lining philosophy**
  - WORK = RED background (#991B1B) - intensity, brand
  - REST = BLACK background (#0A0A0A) - recovery
  - Ring: red for work, white for rest

- **MASSIVE timer number** - 168px font, fills the circle
  - Timer size: 280px diameter, 8px stroke
  - Number dominates screen during countdown

- **Minimal UI during workout**
  - Removed stats row (elapsed, remaining, progress %)
  - Removed WORK/REST label - color communicates state
  - Kept only: interval counter, movement name, timer, up next, buttons

- **Audio beeps implemented**
  - Using `expo-audio` with `createAudioPlayer`
  - Single beep: work start, rest start, countdown (3, 2, 1)
  - 5 rapid beeps: when full interval block completes
  - Sound file: `assets/sounds/single-beep.wav`

- **Quit workout tracking**
  - Quitting marks workout as MISSED (X) in progress grid
  - Added `quitWorkout()` to userStore
  - Added `completedWorkoutIds[]` and `missedWorkoutIds[]` arrays
  - Home screen now reads from userStore (not hardcoded test data)

- **Removed rep target** from sample workout (feature deferred)

### Technical Decisions
- **expo-audio vs expo-av**: Using expo-audio (expo-av deprecated in SDK 54)
- **Quit consequences**: Quitting advances to next workout AND marks as missed

---

## Earlier (Dec 24)

### Completed
- **Circular progress timer** replaced flip clock
  - `CircularTimer` component using `react-native-svg`
  - Smooth 60fps animation via React Native Animated API
  - Avoids Reanimated worklet issues

---

## Earlier (Dec 24)

### Completed
- **Roman numerals on Progress Grid**: Added I-XXIV to workout bricks
  - White on completed (red) bars, gray on incomplete
  - `toRoman()` helper function in ProgressGrid.tsx

- **Font unification**: Changed all numbers from JetBrains Mono → Space Grotesk
  - Removed dotted zeros (programmer aesthetic didn't fit)
  - Updated: Home screen stats, active timer, pre-workout preview
  - Files changed: `app/(tabs)/index.tsx`, `app/workout/active.tsx`, `app/workout/index.tsx`

---

## Previous Session: Workout Timer Flow (Complete)

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
Uses React Native's built-in `Animated` API (not Reanimated):
- `CircularTimer` with `Animated.createAnimatedComponent(Circle)`
- Single animation runs for full interval duration
- `strokeDashoffset` interpolation for smooth ring fill

### Audio System
Using `expo-audio` with `createAudioPlayer`:
- Sound preloaded on init: `assets/sounds/single-beep.wav`
- `playBeep()` - seeks to 0, plays
- `playBeepMultiple(5, 150)` - 5 beeps with 150ms delay for block complete

### Timer Implementation
- 1-second interval via `setInterval`
- `tick()` function handles all phase transitions
- Elapsed time doesn't increment during countdown
- Progress calculated from elapsed / total duration

---

## Next Steps

1. **Holistic rep tracking** - Track all movements (not just BRP/FLSQ summit)
2. **Dynamic rep pickers** - Pull movements from actual workout data
3. **Implement actual share** - `react-native-view-shot` + `react-native-share`
4. **HealthKit integration** - Replace mock data with real Apple Health data
5. **Remove JetBrains Mono** - Clean up unused font from bundle
6. **Add more share templates** - Per viral.md roadmap (200+ templates goal)
7. **Sequence block timer display** - Show both movements during work phase
8. **Choice block UI** - Visual indicator that user picks movement

## Code Review Status

**Last reviewed:** Dec 25, 2025
**Result:** Ready to commit
- No security issues
- No dead code or unused imports
- One minor cleanup: debug `console.log` in share.tsx (acceptable for dev)

---

## Dev Commands

```bash
npm start              # Expo dev server (run in separate terminal)
npm run ios            # iOS simulator
npm run convert-workouts  # Convert CSV → JSON (workouts/csv/ → assets/workouts/)
npm run prebuild       # Runs convert-workouts + expo prebuild
```

**Workout CSV format:** `workouts/csv/weekX-dayX.csv`
```csv
movement,intervals,work,rest,Time,Group,Type
8CBB,10,6,3,90,,
REST,1,,30,30,,
OGBRP + FLSQ,8,20,10,240,A,
PL > OGBRP,20,3,3,120,,SM
```

**Notation**: `+` combo, `>` sequence, `/` choice, `(X)` rep target, Type=SM smoker

**Dev flags:**
- `EXPO_PUBLIC_DEV_SKIP_AUTH=true` - Skip auth
- `EXPO_PUBLIC_DEV_SKIP_SPLASH=true` - Skip splash animation
- `EXPO_PUBLIC_DEV_WORKOUT_SELECT=true` - Tap progress grid to select any workout
- `EXPO_PUBLIC_DEV_PERSIST_STATS=true` - Generate mock HealthKit data (calories, HR)
