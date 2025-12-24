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
| Numbers (time, reps, stats) | JetBrains Mono | Monospace for precision feel |
| Labels and text | Space Grotesk | Readable, clean |
| Button text | Space Grotesk Bold | Clean and bold |
| Bento titles | JetBrains Mono | Uppercase, letter-spaced |

Fonts loaded in `app/_layout.tsx`:
- JetBrains Mono (400, 500, 600, 700)
- Space Grotesk (400, 500, 600, 700)

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

**Stats bento icons (40px, red):**
- SESSIONS: `target`
- TIME: `clock`
- STREAK: `zap`
- KCAL: `activity`
- BEST: `award`

---

## Home Screen Layout

### Structure (top to bottom):

1. **Header**
   - Logomark (32px) on left
   - Date on top: "TODAY, 24 DECEMBER" (gray monospace, letter-spaced)
   - "Welcome Back, KEVIN" underneath (white, 18px)

2. **Progress Bento**
   - Title "PROGRESS" above the bento (outside)
   - Bento: `bg-[#1a1a1a]`, 16px radius, padding 16px
   - Contains ProgressGrid component (bar-based)

3. **Stats Bentos** (horizontal scroll)
   - 5 bento cards: SESSIONS, TIME, STREAK, KCAL, BEST
   - Each: 110px min-width, 150px height, 16px radius
   - Layout: title (top) → icon (flex-1 centered) → value (bottom)
   - Icons: 40px, red (#EF4444)
   - Horizontally scrollable with 12px gap

4. **Start Button**
   - Full width, red background (#EF4444)
   - 16px border radius (matches bentos)
   - Play icon + "START NEXT SESSION"
   - Red glow shadow

### Key Files:
- `app/(tabs)/index.tsx` - Home screen
- `src/components/ProgressGrid.tsx` - The 8×3 bar grid
- `app/(tabs)/_layout.tsx` - Tab navigation with Feather icons

---

## ProgressGrid Component

**Layout**: 8 rows × 3 columns = 24 workouts

**Week labels**: "WEEK 1", "WEEK 2", etc. (not abbreviated)
- Active week: white, 11px
- Inactive weeks: gray (#4B5563), 9px

**Bar sizing** (active week emphasis):
- Active week bars: 32px height
- Inactive week bars: 20px height
- Active week row height: 40px
- Inactive week row height: 28px
- Bar border radius: 4px
- Horizontal margin: 4px (mx-1)

**Bar states:**
- **Completed**: Solid red fill (#EF4444)
- **Current**: Pulsing red outline with animated fill (opacity 0.2→0.4)
- **Upcoming**: Dark gray fill (#2a2a2a)
- **Missed**: Transparent with gray border (#3a3a3a)

**No numbers on bars** - clean minimal look

**Animation**: React Native Animated API for pulse effect on current workout

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

4 tabs with Feather icons:
- HOME (`home`)
- TRAIN (`zap`)
- STATS (`bar-chart-2`)
- SETTINGS (`settings`)

Tab bar styling:
- Background: #0A0A0A
- Border: #262626
- Active: #E8110F (red)
- Inactive: #6B7280 (gray)

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
   - JetBrains Mono for numbers

5. **Control Buttons**
   - RESTART: Restart icon, gray styling
   - CANCEL: X icon, transparent with border
   - Both trigger confirmation dialogs

### Timer Animation
**Rolling ones digit only**:
- Tens digit: Static, no animation
- Ones digit: Spring animation from bottom (translateY)
- No opacity changes, no flashing

```tsx
// Tens = static
<Text>{tensDigit}</Text>

// Ones = animated roll
<Animated.Text style={{ transform: [{ translateY: onesTranslateY }] }}>
  {onesDigit}
</Animated.Text>
```

Animation uses React Native's built-in Animated API (not reanimated) with spring physics:
- Tension: 100
- Friction: 12
- Start from +60 translateY, animate to 0

### Timer Typography
- Font: JetBrains Mono Bold
- Size: 120px
- Line height: 140px
- Container overflow: hidden (clips animation)

### Control Button Philosophy
- **No pause button**: Once started, the workout runs continuously
- **No skip button**: Can't skip intervals or blocks
- **RESTART**: Confirms via Alert, then resets and restarts
- **CANCEL**: Confirms via Alert, then returns to home

---

## Pre-workout Preview Screen

### Layout
- Back button with arrow
- Workout title: "WEEK 1 • DAY 1" subtitle, workout name
- Stats row: Duration, exercise count, movement count
- Full block breakdown (scrollable)
- Fixed "LET'S GO" button at bottom

### Block Display
- Exercise blocks: Card with name, intervals × timing, rep target badge
- REST transitions: Divider line with "30s REST" text
- Duration bar showing relative block length

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

## Dev Environment Notes

- `EXPO_PUBLIC_DEV_SKIP_AUTH=true` - Skip auth for faster iteration
- `EXPO_PUBLIC_DEV_SKIP_SPLASH=true` - Skip splash animation
- Expo dev server runs in separate terminal
- Icons: `@expo/vector-icons` (Feather set)
