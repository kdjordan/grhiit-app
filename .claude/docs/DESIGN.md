# GRHIIT Design System

## Current State: Octagon Grid (Iteration 5)

The home screen features an **8x3 octagon grid** - clean, structured, and grid-dominant. The grid IS the progress indicator; everything else supports it.

---

## Design Philosophy (Established)

**Brand identity**: Precision, intensity, no-nonsense fitness app. Not a consumer fitness app - more like lab equipment, digital stopwatch, aviation instruments.

**Core principles**:
- Brutal minimalism - remove all decoration
- Sharp corners only (no rounded)
- Pure black background (#000000)
- High contrast
- Grid dominates the screen
- No gamification fluff

---

## Typography Decisions (Finalized)

| Use Case | Font | Notes |
|----------|------|-------|
| Numbers (grid, time, reps, stats) | JetBrains Mono | Monospace for precision feel |
| Labels and text | Space Grotesk | Readable, clean |
| Button text | Space Grotesk Bold | With monospace for session numbers |

Fonts loaded in `app/_layout.tsx`:
- JetBrains Mono (400, 500, 600, 700)
- Space Grotesk (400, 500, 600, 700)
- Chakra Petch (legacy, may remove)

---

## Color Palette

```
Background: #000000 (pure black)
Primary text: #FFFFFF
Secondary text: #6B7280 (gray-500)
Accent (GRHIIT red): #EF4444
Octagon strokes: #3a3a3a (upcoming), #2a2a2a (missed)
```

---

## Home Screen Layout (Current Implementation)

### Structure (top to bottom):

1. **Header**
   - Logomark (28px, top left)
   - Settings gear (top right, gray #6B7280)

2. **Welcome Section**
   - "Welcome back, KEVIN" (Space Grotesk Bold, 18px)
   - Rotating motivational quote below (gray, 12px)
   - Quotes: "Keep throwing punches", "The only way out is through", etc.

3. **Octagon Grid** (50-60% of screen)
   - 8 rows × 3 columns = 24 octagon cells
   - Week labels on left: W1-W8 (gray, 11px)
   - Cell size: 44px
   - Stroke width: 2px

4. **Stats Section**
   - Two stats, horizontal: "4/24 SESSIONS" + "54 MIN TRAINED"
   - Monospace numbers, Space Grotesk labels

5. **Begin Button** (fixed bottom)
   - Full width, red, sharp corners
   - Line 1: "BEGIN W2:06" (large, bold)
   - Line 2: "4 MOVES • 13:30 • 190 REPS" (smaller, monospace)

### Cell States:
- **Completed**: Solid red fill with subtle glow
- **Current**: Red outline, pulsing animation (opacity 0.1→0.25)
- **Upcoming**: Gray outline (#3a3a3a), semi-transparent number
- **Missed**: Dimmer border (#2a2a2a), X overlay in red/35

### Key Files:
- `app/(tabs)/index.tsx` - Home screen
- `src/components/OctagonGrid.tsx` - The 8×3 grid

---

## OctagonGrid Component Details

**Cell shape**: Octagons (echoes the logomark)

**Sizing**:
- Cell size: 44px
- Numbers: 14px in JetBrains Mono
- Week labels: 11px in Space Grotesk

**Animation**:
- Current cell has subtle pulse animation
- Fill opacity cycles 0.1 → 0.25
- Glow opacity cycles 0.4 → 0.8
- Uses React Native Animated API

**Interaction**:
- Completed cells are tappable (opens workout detail modal)
- onCellPress callback provided

---

## Session Label Format

Format: `W{week}:{workoutNum}`
Example: `W2:06` = Week 2, Workout 6

Calculation:
```typescript
const currentWeek = Math.ceil(currentWorkout / 3);
const sessionLabel = `W${currentWeek}:${currentWorkout.toString().padStart(2, "0")}`;
```

---

## Motivational Quotes

Rotates on app open, pulled from array:
- "Keep throwing punches"
- "The only way out is through"
- "Use it or lose it"
- "Hard choices, easy life"
- "Discipline equals freedom"
- "Embrace the suck"
- "Pain is temporary"
- "No shortcuts"

---

## Design Iterations History

### Iteration 1: Technical/Stopwatch Aesthetic
- All JetBrains Mono, excessive letter-spacing
- Too cold

### Iteration 2: Balanced Typography
- Space Grotesk for labels, cards
- Still too busy

### Iteration 3: Brutal Minimalism
- Stripped containers, 8×3 rectangular grid
- Not satisfied

### Iteration 4: Spiral Progress
- 24 cells in concentric rings
- Journey metaphor
- Too abstract

### Iteration 5: Octagon Grid (Current)
- 8×3 octagon grid, logomark echo
- Motivational quotes
- Two minimal stats
- Two-line button
- Grid is the focus

---

## Reference Aesthetics

- Digital stopwatch
- Lab equipment
- Precision instruments
- Aviation cockpit displays
- Casio watches
- **NOT**: consumer fitness apps, gamified apps

---

## Dev Environment Notes

- `EXPO_PUBLIC_DEV_SKIP_AUTH=true` - Skip auth for faster iteration
- `EXPO_PUBLIC_DEV_SKIP_SPLASH=true` - Skip splash animation
- Expo dev server runs in separate terminal
