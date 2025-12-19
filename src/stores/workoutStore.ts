import { create } from "zustand";

type WorkoutPhase = "warmup" | "work" | "rest" | "cooldown" | "complete";

interface WorkoutState {
  // Timer state
  isRunning: boolean;
  currentPhase: WorkoutPhase;
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
  elapsedTime: number;

  // Movement tracking
  movements: string[];
  currentMovementIndex: number;
  currentMovement: string;
  nextMovement: string;

  // Session config
  workDuration: number;
  restDuration: number;

  // Actions
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  tick: () => void;
  resetWorkout: () => void;
  setWorkout: (config: {
    movements: string[];
    rounds: number;
    workDuration: number;
    restDuration: number;
  }) => void;
}

const DEFAULT_MOVEMENTS = [
  "FLYING SQUATS",
  "BURPEES",
  "MOUNTAIN CLIMBERS",
  "JUMP SQUATS",
  "8-COUNT BODYBUILDERS",
  "JUMP LUNGES",
  "PUSH-UPS",
  "HIGH KNEES",
];

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  // Initial state
  isRunning: false,
  currentPhase: "warmup",
  timeRemaining: 20,
  currentRound: 1,
  totalRounds: 8,
  elapsedTime: 0,
  movements: DEFAULT_MOVEMENTS,
  currentMovementIndex: 0,
  currentMovement: DEFAULT_MOVEMENTS[0],
  nextMovement: DEFAULT_MOVEMENTS[1],
  workDuration: 20,
  restDuration: 10,

  setWorkout: (config) => {
    set({
      movements: config.movements,
      totalRounds: config.rounds,
      workDuration: config.workDuration,
      restDuration: config.restDuration,
      currentMovement: config.movements[0],
      nextMovement: config.movements[1] || config.movements[0],
      currentMovementIndex: 0,
    });
  },

  startWorkout: () => {
    const state = get();
    set({
      isRunning: true,
      currentPhase: "work",
      timeRemaining: state.workDuration,
      currentRound: 1,
      elapsedTime: 0,
      currentMovementIndex: 0,
      currentMovement: state.movements[0],
      nextMovement: state.movements[1] || state.movements[0],
    });
  },

  pauseWorkout: () => {
    set({ isRunning: false });
  },

  resumeWorkout: () => {
    set({ isRunning: true });
  },

  tick: () => {
    const state = get();
    const {
      timeRemaining,
      currentPhase,
      currentRound,
      totalRounds,
      movements,
      currentMovementIndex,
      elapsedTime,
    } = state;

    // Always increment elapsed time
    set({ elapsedTime: elapsedTime + 1 });

    if (timeRemaining > 1) {
      set({ timeRemaining: timeRemaining - 1 });
      return;
    }

    // Time's up for current phase
    if (currentPhase === "work") {
      if (currentRound >= totalRounds) {
        // Workout complete
        set({ currentPhase: "complete", isRunning: false });
      } else {
        // Switch to rest
        set({ currentPhase: "rest", timeRemaining: state.restDuration });
      }
    } else if (currentPhase === "rest") {
      // Switch to work, increment round, advance movement
      const nextMovementIdx = (currentMovementIndex + 1) % movements.length;
      const nextNextIdx = (nextMovementIdx + 1) % movements.length;

      set({
        currentPhase: "work",
        timeRemaining: state.workDuration,
        currentRound: currentRound + 1,
        currentMovementIndex: nextMovementIdx,
        currentMovement: movements[nextMovementIdx],
        nextMovement: movements[nextNextIdx],
      });
    }
  },

  resetWorkout: () => {
    const state = get();
    set({
      isRunning: false,
      currentPhase: "warmup",
      timeRemaining: state.workDuration,
      currentRound: 1,
      elapsedTime: 0,
      currentMovementIndex: 0,
      currentMovement: state.movements[0],
      nextMovement: state.movements[1] || state.movements[0],
    });
  },
}));
