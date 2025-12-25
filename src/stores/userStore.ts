import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;

  // Progress
  currentWeek: number;
  currentDay: number;
  completedWorkouts: number;
  completedWorkoutIds: number[]; // Track which workouts completed
  missedWorkoutIds: number[];    // Track which workouts quit/missed
  totalMinutes: number;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Actions
  setUser: (userId: string, email: string) => void;
  clearUser: () => void;
  completeWorkout: (minutes: number) => void;
  quitWorkout: () => void; // Mark current workout as quit
  setOnboardingComplete: () => void;
  getCurrentWorkoutNumber: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userId: null,
      email: null,
      currentWeek: 1,
      currentDay: 1,
      completedWorkouts: 0,
      completedWorkoutIds: [],
      missedWorkoutIds: [],
      totalMinutes: 0,
      hasCompletedOnboarding: false,

      setUser: (userId, email) => {
        set({ isAuthenticated: true, userId, email });
      },

      clearUser: () => {
        set({ isAuthenticated: false, userId: null, email: null });
      },

      getCurrentWorkoutNumber: () => {
        const state = get();
        return (state.currentWeek - 1) * 3 + state.currentDay;
      },

      completeWorkout: (minutes) => {
        const state = get();
        const workoutNum = state.getCurrentWorkoutNumber();
        const completedWorkouts = state.completedWorkouts + 1;
        const completedWorkoutIds = [...state.completedWorkoutIds, workoutNum];
        const totalMinutes = state.totalMinutes + minutes;

        // Progress to next day/week
        let currentDay = state.currentDay + 1;
        let currentWeek = state.currentWeek;

        if (currentDay > 3) {
          // 3 workouts per week
          currentDay = 1;
          currentWeek = Math.min(currentWeek + 1, 8);
        }

        set({ completedWorkouts, completedWorkoutIds, totalMinutes, currentDay, currentWeek });
      },

      quitWorkout: () => {
        const state = get();
        const workoutNum = state.getCurrentWorkoutNumber();
        const missedWorkoutIds = [...state.missedWorkoutIds, workoutNum];

        // Progress to next day/week (they gave up, move on)
        let currentDay = state.currentDay + 1;
        let currentWeek = state.currentWeek;

        if (currentDay > 3) {
          currentDay = 1;
          currentWeek = Math.min(currentWeek + 1, 8);
        }

        set({ missedWorkoutIds, currentDay, currentWeek });
      },

      setOnboardingComplete: () => {
        set({ hasCompletedOnboarding: true });
      },
    }),
    {
      name: "grhiit-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
