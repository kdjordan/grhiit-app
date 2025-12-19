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
  totalMinutes: number;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Actions
  setUser: (userId: string, email: string) => void;
  clearUser: () => void;
  completeWorkout: (minutes: number) => void;
  setOnboardingComplete: () => void;
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
      totalMinutes: 0,
      hasCompletedOnboarding: false,

      setUser: (userId, email) => {
        set({ isAuthenticated: true, userId, email });
      },

      clearUser: () => {
        set({ isAuthenticated: false, userId: null, email: null });
      },

      completeWorkout: (minutes) => {
        const state = get();
        const completedWorkouts = state.completedWorkouts + 1;
        const totalMinutes = state.totalMinutes + minutes;

        // Progress to next day/week
        let currentDay = state.currentDay + 1;
        let currentWeek = state.currentWeek;

        if (currentDay > 3) {
          // 3 workouts per week
          currentDay = 1;
          currentWeek = Math.min(currentWeek + 1, 8);
        }

        set({ completedWorkouts, totalMinutes, currentDay, currentWeek });
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
