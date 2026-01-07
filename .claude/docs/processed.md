# GRHIIT Processed Work Log

## Session: Jan 4, 2026

### Completed: Expo Best Practices Setup

**Goal**: Follow Expo's 12 tips for project setup.

**Changes**:
- Created `eas.json` with build profiles (development, preview, production)
- Added font fallback with 5s timeout in `_layout.tsx` (prevents infinite loading if fonts fail)
- Added ESLint + Prettier configuration (`eslint.config.js`, `.prettierrc`)
- Installed `expo-dev-client` for better debugging
- Added npm scripts: `lint`, `lint:fix`, `format`

---

### Completed: ESLint Fixes (24 issues)

**Critical bug fixed**:
- `app/workout/index.tsx`: `useMemo` hooks called after early return (violates Rules of Hooks)
- Moved hooks before `if (!workout) return` block

**Other fixes**:
- Unescaped JSX entities in `login.tsx`, `complete.tsx`, `workout/index.tsx`
- Unused variables removed across 6 files
- Missing hook dependencies added or eslint-disable comments for intentional patterns
- Firebase duplicate imports consolidated
- Array type style updated (`Array<T>` → `T[]`)

---

### Completed: Font Bundle Optimization

**Removed**: JetBrains Mono (~1MB saved)
- Was legacy, not used anywhere
- Only Space Grotesk + Chakra Petch needed

**Updated** `app/_layout.tsx`:
- Removed JetBrains Mono imports and useFonts entries

---

### Completed: Timer Size Increase for Large Screens

**Goal**: Larger numbers for iPhone 17 / Pro Max.

**Changes** (`src/lib/responsive.ts`):
- `timerSize`: 320 → 340 (large screens)
- `timerFontSize`: 112 → 128 (large screens)
- `timerStroke`: 10 → 12 (large screens)

---

## Session: Jan 3, 2026 (Evening)

### Completed: Color System Formalization

**Goal**: Single source of truth for colors, eliminate hardcoded hex values.

**Changes**:
- `tailwind.config.js`: Added missing colors (`grhiit-red-deep`, `muted`, `surface`, `warning`)
- Created `src/constants/colors.ts`: Mirrored TW colors for JS contexts (SVG, Feather icons)
- `app/workout/active.tsx`: Replaced all hardcoded hex values with TW classes or constants

**Usage pattern**:
- TW classes (`bg-surface`, `text-muted`) for JSX
- Constants (`GRHIIT_RED`, `TIMER_COLORS`) for SVG/dynamic styles

---

### Completed: Combo Preview Grouping

**Problem**: Cycling combos like `JSQ + SQTH + JLNG/LNG + MC` displayed as 16 individual bentos instead of one grouped card.

**Fix** (`app/workout/index.tsx`):
- `groupBlocksForDisplay()`: Now groups by `comboGroup` in addition to `group`
- `getPatternFromBlocks()`: Uses pre-computed `comboDisplayName` from converter
- `countRoundsFromBlocks()`: Calculates rounds as `totalBlocks / movementsPerCycle`

**Result**: Shows "4 ROUNDS" with "JSQ + SQTH + JLNG/LNG + MC" pattern

---

### Completed: Combo Interval Counter in Active Timer

**Problem**: Showed "INTERVAL 1/1" for each combo block instead of position in combo.

**Fix** (`app/workout/active.tsx`):
- Added `getComboIntervalInfo()` function
- Calculates position within combo using `comboGroup` metadata
- Now shows "INTERVAL 2/16" for second movement in a 16-interval combo

---

### Completed: Timer UI Refinements

**Font size reductions** (`src/lib/responsive.ts`):
- Timer numbers: `responsive(100, 120, 140)` → `responsive(80, 96, 112)`
- Movement name: Fixed `text-2xl` → `sizing.headerSmall` with `numberOfLines={1}` and `adjustsFontSizeToFit`

**TARGET badge** (`app/workout/active.tsx`):
- Fixed height container (28px) to prevent layout shift between work/rest
- Font: `text-xs` (12px)
- Border radius: 6px (more square)
- Padding: `px-3 py-0.5`

---

### Completed: Audio Silent Mode Fix

**Problem**: Beeps not playing on iOS physical device even with volume up.

**Fix** (`src/lib/audio.ts`):
- Added `setAudioModeAsync({ playsInSilentMode: true })` during initialization
- Audio now plays regardless of iOS silent switch

