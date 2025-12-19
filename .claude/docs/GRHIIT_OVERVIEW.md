# GRHIIT Overview

## Core Philosophy

GRHIIT (pronounced "grit") is bodyweight high-intensity interval training positioned as **identity transformation**, not fitness improvement. The main issue with 'fitness' is that it's an identity, not a workout - that's how you achieve it. This training will get you in the best shape of your life and it will make it easier to make good choices about diet and consistency, becuase it shows you what you are capable of.

**Central thesis:** Most people have never actually hit their limits. Their internal gauge of "hard" is miscalibrated. GRHIIT recalibrates this gauge through progressive bodyweight intervals. When you learn what hard actually is, everything else in life becomes easier by comparison.

**This is not just about getting fit. It's about becoming someone who knows their limits.**

Success metric: Identity shift (better spouse, parent, professional) through mental discipline gained from sustained physical intensity.

## Target Users

- Age range: teenagers to professional athletes to individuals in ther 60s and 70s. 
- Common feedback: "Made me a better person, not just fitter"
- Seeking voluntary discomfort training and stoic principles applied through fitness
- Value sustained effort over quick wins

## Training Methodology

### Structure
**8-week progressive program using 4 core movements:**
- 8-Count Bodybuilders
- Jump Squats
- Burpees  
- Flying Squats
- Pushups
- Mountain Climbers
- Lunges
- Jump Lunges
- etc...

**Session format (16-30 minutes):**
- Ramp-up
- Tabata blocks (summit)
- After-Burn Follow Up - repeating the Ramp up when in heavy oxygen debt


**"Mountain-shaped" intensity profile:**
- Ascent: building intensity
- Summit: Tabata intervals (20s work / 10s rest, 8+ rounds)
- Descent: controlled finish with matched intro/outro to prove sustained performance under fatigue

**Interval timing:**
- Work: 6-20 seconds
- Rest: 3-10 seconds  
- 220+ reps per session
- Work to rest ratio is essential. 2:1, 1:1, 3:1 are strictly adhered to
- Progressive overload through sustained effort duration, NOT just volume

### Key Principles
- Change one variable at a time
- Controlled threshold work over chaotic intensity
- Progression = increasing sustained effort duration
- Short rest periods (3-10s) create oxygen deficit that builds both aerobic/anaerobic capacity simultaneously

### Science Foundation
Based on Dr. Izumi Tabata's research showing 20s work / 10s rest intervals optimally stress both energy systems. HIIT produces:
- 14% VO2 max improvement (aerobic)
- 28% lactate tolerance improvement (anaerobic)
- 9x more effective fat burning than steady-state cardio
- 4 minutes 100% effort = same calories as 40-60 min 70% effort
- EPOC (after-burn) continues 12-36 hours post-workout

## App Requirements

### MVP Features
1. **Precision Interval Timer**
   - Customizable work/rest periods (6-20s work, 3-10s rest)
   - Audio/haptic cues
   - Clear visual countdown
   - Round tracking

2. **Heart Rate Integration**
   - HealthKit (iOS) integration
   - Real-time HR display during workout
   - Post-session HR graph
   - Max HR tracking

3. **Workout Progression**
   - Pre-built 8-week program
   - Track which week/day user is on
   - Show progression path
   - Lock future workouts until current completed

4. **Session History**
   - Completed workouts log
   - HR data saved per session
   - Rep counts
   - Notes capability

5. **Identity Tracking** (differentiated feature)
   - Post-workout: "How do you feel?" qualitative check-in
   - Track identity shift, not just metrics
   - Track reps per interval cycle. Maintaining rep count and goal setting within the session is essential
   - Simple 1-5 scale on mental toughness, discipline, etc.

### Future Features
- Video demonstrations of movements
- Community/leaderboards
- Custom workout builder
- Coach mode

## Technical Stack

**Frontend:**
- React Native + Expo (TypeScript)
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)

**State:**
- Zustand (simple, effective state management)

**Backend:**
- Firebase
  - Authentication (email/password) Google and Apple
  - Firestore (workout history, user data)
  - Storage (future: video content)

**Device Integration:**
- HealthKit (iOS) for heart rate monitoring
- Local storage for offline capability

## User Experience Goals

### Design Principles
**Simple. Brutal. Transformative.**

- Minimal UI - no fluff, no gamification gimmicks
- Dark mode default (intensity aesthetic)
- Bold typography
- High contrast
- Data visualization that matters (HR graphs, not arbitrary points)

### Tone
- Aspirational without being motivational-poster cringe
- Edge without being CrossFit bro
- Transformation emphasis over confrontation
- "Learn what hard actually is" - not "become a badass"

### Navigation Flow
1. Onboarding → explain philosophy (30 seconds max)
2. Start Program → Week 1, Day 1
3. Pre-workout → movement preview, timer setup
4. Workout → full-screen timer, HR monitor
5. Post-workout → HR graph, qualitative check-in, progress update
6. Home → current progress, next workout, history access

### Core Interactions
- Timer start/stop must be bulletproof, but once the session begins, there is no STOP. That's the point, the whole thing is scripted. You push go and you go. There is no way out.
- HR data must be real-time and accurate
- Workout completion must feel significant (not just "good job!")
- Progress visibility without overwhelming data

## Brand Voice Examples

**Good:**
- "Most people have never actually hit their limits."
- "Recalibrate your dificulty gauge."
- "Stop looking for an easy path, the olny way out is through."
- "The more you give, the more you get"
- "All it takes, is all you got."
- "Have a goal for this session, then make sure you achieve it."


**Bad:**
- "Crush your goals!"
- "Beast mode activated!"
- "No pain, no gain!"

## Development Priorities

**Phase 1 (Weeks 1-2): Core Timer**
- Build interval timer with audio cues
- Local state only
- Single workout session flow
- Test on real device with real workout

**Phase 2 (Weeks 3-4): Data Layer**  
- Firebase setup
- User authentication
- Workout history persistence
- HealthKit integration

**Phase 3 (Weeks 5-6): Progression System**
- 8-week program structure
- Unlock logic
- Progress tracking
- Identity check-ins

**Phase 4 (Weeks 7-8): Polish**
- Animations/transitions
- Error handling
- Offline mode
- TestFlight beta

## Reference Materials

- Training methodology: See GRHIIT.pdf (formerly FMWTraining)
- Design mockups: `.claude/docs/mockups/` (when added)
- Creator background: Former junior national Olympic weightlifting champion, 15 years HIIT fitness experience and coaching, marathon runner, mountain bike racer, expert skiier, muli sport athlete in his 50s still charging - emphasis on progressive overload and single-variable manipulation

## Key Differentiators from Generic HIIT Apps

1. **Philosophy-first, not metrics-first** - selling identity transformation
2. **Structured progression** - not random workouts
3. **Bodyweight only** - accessible, no equipment barrier
4. **Sustained effort focus** - duration over volume
5. **Quality tracking** - "how do you feel?" "are you keeping your rep count"
6. **Evidence-based** - built on Tabata research, not fitness influencer trends