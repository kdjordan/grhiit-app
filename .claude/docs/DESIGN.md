# GRHIIT Design System

## Current State: Bento Layout with Bar Progress (Iteration 7)

The home screen features a **bento-style layout** with a bar-based progress grid, horizontally scrolling stat cards, and a clean minimal aesthetic.

---

## Design Philosophy

**Brand identity**: Precision, intensity, no-nonsense fitness app. Not a consumer fitness app - more like lab equipment, digital stopwatch, aviation instruments.

**Core principles**:
- Bento-style containers with consistent styling
- 16px rounded corners on all cards/buttons
- Pure black background (#000000)
- Gray surface color (#1a1a1a) for bentos
- High contrast
- No gamification fluff
- Feather icons for consistency

---

## Typography

| Use Case | Font | Notes |
|----------|------|-------|
| Numbers (time, reps, stats) | Space Grotesk | Clean zeros without dot (changed from JetBrains Mono) |
| Labels and text | Space Grotesk | Readable, clean |
| Button text | Space Grotesk Bold | Clean and bold |
| Movement names | Chakra Petch Bold | Uppercase, intense |

**Font change rationale**: JetBrains Mono has a dotted zero which looked too programmer-oriented. Space Grotesk provides clean, modern numbers that fit the premium fitness aesthetic.

Fonts loaded in `app/_layout.tsx`:
- JetBrains Mono (400, 500, 600, 700) - legacy, may remove
- Space Grotesk (400, 500, 600, 700)
- Chakra Petch (700)

---

## Color Palette

```
Background:       #000000 (pure black)
Bento surface:    #1a1a1a
Primary text:     #FFFFFF
Secondary text:   #6B7280 (gray-500)
Accent:           #EF4444 (GRHIIT red)
Bar inactive:     #2a2a2a
Bar missed:       #3a3a3a (border only)
```

---

## Icons

Using **Feather** icons from `@expo/vector-icons`:

```tsx
import { Feather } from "@expo/vector-icons";
<Feather name="target" size={40} color="#EF4444" />
```

**Tab bar icons:**
- HOME: `home`
- TRAIN: `zap`
- STATS: `bar-chart-2`
- SETTINGS: `settings`

**Stats bento icons (36px responsive, red):**
- SESSIONS: `target`
- TIME UNDER LOAD: `clock`
- THIS WEEK: `check-circle`

---

## Home Screen Layout

### Structure (top to bottom):

1. **Header**
   - Logomark (32px) on left
   - Identity text on top: "GRHIIT · CYCLE 1" (gray, letter-spacing 1.5)
   - Session info underneath: "Week {X} · Session {Y}" (white, 18px)
   - RESET button (dev mode only, top right)

2. **Progress Bento**
   - Title "PROGRESS" above the bento (outside)
   - Dev mode indicator "TAP TO SELECT" (green, right side)
   - Bento: `bg-[#1a1a1a]`, 16px radius, padding 16px
   - Contains ProgressGrid component (bar-based)

3. **Stats Bentos** (horizontal scroll)
   - 3 bento cards: SESSIONS, TIME UNDER LOAD, THIS WEEK
   - Each: responsive sizing (100px min-width, 140px height)
   - Layout: title (top) → icon (flex-1 centered) → value (bottom)
   - TIME UNDER LOAD: shows accumulated workout time in MM:SS format
   - Icons: responsive 36px, red (#EF4444)
   - Horizontally scrollable with 12px gap

4. **Start Button**
   - Full width, red background (#EF4444)
   - 16px border radius (matches bentos)
   - "START NEXT SESSION" (no play icon)
   - Red glow shadow

### Key Files:
- `app/(tabs)/index.tsx` - Home screen
- `src/components/ProgressGrid.tsx` - The 8×3 bar grid
- `app/(tabs)/_layout.tsx` - Tab navigation with Feather icons

---

## ProgressGrid Component

**Layout**: 8 rows × 3 columns = 24 workouts

**Week labels**: "WEEK 1", "WEEK 2", etc. (not abbreviated)
- Active week: white, 10px
- Inactive weeks: gray (#4B5563), 10px

**Bar sizing** (uniform, no active week emphasis):
- All bars: 28px height
- All row heights: 36px
- Bar border radius: 4px
- Horizontal margin: 4px (mx-1)

**Cell states:**
- **Completed**: Red fill (#EF4444), white day number, no outline
- **Current**: Dark fill (#2a2a2a), red outline (2px), white day number, NO animation
- **Locked**: Dark gray fill (#2a2a2a), lock icon (Feather), no outline
- **Missed**: Transparent with gray border (#3a3a3a)

**Day numbers on bars**: Each bar shows 1, 2, or 3 (representing day within week)
- White text on completed (red) or current bars
- Gray text (#6B7280) on incomplete bars
- Font: Space Grotesk 500 Medium, 11px
- Lock icon replaces number on locked cells

**Dev mode**: Locked cells with available JSON data become tappable (no lock icon)

---

## Stats Bento Styling

```tsx
<View style={[tw`bg-[#1a1a1a] py-4 px-5 items-center`, { borderRadius: 16, minWidth: 110, height: 150 }]}>
  <Text>TITLE</Text>
  <View style={tw`flex-1 justify-center`}>
    <Feather name="icon" size={40} color="#EF4444" />
  </View>
  <Text>VALUE</Text>
</View>
```

Layout uses flex-1 wrapper around icon to center it vertically between title and value.

---

## Button Styling

```tsx
<Pressable
  style={[
    tw`bg-grhiit-red py-4 px-6 flex-row items-center justify-center`,
    {
      borderRadius: 16,
      shadowColor: "#EF4444",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 16
    }
  ]}
>
  <Feather name="play" size={20} color="#FFFFFF" style={tw`mr-2`} />
  <Text>START NEXT SESSION</Text>
</Pressable>
```

---

## Tab Navigation

5 tabs with Feather icons (icons only, no labels):
- HOME (`home`)
- TRAIN (`zap`)
- LIBRARY (`book-open`) - Movement reference
- STATS (`bar-chart-2`)
- SETTINGS (`settings`)

Tab bar styling:
- Background: #0A0A0A
- Border: #262626
- Active: #E8110F (red)
- Inactive: #6B7280 (gray)
- Height: 70px (compact, icons only)
- `tabBarShowLabel: false`

---

## Design Iterations History

### Iteration 1-4: Various approaches
- Technical stopwatch aesthetic (too cold)
- Balanced typography with cards (too busy)
- Brutal minimalism (not satisfied)
- Spiral progress (too abstract)

### Iteration 5: Octagon Grid
- 8×3 octagon grid with numbers
- Sharp corners everywhere

### Iteration 6: Bento Layout
- Bento-style cards with 16px radius
- Active week emphasis
- Horizontally scrolling stats with icons

### Iteration 7: Bar Progress (Current)
- Replaced octagons with simple bars
- Removed numbers from progress grid
- Cleaner, more minimal look
- Taller stat bentos (150px) with better spacing
- Icons centered with flex-1 wrapper

---

## Responsive Scaling System

**File**: `src/lib/responsive.ts`

All UI elements use responsive scaling to adapt to different iOS screen sizes (iPhone SE through Pro Max).

### Core Functions
```typescript
const BASE_WIDTH = 390; // iPhone 13/14 base

scale(size)          // Width-based scaling
verticalScale(size)  // Height-based scaling
moderateScale(size, factor) // Blended scaling
responsive(small, medium, large) // Breakpoint-based values
```

### Sizing Constants
```typescript
sizing = {
  // Timer
  timerSize: responsive(240, 280, 320),
  timerFontSize: responsive(100, 120, 140),
  timerStroke: responsive(6, 8, 10),

  // Typography
  heading: responsive(22, 24, 28),
  body: responsive(14, 16, 18),
  caption: responsive(10, 11, 12),

  // Spacing
  screenPadding: scale(16),
  cardPadding: scale(16)
}
```

### Device Breakpoints
- Small: width < 375px (iPhone SE)
- Medium: 375-414px (iPhone 13, 14)
- Large: width > 414px (iPhone Pro Max)

---

## Design System (Unified)

All screens follow these patterns:

### Colors
- **Background**: `#000000` (pure black)
- **Bento cards**: `#1a1a1a` (no borders)
- **Secondary surface**: `#262626` (icon backgrounds, dividers)
- **Text primary**: `#FFFFFF`
- **Text secondary**: `#6B7280`
- **Accent**: `#EF4444` (red)

### Typography
- **Headers**: `SpaceGrotesk_700Bold`, 24px, white
- **Section labels**: `SpaceGrotesk_500Medium`, 12px, gray `#6B7280`, letter-spacing: 1
- **Values**: `SpaceGrotesk_600SemiBold`, 20-24px, white
- **Body**: `SpaceGrotesk_500Medium`, 14-16px

### Bento Cards
- Background: `#1a1a1a`
- Border radius: 16px
- No borders
- Padding: 16-20px
- Icons: 40px Feather, red `#EF4444`

### Section Headers
```tsx
<Text style={[tw`text-[#6B7280] text-xs mb-3 ml-1`, { fontFamily: "SpaceGrotesk_500Medium", letterSpacing: 1 }]}>
  SECTION NAME
</Text>
```

### Horizontal Scroll Stats
- Width: 110px min
- Height: 150px
- Gap: 12px (gap-3)
- Content: Label (top) → Icon (center, flex-1) → Value (bottom)

---

## Active Timer Screen

### Design Philosophy
The active timer follows the core GRHIIT philosophy: **no escape, only through**. Once a workout starts, there's no pause or skip. The only options are RESTART (start over) or CANCEL (quit entirely).

### Color Scheme
Phase colors communicate workout state at a glance:

```
WORK:       Green (#22C55E text, #166534 background)
REST:       Red (#EF4444 text, #991B1B background)
TRANSITION: Yellow (#F59E0B text, #92400E background)
COUNTDOWN:  Gray (#FFFFFF text, #1F2937 background)
```

**Rationale**: WORK = green (go/active), REST = red (stop/recover). This inverts typical fitness app conventions but aligns with traffic light logic.

### Layout (top to bottom)

1. **Progress Bar** (top edge)
   - 4px height, full width
   - Gray background (#262626)
   - Green fill showing % complete
   - Real-time progress based on elapsed/total time

2. **Timer Bento** (main area)
   - Solid background color based on current phase
   - 24px border radius
   - Contains:
     - **Header**: Interval counter ("INTERVAL 3/10") or phase label
     - **Movement Name**: Large, bold, uppercase (ChakraPetch_700Bold)
     - **Rep Target Badge**: "TARGET: 3" when applicable (white/20 background)
     - **Timer Display**: Large two-digit countdown
     - **Phase Indicator**: "WORK" / "REST" badge

3. **Up Next Card**
   - Shows next exercise block
   - Gray background (#141414), border (#262626)
   - Arrow icon on right

4. **Stats Row** (3 cards)
   - ELAPSED: Time since workout started
   - REMAINING: Time until completion
   - PROGRESS: Percentage complete (green accent)
   - Space Grotesk for numbers

5. **Control Buttons**
   - RESTART: Restart icon, gray styling
   - CANCEL: X icon, transparent with border
   - Both trigger confirmation dialogs

### Color Philosophy (Red-lining)
GRHIIT is about intensity. Colors reflect effort state:
- **WORK**: RED background (`#991B1B`) - intensity, red-lining, brand color
- **REST**: BLACK background (`#0A0A0A`) - recovery, reset
- **COUNTDOWN**: Dark gray (`#141414`) - preparation

Ring colors match:
- Work: Red ring (`#EF4444`)
- Rest/Countdown: White ring on dark background

### Timer Animation - Circular Progress
**Circular progress indicator** with smooth continuous animation:
- SVG circle fills 360° as interval progresses
- MASSIVE seconds number dominates the screen
- Ring animates smoothly at 60fps (not chunky per-second updates)

**Implementation**:
- `CircularTimer` component using `react-native-svg`
- Uses React Native's built-in `Animated` API (not Reanimated - avoids worklet issues)
- `Animated.createAnimatedComponent(Circle)` for smooth strokeDashoffset animation
- Animation kicks off when interval starts, runs for full interval duration
- `strokeDasharray` / `strokeDashoffset` technique for ring fill effect

**Dimensions** (responsive):
- Timer size: 240/280/320px diameter (small/medium/large devices)
- Stroke width: 6/8/10px (responsive)
- Center font size: 100/120/140px (responsive based on device)
- Ring starts at 12 o'clock, fills clockwise

**Technical notes**:
- `useNativeDriver: false` required (strokeDashoffset doesn't support native driver)
- Constants: `RADIUS`, `CIRCUMFERENCE` pre-calculated for performance
- Phase key tracking prevents animation restart on every render

### Minimal Timer UI
During workout, only essentials shown:
- Interval counter ("INTERVAL 3/10") - work phase only
- Movement name
- MASSIVE countdown number in circular progress
- UP NEXT card
- RESTART / CANCEL buttons

**Removed for focus**:
- ~~Stats row~~ (elapsed, remaining, progress %) - moved to post-workout
- ~~WORK/REST label~~ - color communicates state
- ~~Phase indicator badge~~ - redundant

### Control Button Philosophy
- **No pause button**: Once started, the workout runs continuously
- **No skip button**: Can't skip intervals or blocks
- **RESTART**: Confirms via Alert, then resets and restarts
- **CANCEL/QUIT**: Confirms via Alert, marks workout as MISSED (X in grid), advances to next

### Smoker Block Behavior
Smoker blocks (Type=SM) have no true rest - the "rest" phase is an active hold position.

**Display**:
- Background stays RED during both phases (no black rest)
- Ring stays RED during both phases
- Movement name alternates: work movement (BURPEES) ↔ hold movement (PLANK)
- Interval counter continues normally

**Example**: `PL > OGBRP` with 3s work, 3s rest
- [3s] BURPEES (work) → [3s] PLANK (hold) → [3s] BURPEES → [3s] PLANK...

**Technical**: Phase included in CircularTimer's phaseKey to ensure animation restarts when work/rest have same duration.

---

## Pre-workout Preview Screen

### Layout (Collapsed by Default)
1. Back button + dev shortcuts
2. Workout title: "WEEK 1 • DAY 1", name, tagline (italic)
3. Stats row: Duration, intervals, movements
4. Video placeholder (16:9, SESSION WALKTHROUGH label)
5. "VIEW BREAKDOWN" toggle button
6. Fixed "LET'S GO" button at bottom (no icon)

### Taglines
Auto-generated from workout name:
- "Foundation" → "Learn the rhythm"
- "Build" → "Establish the pattern"
- Week-based fallbacks for unknown names

### Expanded Breakdown
Grouped by workout sections:
- **RAMP-UP** (↗ trending-up) - Warmup blocks
- **SUMMIT** (⚡ zap, red accent) - Grouped rounds at peak intensity
- **RUN-OUT** (» chevrons-right) - Maintain intensity while fatigued

### Section Header Component
```
↗ RAMP-UP                    2:30
──────────────────────────────────
```
- Icon + label left, duration right
- SUMMIT gets red accent color

### Inline REST Display
REST periods shown as amber-colored dividers between ALL blocks:
```
──────────── 30s REST ────────────
```
- Amber/yellow color (#F59E0B) for visibility
- Shows between every section (not just some)
- No separate REST cards

### Smoker Block Indicator
Smoker blocks display orange badge in preview:
```
[SMOKER]  PLANK hold
```
- Orange badge (#F59E0B bg at 20% opacity)
- "SMOKER" text in orange
- Hold movement shown alongside (e.g., "PLANK hold")

---

## Components

**Active components:**
- `AnimatedSplash` - Splash screen animation
- `GrhiitLogo` - Full logo with text
- `GrhiitMark` - Logomark only (octagon G)
- `ProgressGrid` - Bar-based 8×3 workout grid

**Removed (cleaned up):**
- `OctagonGrid` - Replaced by ProgressGrid
- `SpiralProgress` - Iteration 4 experiment
- `WorkoutGrid` - Original rectangular grid
- `ScrambleText` - Unused text effect

---

## Reference Aesthetics

- Digital stopwatch
- Lab equipment
- Precision instruments
- Aviation cockpit displays
- Casio watches
- Modern bento UI patterns
- **NOT**: consumer fitness apps, gamified apps

---

## Workout Data Pipeline

### CSV → JSON Build System
Workouts are authored in CSV and converted to JSON at build time.

**Source**: `workouts/csv/` directory
- Google Sheets format: `W1_D1 - Sheet1.csv` (preferred)
- Legacy format: `week1-day1.csv`

```csv
movement,intervals,work,rest,Time,Group,Type,Section
8CBB,10,6,3,90,,,RAMP
REST,1,,30,30,,,
JSQ(2-3) + OGBRP(2-3) + JLNG(2),18,6,3,162,,,RAMP
PL > OGBRP,20,3,3,120,,SM,SUMMIT
JLNG/LNG,10,6,3,90,,,RUNOUT
OGBRP + FLSQ,8,20,10,240,A,,SUMMIT
```

**Output**: `assets/workouts/level-1.json`

### Movement Notation

| Notation | Example | Meaning |
|----------|---------|---------|
| Single | `8CBB` | Standard movement |
| Rep target | `OGBRP (8)` | Exact target: 8 reps |
| Rep range | `FLSQ (2-3)` | Range target: 2-3 reps |
| Combo (+) | `A + B + C` | Cycle through (A→B→C→A→B→C...) |
| Sequence (>) | `FLSQ (2) > OGBRP` | Both in one work phase |
| Choice (/) | `JLNG/LNG` | User picks either |
| Smoker | `PL > OGBRP` + Type=SM | No rest, hold position |

### CSV Columns
- **movement**: Movement code(s) with notation
- **intervals**: Total number of work intervals
- **work**: Work duration in seconds
- **rest**: Rest duration in seconds (for smoker: hold duration)
- **Time**: Ignored (calculated by script)
- **Group**: Tag for round grouping in preview (e.g., "A", "B")
- **Type**: `SM` = smoker, empty = standard
- **Section**: `RAMP`, `SUMMIT`, or `RUNOUT` - explicit section assignment

### Parsing Rules
- REST rows: `intervals=1`, empty work, rest value
- Combo (+): Creates cycling 1-interval blocks (not sequential)
- Orphan total row at bottom (just a number) is ignored
- File naming: `W1_D1 - Sheet1.csv` (Google Sheets) or `week1-day1.csv` (legacy)

**Scripts**:
- `npm run convert-workouts` - Manual conversion
- `npm run prebuild` - Auto-runs converter before Expo prebuild

### Movement Codes (17 total)

**Bodybuilders**: 8CBB, 6CBB
**Squats**: JSQ, FLSQ, STPSQ
**Burpees**: OGBRP (no push-up), PUBRP (with push-up)
**Upper body**: PU, TH, ZPR
**Core/Cardio**: MC, PL, JJ, JK, HK
**Lunges**: LNG, JLNG
**Special**: REST

---

## Workout Loading Architecture

**Files**:
- `src/lib/workoutLoader.ts` - Load workouts from JSON
- `src/stores/devStore.ts` - Dev mode state (selected workout)

**Flow**:
1. Home screen → Preview loads workout from JSON via `workoutLoader`
2. Preview sets workout in `workoutStore`
3. Active screen reads from `workoutStore`

**Dev mode** (`EXPO_PUBLIC_DEV_WORKOUT_SELECT=true`):
- Progress grid shows green borders on available workouts
- Tap any workout to select and preview it
- Shows "DEV MODE: week1-day2" badge in preview

---

## TRAIN Screen

### Layout
- Header: "Sessions" title, workout count
- Scrollable list of workout cards

### Workout Card States
- **Completed** (green check icon): `workoutNumber < currentWorkoutNumber`
- **Current** (red play icon, red border): `workoutNumber === currentWorkoutNumber`
- **Locked** (lock icon, dimmed): `workoutNumber > currentWorkoutNumber`

### Card Content
- Week/Day label + workout name
- Duration badge (clock icon)
- Movement tags (gray pills)
- Action button: START / REPEAT / LOCKED

### Progression Logic
```typescript
const workoutNumber = (week - 1) * 3 + day;
const isUnlocked = isDevMode || workoutNumber <= currentWorkoutNumber;
```

---

## LIBRARY Screen

### Layout
- Header: "Movement Library" + subtitle
- Scrollable list of movement cards

### Movement Card
- Name (white, bold) + code badge (gray pill)
- Description (gray text)
- "Video coming soon" placeholder

### Movements (17 total)
**Bodybuilders**: 8CBB, 6CBB
**Squats**: JSQ, FLSQ, STPSQ
**Burpees**: OGBRP, PUBRP
**Upper body**: PU, TH, ZPR
**Core/Cardio**: MC, PL, JJ, JK, HK
**Lunges**: LNG, JLNG

---

## Dev Environment Notes

- `EXPO_PUBLIC_DEV_SKIP_AUTH=true` - Skip auth for faster iteration
- `EXPO_PUBLIC_DEV_SKIP_SPLASH=true` - Skip splash animation
- `EXPO_PUBLIC_DEV_WORKOUT_SELECT=true` - Enable workout selection in progress grid
- Expo dev server runs in separate terminal
- Icons: `@expo/vector-icons` (Feather set)

### Dev Shortcuts
- Preview screen: "SKIP → COMPLETE" button (orange) - jumps to post-workout screen
- TRAIN screen: All workouts unlocked in dev mode

### Dependencies
- `expo-audio` - Sound playback (beeps)
- `expo-video` - Video playback (future)
- `expo-av` - **REMOVED** (deprecated SDK 54)

---

## Post-Workout Complete Screen

### Layout (top to bottom)
1. **Red Logomark** - GrhiitMark 100px, animated entrance
2. **Session Title** - "Week X - Day Y" (ChakraPetch 24px) + "COMPLETE" (gray, 14px)
3. **Time** - Actual workout duration in MM:SS format
4. **Summit Reps Section** - Optional data capture
5. **Rate This Session** - 1-5 difficulty scale
6. **DONE Button** - Always enabled (reps are optional)
7. **Session Tagline** - Week/day-specific motivational quote

### Summit Reps UI
```
SUMMIT REPS
What rep count did you hold across Summit intervals?

SUMMIT — BURPEES    SUMMIT — FLSQ
    [ TAP ]            [ TAP ]      ← Red bg (#EF4444), white text
    [  4  ]            [  8  ]      ← Dark bg, red border (filled)
```

**Design Philosophy**: Labels explicitly include "SUMMIT —" to reinforce that only Summit work counts, preventing confusion as workouts grow more complex.

**Rep Picker Modal**:
- Dark overlay (black/80)
- Card with "SUMMIT — MOVEMENT" header
- Grid of number buttons (52×52px, 12px radius)
- BRP range: 4-12
- FLSQ range: 8-25
- Selected number highlighted red (#EF4444)
- Tap outside to dismiss

### Difficulty Rating
```
RATE THIS SESSION
How close to the edge was this?

[1] [2] [3] [4] [5]
Comfortable   Very hard   Maximal
```
- 1-5 buttons, selected = red fill
- Three-point scale labels (not just endpoints)
- Reframed from "How hard was this?" to match GRHIIT's mental language

### Button States
**DONE**: Always enabled with red glow - `#EF4444` bg, white text
- No validation required - reps are data, not compliance
- Allows skip without shame

### Session Taglines
Each of the 24 sessions has a unique post-workout tagline stored in `src/constants/sessionTaglines.ts`.

**Examples**:
- W1D1: "You took the first step."
- W4D3: "You earned the right to continue."
- W8D3: "You've seen what staying looks like."

**Fallback**: "You just proved something to yourself."

---

## Share Screen

### Purpose
Prompt users to share workout completion on social media (viral growth mechanism).

### Layout
1. **Header**: "SHARE YOUR SESSION" + "Show the world what you just did"
2. **Template Carousel**: Horizontal scroll of 4 template previews
3. **Platform Buttons**: Instagram, TikTok, X, Save
4. **Skip Option**: "Skip for now" (gray text, bottom)

### Template Styles
| Template | Background | Numbers | Accent |
|----------|------------|---------|--------|
| Minimal  | Black      | White   | Red    |
| Brutal   | Dark       | Red     | White  |
| Stats    | Gray       | White   | Red    |
| Dark     | Black      | White   | White  |

### Template Preview (160px wide, 9:16 aspect)
- Mini logomark (32px)
- Workout stats (reps, week/day)
- Week/Day badge at bottom
- Selected template has red border

### Platform Buttons
- Equal width, side by side
- Dark surface (#1a1a1a), border (#262626)
- Platform icon + label
- Icons: Instagram (pink), TikTok (white), X (blue), Save (green)

### Data Flow
Complete screen passes via route params:
- `time`: formatted elapsed time
- `brp`: burpee reps per interval
- `flsq`: flying squat reps per interval
- `difficulty`: 1-5 rating
- `brpIntervals`: number of BRP intervals in workout
- `flsqIntervals`: number of FLSQ intervals in workout
- `totalSummitIntervals`: total Tabata intervals
- `week`, `day`, `workoutName`: workout metadata
- `otherMovements`: JSON string of non-summit movements (8CBB, JSQ, etc.)

### Total Reps Calculation
Share screen calculates totals from reps-per-interval × interval count:
- `totalBrpReps = brp × brpIntervals`
- `totalFlsqReps = flsq × flsqIntervals`
- `totalSummitReps = totalBrpReps + totalFlsqReps`

### Template Content (Updated)
| Template | Shows |
|----------|-------|
| Minimal  | Total BRP/FLSQ reps with breakdown (e.g., "18 BURPEES (3×6)") |
| Brutal   | Big summit total + "X TABATA INTERVALS" |
| Stats    | Full breakdown: summit reps + Tabata count + other movements |
| Dark     | Summit total with calculation (e.g., "6×3 + 12×3") |

---

## Workout Flow (Complete)

```
Home Screen
  ↓ "START NEXT SESSION"
Preview Screen (/workout)
  ↓ "LET'S GO"
Active Timer (/workout/active)
  ↓ Workout complete
Complete Screen (/workout/complete)
  - Enter summit reps (BRP, FLSQ)
  - Rate difficulty (1-5)
  ↓ "DONE"
Share Screen (/workout/share)
  - Select template
  - Share to platform OR skip
  ↓
Home Screen
```