---

### Completed: Block Complete Beep Logic for Combos

**Problem**: 5-beep "block complete" sound fired between each movement in a combo.

**Fix** (`app/workout/active.tsx`):
- Check if previous and current blocks share same `comboGroup`
- Only play block complete beep when leaving a combo entirely

---

## Session: Jan 3, 2026

### Completed: Movement Rename (OGBRP → SQTH)

**Goal**: Rename "Burpees" movement to "Squat Thrust" throughout the codebase.

**Changes**:
- `scripts/convert-workouts.js`: `'SQTH': 'SQUAT THRUST'` (was `'OGBRP': 'BURPEES'`)
- `app/(tabs)/library.tsx`: Updated movement library entry
- `src/constants/sampleWorkout.ts`: Updated legacy sample
- `src/types/index.ts`: Updated code comments
- All CSV files: Replaced OGBRP with SQTH
- Documentation: Updated all examples

---

### Completed: Google Drive Sync Pipeline

**Goal**: Sync workout CSVs directly from Google Drive instead of manual download.

**Setup**:
- Installed `rclone` via Homebrew
- Configured `gdrive` remote with OAuth
- Drive folder ID: `1p478tYwUL56tc2CUODYd976kDiPmLM2m`

**New Files**:
- `scripts/sync-workouts.sh` - Syncs CSVs from Drive and runs converter
- Updated `package.json` with `npm run sync-workouts` command

**Workflow**:
```bash
npm run sync-workouts  # Syncs from Drive + converts to JSON
```

**Converter Updates**:
- Added `W1:D1.csv` filename format support (rclone exports with colon)
- Pattern: `rcloneMatch || googleMatch || legacyMatch`

---

### Completed: Combo Parser Improvements

**Goal**: Support choice movements within combos and show clean display names.

**Problem**: CSV like `JSQ(2-3) + SQTH(2-3) + JLNG/LNG(2-3) + MC(4-5)` was:
- Failing to parse (choice `/` checked before combo `+`)
- Showing raw codes with rep targets in preview

**Changes to `scripts/convert-workouts.js`**:
- Reordered checks: combo (`+`) now checked BEFORE choice (`/`)
- Added `parseMovementPart()` function to handle choice parts within combos
- Cycling mode uses clean display names (no rep targets)
- Sequential mode only shows `N×` prefix when count > 1

**Preview Display Results**:
- `JUMP SQUATS + SQUAT THRUST + JUMP LUNGES / LUNGES + MOUNTAIN CLIMBERS` ✓
- `SQUAT THRUST + FLYING SQUATS + SQUAT THRUST` (3-movement sequential) ✓
- `2× SQUAT THRUST + 2× FLYING SQUATS` (counts > 1 shown)

**Changes to `app/workout/index.tsx`**:
- `getPatternFromBlocks()` now uses `displayName` instead of raw codes
- Simplified to just join display names (no bracket notation in preview)

---

## Session: Dec 30, 2025

### Completed: Bracket Notation for Sequential Combos

**Goal**: Support explicit interval counts per movement in combo blocks using bracket notation.

**New Notation**:
- `[2]OGBRP(8-10) + [2]FLSQ(15-20)` with 4 intervals
- Creates sequential blocks: OGBRP, OGBRP, FLSQ, FLSQ (not cycling)
- Bracket sum must equal total intervals column (validation with warning)

**Syntax Support**:
- Prefix: `[2]OGBRP` - 2 intervals of OGBRP
- Suffix: `OGBRP[2]` - same meaning, alternate position
- Combined: `[2]OGBRP(8-10)` - 2 intervals with 8-10 rep target

**Changes**:
- `scripts/convert-workouts.js`:
  - Added `parseMovementWithIntervalCount()` function for bracket parsing
  - Updated combo handler to detect bracket notation
  - Sequential mode creates blocks in order (A,A,B,B) vs cycling (A,B,A,B)
  - Adds `comboGroup`, `comboDisplayName`, `comboPosition` metadata
- `src/types/index.ts`: Added combo metadata properties to WorkoutBlock
- `DESIGN.md`: Documented bracket notation syntax and behavior

**Existing Behavior Preserved**:
- Combos without brackets still cycle: `A + B + C` → A,B,C,A,B,C...
- Rep target parsing unchanged: `OGBRP(8)` = 8 reps per interval

---

