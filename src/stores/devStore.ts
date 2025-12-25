import { create } from "zustand";

/**
 * Dev-only store for testing workouts
 * Not persisted - resets on app restart
 */
interface DevState {
  // Selected workout for testing (overrides normal progression)
  selectedWorkoutId: string | null;

  // Actions
  selectWorkout: (workoutId: string) => void;
  clearSelection: () => void;
}

export const useDevStore = create<DevState>((set) => ({
  selectedWorkoutId: null,

  selectWorkout: (workoutId) => {
    set({ selectedWorkoutId: workoutId });
  },

  clearSelection: () => {
    set({ selectedWorkoutId: null });
  },
}));

/**
 * Check if dev workout selection mode is enabled
 */
export const isDevWorkoutSelectEnabled = (): boolean => {
  return process.env.EXPO_PUBLIC_DEV_WORKOUT_SELECT === "true";
};
