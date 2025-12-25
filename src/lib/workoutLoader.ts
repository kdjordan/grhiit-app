import { WorkoutProgram } from "@/types";
import workoutData from "../../assets/workouts/level-1.json";

// Type for the JSON structure
interface WorkoutJSON {
  version: number;
  level: number;
  generatedAt: string;
  workouts: WorkoutProgram[];
}

// Cast the imported JSON to our type
const data = workoutData as WorkoutJSON;

/**
 * Get all available workouts from JSON
 */
export function getAllWorkouts(): WorkoutProgram[] {
  return data.workouts;
}

/**
 * Get a specific workout by week and day
 */
export function getWorkoutByWeekDay(week: number, day: number): WorkoutProgram | null {
  return data.workouts.find(w => w.week === week && w.day === day) || null;
}

/**
 * Get a specific workout by ID
 */
export function getWorkoutById(id: string): WorkoutProgram | null {
  return data.workouts.find(w => w.id === id) || null;
}

/**
 * Get workout by workout number (1-24)
 * Workout 1 = Week 1 Day 1, Workout 4 = Week 2 Day 1, etc.
 */
export function getWorkoutByNumber(workoutNum: number): WorkoutProgram | null {
  const week = Math.ceil(workoutNum / 3);
  const day = ((workoutNum - 1) % 3) + 1;
  return getWorkoutByWeekDay(week, day);
}

/**
 * Get total number of workouts available
 */
export function getWorkoutCount(): number {
  return data.workouts.length;
}

/**
 * Calculate total workout duration in seconds
 */
export function calculateWorkoutDuration(workout: WorkoutProgram): number {
  return workout.blocks.reduce((total, block) => {
    if (block.isTransition) {
      return total + block.restDuration;
    }
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