## Session: Dec 29, 2025 (Continued)

### Completed: Stats Page Rework

**Goal**: Cleaner, more focused stats layout following v1 launch guide.

**Structure**:
- **Top Section**: 3 fixed stats row (Sessions, Time Under Load, Avg Time)
- **Middle**: Summit Reps (BRP/FLSQ totals with interval counts)
- **Health**: Collapsible section (Avg BPM, Max BPM, Intensity) - collapsed by default
- **Bottom**: Recent sessions log with W3:D1 format

**Key Changes**:
- Removed horizontal scroll for top stats (now fixed row)
- Health section collapsed by default (supportive, not dominant)
- Session codes formatted as W3:D1 instead of week3-day1

---

### Completed: Complete Screen Redesign

**Copy & UX Refinements**:
- Title: "Week X - Day Y" + "COMPLETE" (not generic "WORKOUT COMPLETE")
- Summit reps prompt: "What rep count did you hold across Summit intervals?"
- Movement labels: "SUMMIT — BURPEES" / "SUMMIT — FLSQ" (explicit context)
- DONE button always enabled (reps are optional, no shame for skipping)
- Difficulty: "How close to the edge was this?" with scale (Comfortable → Very hard → Maximal)

**Session Taglines**:
- Created `src/constants/sessionTaglines.ts` with 24 unique taglines
- Each week/day has specific motivational quote reflecting program phase
- Week 1: "Learning the System", Week 8: "The Summit"

**Technical Fixes**:
- Dev "SKIP → COMPLETE" button now sets elapsed time from workout duration
- Unified GRHIIT_RED to #EF4444 everywhere (logomark was using #E8110F)
- Removed moderateScale() - using consistent Tailwind classes like other screens

---

### Completed: Logomark Refinements

- Reduced G letter scale from 1.2388 → 1.05 for more breathing room
- Centered G within octagon (adjusted translate values)
- Unified color to #EF4444 (was #E8110F in logomark)

---

## Session: Dec 29, 2025

### Completed: Home Screen UI Refinements

**Progress Grid Simplification**:
- Removed active week emphasis (all weeks same size: 28px bars, 36px rows)
- Added Feather lock icons to locked workout cells
- Removed pulsing animation from current workout (static red outline)
- Cell states: Completed (red fill), Current (red outline), Locked (lock icon), Missed (gray border)

**Stats Bentos Reduced**:
- Changed from 5 bentos to 3: SESSIONS, TIME UNDER LOAD, THIS WEEK
- Renamed TIME to TIME UNDER LOAD (with line break)
- Changed `totalMinutes` to `totalSeconds` in userStore for precise MM:SS display

**Dev Mode Enhancements**:
- Added quick action buttons: +1 (complete workout), W2 (jump to week 2), RESET
- Lock icons hidden for available workouts in dev mode (allows tapping)
- Removed green border dev indicator (was cluttering UI)

---

### Completed: CSV Pipeline Section Column

**Goal**: Explicit section assignment instead of heuristic detection.

**CSV Format Update**:
```csv
movement,intervals,work,rest,Time,Group,Type,Section
8CBB,10,6,3,90,C,,RAMP
OGBRP,3,20,10,90,A,,SUMMIT
JSQ,10,6,3,90,D,,RUNOUT
```

**Changes**:
- `scripts/convert-workouts.js` parses Section column (index 7)
- Preview groups items by explicit `section` property
- Section values: `RAMP`, `SUMMIT`, `RUNOUT` → map to `RAMP-UP`, `SUMMIT`, `RUN-OUT`

---

### Completed: Google Sheets Filename Support

**Goal**: No manual renaming when downloading CSVs from Google Sheets.

**Change**: Converter now parses both formats:
- `W1_D1 - Sheet1.csv` → Week 1, Day 1 (Google Sheets)
- `week1-day1.csv` → Week 1, Day 1 (legacy)

---

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

**Available workouts**: 10 (W1D1 through W4D1)

---

## Next Steps

1. **Implement actual sharing** - `react-native-view-shot` + `react-native-share`
2. **Dynamic rep pickers** - Pull movements from actual workout data (not hardcoded BRP/FLSQ)
3. **Persist rep data** - Store in userStore for stats/history
4. **Add remaining workouts** - Create CSV files for full program (24 total)
5. **Test timer with new combos** - Verify 3-movement sequential and choice combos work in active timer
