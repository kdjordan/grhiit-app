# GRHIIT App

**Repo:** https://github.com/kdjordan/grhiit-app

## Project Overview
GRHIIT (pronounced "grit") is a bodyweight HIIT training app focused on identity transformation, not just fitness. Based on Tabata research (20s work / 10s rest intervals).

**Core thesis:** Recalibrate what "hard" means through progressive bodyweight intervals.

## Tech Stack
- **Framework**: Expo SDK 54 + React Native 0.81 (New Architecture)
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State**: Zustand (persisted with AsyncStorage)
- **Backend**: Firebase (Auth + Firestore)
- **Language**: TypeScript (strict mode)

## Commands
```bash
npm start       # Start Expo dev server
npm run ios     # Run on iOS simulator
npm run android # Run on Android emulator
npm run web     # Run in browser
```

## Project Structure
```
/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigator (Home, Train, Stats, Profile)
│   │   ├── index.tsx      # Home - today's workout, streak, metrics
│   │   ├── train.tsx      # Workout selection (ALL, TABATA, AMRAP, CUSTOM)
│   │   ├── stats.tsx      # Statistics & identity metrics
│   │   └── profile.tsx    # User profile & settings
│   ├── workout/           # Workout flow
│   │   ├── index.tsx      # Pre-workout preview
│   │   ├── active.tsx     # Active timer (no stop - only the way out is through)
│   │   └── complete.tsx   # Post-workout check-in
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable UI components
│   ├── stores/            # Zustand stores
│   │   ├── workoutStore.ts
│   │   └── userStore.ts
│   ├── lib/               # Firebase, utilities
│   ├── types/             # TypeScript types
│   └── constants/         # Workout data, config
├── mockups/               # UI design mockups
└── assets/                # Static assets
```

## Key Files
- `tailwind.config.js` - Brand colors & theme
- `src/stores/workoutStore.ts` - Timer & workout state
- `src/stores/userStore.ts` - User progress (persisted)
- `src/lib/firebase.ts` - Firebase config
- `src/constants/workouts.ts` - 8-week program data

## Brand Colors (Dark theme)
- Background: `#0A0A0A`
- Surface: `#141414`
- Border: `#262626`
- Primary (text): `#FFFFFF`
- Secondary: `#A3A3A3`
- Accent (intensity): `#EF4444`

## Development Guidelines
- **Expo dev server runs in separate terminal** - never run `npm start` or `npx expo start`
- Use NativeWind `className` for all styling
- Dark mode is default - maintain high contrast
- Bold typography, minimal UI - no gamification fluff
- **No stop button** - once workout starts, the only way out is through (core philosophy)
- Timer must be bulletproof - test on real device
- Identity check-ins are a key differentiator (post-workout)
- Work:rest ratios strictly adhered to: 2:1, 1:1, 3:1
- Rep tracking per interval is essential

## Training Methodology Reference
- Core movements: 8-Count Bodybuilders, Jump Squats, Burpees, Flying Squats, Push-ups, Mountain Climbers, Lunges, Jump Lunges, High Knees
- Tabata format: 20s work / 10s rest, 8 rounds
- Session structure: Ramp-up → Tabata Summit → After-Burn Follow Up
- Progressive overload through sustained effort duration
- "Mountain-shaped" intensity profile

## Firebase Setup
1. Create project at console.firebase.google.com
2. Enable Authentication (Email/Password, Google, Apple)
3. Create Firestore database
4. Copy config to `.env` (see `.env.example`)

## Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
