import { Workout, Movement } from "@/types";

// All available movements
export const MOVEMENTS: Record<string, Movement> = {
  bodybuilders: {
    id: "bodybuilders",
    name: "8-Count Bodybuilders",
    description: "Full-body explosive movement combining squat thrust, push-up, and jump",
  },
  jumpSquats: {
    id: "jumpSquats",
    name: "Jump Squats",
    description: "Lower body power - explosive squat with vertical jump",
  },
  burpees: {
    id: "burpees",
    name: "Burpees",
    description: "Metabolic conditioning - chest to floor, explosive jump",
  },
  flyingSquats: {
    id: "flyingSquats",
    name: "Flying Squats",
    description: "Alternating jump lunges with explosive transitions",
  },
  pushups: {
    id: "pushups",
    name: "Push-ups",
    description: "Upper body strength - chest, shoulders, triceps",
  },
  mountainClimbers: {
    id: "mountainClimbers",
    name: "Mountain Climbers",
    description: "Core and cardio - rapid alternating knee drives",
  },
  lunges: {
    id: "lunges",
    name: "Lunges",
    description: "Lower body strength - controlled stepping motion",
  },
  jumpLunges: {
    id: "jumpLunges",
    name: "Jump Lunges",
    description: "Explosive alternating lunge with jump transition",
  },
  highKnees: {
    id: "highKnees",
    name: "High Knees",
    description: "Cardio conditioning - rapid knee drives in place",
  },
  plankHolds: {
    id: "plankHolds",
    name: "Plank Holds",
    description: "Core stability - isometric hold position",
  },
  russianTwists: {
    id: "russianTwists",
    name: "Russian Twists",
    description: "Core rotation - oblique strengthening",
  },
  bicycleCrunches: {
    id: "bicycleCrunches",
    name: "Bicycle Crunches",
    description: "Core conditioning - alternating elbow to knee",
  },
};

// Work:Rest ratio presets (strictly adhered to per overview)
export const INTERVAL_RATIOS = {
  "2:1": { work: 20, rest: 10 }, // Classic Tabata
  "1:1": { work: 30, rest: 30 }, // Equal work/rest
  "3:1": { work: 30, rest: 10 }, // High intensity
};

// Session structure: Ramp-up → Tabata Summit → After-Burn Follow Up
export const SESSION_PHASES = {
  rampUp: "Ramp-up",
  summit: "Tabata Summit",
  afterBurn: "After-Burn Follow Up",
};

// Week 1 Workouts - Foundation
export const WEEK_1_WORKOUTS: Workout[] = [
  {
    id: "w1d1",
    week: 1,
    day: 1,
    name: "Foundation",
    duration: 16,
    rounds: 8,
    workDuration: 20,
    restDuration: 10,
    movements: [MOVEMENTS.bodybuilders, MOVEMENTS.jumpSquats],
  },
  {
    id: "w1d2",
    week: 1,
    day: 2,
    name: "Build",
    duration: 16,
    rounds: 8,
    workDuration: 20,
    restDuration: 10,
    movements: [MOVEMENTS.burpees, MOVEMENTS.flyingSquats],
  },
  {
    id: "w1d3",
    week: 1,
    day: 3,
    name: "Complete",
    duration: 18,
    rounds: 8,
    workDuration: 20,
    restDuration: 10,
    movements: [
      MOVEMENTS.bodybuilders,
      MOVEMENTS.jumpSquats,
      MOVEMENTS.burpees,
      MOVEMENTS.flyingSquats,
    ],
  },
];

// Featured workouts for the Train screen
export const FEATURED_WORKOUTS = [
  {
    id: "burpee-gauntlet",
    name: "BURPEE GAUNTLET",
    intervalFormat: "20:10",
    rounds: 8,
    duration: 28,
    difficulty: 5,
    movements: ["Burpees", "Mountain Climbers", "Jump Squats"],
    type: "TABATA" as const,
  },
  {
    id: "oxygen-debt-01",
    name: "OXYGEN DEBT 01",
    intervalFormat: "20:10",
    rounds: 8,
    duration: 45,
    difficulty: 5,
    movements: ["8-Count Bodybuilders", "Burpees", "Jump Squats", "Flying Squats"],
    type: "TABATA" as const,
  },
  {
    id: "tabata-core-burn",
    name: "TABATA CORE BURN",
    intervalFormat: "20:10",
    rounds: 12,
    duration: 36,
    difficulty: 4,
    movements: ["Plank Holds", "Russian Twists", "Bicycle Crunches"],
    type: "TABATA" as const,
  },
  {
    id: "sprint-intervals",
    name: "SPRINT INTERVALS",
    intervalFormat: "30:30",
    rounds: 10,
    duration: 20,
    difficulty: 4,
    movements: ["High Knees", "Jump Lunges", "Flying Squats"],
    type: "TABATA" as const,
  },
];

// Full 8-week program structure
export const PROGRAM_STRUCTURE = [
  { week: 1, theme: "Foundation", workDuration: 20, restDuration: 10, ratio: "2:1" },
  { week: 2, theme: "Adaptation", workDuration: 20, restDuration: 10, ratio: "2:1" },
  { week: 3, theme: "Progression", workDuration: 20, restDuration: 8, ratio: "2.5:1" },
  { week: 4, theme: "Challenge", workDuration: 20, restDuration: 8, ratio: "2.5:1" },
  { week: 5, theme: "Intensity", workDuration: 20, restDuration: 6, ratio: "3:1" },
  { week: 6, theme: "Threshold", workDuration: 20, restDuration: 6, ratio: "3:1" },
  { week: 7, theme: "Peak", workDuration: 20, restDuration: 5, ratio: "4:1" },
  { week: 8, theme: "Mastery", workDuration: 20, restDuration: 5, ratio: "4:1" },
];

export const getWorkoutForDay = (week: number, day: number): Workout | undefined => {
  if (week === 1) {
    return WEEK_1_WORKOUTS.find((w) => w.day === day);
  }
  // TODO: Add remaining weeks
  return WEEK_1_WORKOUTS[0];
};
