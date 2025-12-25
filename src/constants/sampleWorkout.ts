import { WorkoutProgram, WorkoutBlock } from "@/types";

// Helper to generate unique IDs
const id = (prefix: string, n: number) => `${prefix}-${n}`;

// Movement display names
const MOVEMENTS = {
  "8CBB": "8-COUNT BODYBUILDERS",
  JSQ: "JUMP SQUATS",
  BRP: "BURPEES",
  FLSQ: "FLYING SQUATS",
  REST: "REST",
} as const;

// REST transition block factory
const restBlock = (n: number): WorkoutBlock => ({
  id: id("rest", n),
  movement: "REST",
  displayName: MOVEMENTS.REST,
  intervals: 1,
  workDuration: 0,
  restDuration: 30,
  isTransition: true,
});

// BRP + FLSQ combo block factory (creates 2 blocks)
const brpFlsqCombo = (n: number): WorkoutBlock[] => [
  {
    id: id("brp", n),
    movement: "BRP",
    displayName: MOVEMENTS.BRP,
    intervals: 1,
    workDuration: 20,
    restDuration: 10,
  },
  {
    id: id("flsq", n),
    movement: "FLSQ",
    displayName: MOVEMENTS.FLSQ,
    intervals: 1,
    workDuration: 20,
    restDuration: 10,
  },
];

/**
 * Sample workout from the CSV structure:
 * - 8CBB: 10 intervals, 6s work, 3s rest
 * - REST: 30s
 * - JSQ: 10 intervals, 6s work, 3s rest (target: 3 reps)
 * - REST: 30s
 * - BRP + FLSQ: 2 intervals (1 each), 20s work, 10s rest (x5 with 30s rest between)
 * - REST: 30s
 * - JSQ: 10 intervals, 6s work, 3s rest (target: 3 reps)
 * - REST: 30s
 * - 8CBB: 10 intervals, 6s work, 3s rest
 */
export const SAMPLE_WORKOUT: WorkoutProgram = {
  id: "week1-day1",
  name: "Foundation",
  week: 1,
  day: 1,
  blocks: [
    // Ramp-up: 8CBB
    {
      id: "8cbb-1",
      movement: "8CBB",
      displayName: MOVEMENTS["8CBB"],
      intervals: 10,
      workDuration: 6,
      restDuration: 3,
    },
    restBlock(1),

    // Ramp-up: JSQ
    {
      id: "jsq-1",
      movement: "JSQ",
      displayName: MOVEMENTS.JSQ,
      intervals: 10,
      workDuration: 6,
      restDuration: 3,
    },
    restBlock(2),

    // Summit: BRP + FLSQ combo (5 sets)
    ...brpFlsqCombo(1),
    restBlock(3),
    ...brpFlsqCombo(2),
    restBlock(4),
    ...brpFlsqCombo(3),
    restBlock(5),
    ...brpFlsqCombo(4),
    restBlock(6),
    ...brpFlsqCombo(5),
    restBlock(7),

    // Cool-down: JSQ
    {
      id: "jsq-2",
      movement: "JSQ",
      displayName: MOVEMENTS.JSQ,
      intervals: 10,
      workDuration: 6,
      restDuration: 3,
    },
    restBlock(8),

    // Cool-down: 8CBB
    {
      id: "8cbb-2",
      movement: "8CBB",
      displayName: MOVEMENTS["8CBB"],
      intervals: 10,
      workDuration: 6,
      restDuration: 3,
    },
  ],
};

/**
 * Calculate total workout duration in seconds
 */
export function calculateWorkoutDuration(workout: WorkoutProgram): number {
  return workout.blocks.reduce((total, block) => {
    if (block.isTransition) {
      // REST block: just the rest duration
      return total + block.restDuration;
    }
    // Regular block: (work + rest) * intervals
    return total + (block.workDuration + block.restDuration) * block.intervals;
  }, 0);
}

/**
 * Format seconds as MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get unique movements (excluding REST) from workout
 */
export function getUniqueMovements(workout: WorkoutProgram): string[] {
  const movements = new Set<string>();
  workout.blocks.forEach((block) => {
    if (!block.isTransition) {
      movements.add(block.displayName);
    }
  });
  return Array.from(movements);
}
