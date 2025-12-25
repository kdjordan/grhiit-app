import { create } from "zustand";
import { WorkoutProgram, WorkoutBlock } from "@/types";
import { calculateWorkoutDuration } from "@/lib/workoutLoader";

// Countdown duration before workout starts
const COUNTDOWN_DURATION = 15;

type WorkoutPhase = "idle" | "countdown" | "work" | "rest" | "transition" | "complete";

interface WorkoutState {
  // Workout data
  workout: WorkoutProgram | null;
  totalDuration: number;

  // Timer state
  isRunning: boolean;
  currentPhase: WorkoutPhase;
  timeRemaining: number;
  elapsedTime: number;

  // Block tracking
  currentBlockIndex: number;
  currentIntervalInBlock: number;

  // Actions
  setWorkout: (workout: WorkoutProgram) => void;
  startWorkout: () => void;
  tick: () => void;
  resetWorkout: () => void;

  // Computed getters
  getCurrentBlock: () => WorkoutBlock | null;
  getNextBlock: () => WorkoutBlock | null;
  getProgressPercent: () => number;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  // Initial state
  workout: null,
  totalDuration: 0,
  isRunning: false,
  currentPhase: "idle",
  timeRemaining: 0,
  elapsedTime: 0,
  currentBlockIndex: 0,
  currentIntervalInBlock: 1,

  setWorkout: (workout) => {
    const totalDuration = calculateWorkoutDuration(workout);
    set({
      workout,
      totalDuration,
      currentPhase: "idle",
      currentBlockIndex: 0,
      currentIntervalInBlock: 1,
      timeRemaining: 0,
      elapsedTime: 0,
      isRunning: false,
    });
  },

  startWorkout: () => {
    const { workout } = get();
    if (!workout || workout.blocks.length === 0) return;

    // Start with 15-second countdown
    set({
      isRunning: true,
      currentPhase: "countdown",
      currentBlockIndex: 0,
      currentIntervalInBlock: 1,
      timeRemaining: COUNTDOWN_DURATION,
      elapsedTime: 0,
    });
  },

  tick: () => {
    const state = get();
    const {
      workout,
      timeRemaining,
      currentPhase,
      currentBlockIndex,
      currentIntervalInBlock,
      elapsedTime,
    } = state;

    if (!workout || currentPhase === "idle" || currentPhase === "complete") {
      return;
    }

    // Don't count elapsed time during countdown
    if (currentPhase !== "countdown") {
      set({ elapsedTime: elapsedTime + 1 });
    }

    // Decrement timer
    if (timeRemaining > 1) {
      set({ timeRemaining: timeRemaining - 1 });
      return;
    }

    // Timer hit zero - handle phase transition
    const currentBlock = workout.blocks[currentBlockIndex];

    // Countdown complete - start first block
    if (currentPhase === "countdown") {
      startBlock(set, get, 0);
      return;
    }

    // Transition (30s REST between exercises) complete - move to next block
    if (currentPhase === "transition") {
      moveToNextBlock(set, get);
      return;
    }

    // REST-FIRST INTERVAL FLOW:
    // Each interval is: REST → WORK
    // So: rest ends → work, work ends → next interval rest (or next block)

    if (currentPhase === "rest") {
      // Rest complete - switch to work
      set({
        currentPhase: "work",
        timeRemaining: currentBlock.workDuration,
      });
      return;
    }

    if (currentPhase === "work") {
      // Work complete - check if more intervals in this block
      if (currentIntervalInBlock < currentBlock.intervals) {
        // More intervals - start next interval's rest phase
        set({
          currentPhase: "rest",
          currentIntervalInBlock: currentIntervalInBlock + 1,
          timeRemaining: currentBlock.restDuration,
        });
      } else {
        // Block complete - move to next block
        moveToNextBlock(set, get);
      }
    }
  },

  resetWorkout: () => {
    set({
      isRunning: false,
      currentPhase: "idle",
      timeRemaining: 0,
      elapsedTime: 0,
      currentBlockIndex: 0,
      currentIntervalInBlock: 1,
    });
  },

  getCurrentBlock: () => {
    const { workout, currentBlockIndex } = get();
    if (!workout) return null;
    return workout.blocks[currentBlockIndex] || null;
  },

  getNextBlock: () => {
    const { workout, currentBlockIndex } = get();
    if (!workout) return null;
    return workout.blocks[currentBlockIndex + 1] || null;
  },

  getProgressPercent: () => {
    const { elapsedTime, totalDuration } = get();
    if (totalDuration === 0) return 0;
    return Math.min((elapsedTime / totalDuration) * 100, 100);
  },
}));

// Helper function to start a block (rest-first for regular blocks)
function startBlock(
  set: (state: Partial<WorkoutState>) => void,
  get: () => WorkoutState,
  blockIndex: number
) {
  const { workout } = get();
  if (!workout) return;

  const block = workout.blocks[blockIndex];

  if (block.isTransition) {
    // Transition block - just countdown the rest
    set({
      currentBlockIndex: blockIndex,
      currentIntervalInBlock: 1,
      currentPhase: "transition",
      timeRemaining: block.restDuration,
    });
  } else {
    // Regular exercise block - start with REST (rest-first)
    set({
      currentBlockIndex: blockIndex,
      currentIntervalInBlock: 1,
      currentPhase: "rest",
      timeRemaining: block.restDuration,
    });
  }
}

// Helper function to move to the next block
function moveToNextBlock(
  set: (state: Partial<WorkoutState>) => void,
  get: () => WorkoutState
) {
  const { workout, currentBlockIndex } = get();
  if (!workout) return;

  const nextBlockIndex = currentBlockIndex + 1;

  // Check if workout is complete
  if (nextBlockIndex >= workout.blocks.length) {
    set({
      currentPhase: "complete",
      isRunning: false,
      timeRemaining: 0,
    });
    return;
  }

  // Start the next block
  startBlock(set, get, nextBlockIndex);
}
