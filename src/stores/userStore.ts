import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check if dev mode with mock stats is enabled
const DEV_PERSIST_STATS = process.env.EXPO_PUBLIC_DEV_PERSIST_STATS === "true";

// Session stats passed when completing a workout
export interface SessionStats {
  // Rep counts from user input
  brpReps: number;           // Reps per interval
  flsqReps: number;          // Reps per interval
  brpIntervals: number;      // Number of BRP intervals
  flsqIntervals: number;     // Number of FLSQ intervals
  // Other movements from workout data
  otherMovements: {
    movement: string;
    intervals: number;
  }[];
  // Rating
  difficulty: number;        // 1-5 scale
  // Duration
  durationSeconds: number;
}

// Cumulative stats by movement
interface MovementStats {
  totalReps: number;
  totalIntervals: number;
  sessions: number;          // How many sessions included this movement
}

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
  totalSeconds: number;          // Accumulated training time in seconds

  // Cumulative Stats
  totalSessions: number;
  stats: {
    brp: MovementStats;
    flsq: MovementStats;
    // Other movements keyed by code (8CBB, JSQ, etc.)
    [key: string]: MovementStats;
  };
  // Mock HealthKit data (until real integration)
  totalCalories: number;
  averageHeartRate: number;
  maxHeartRate: number;

  // Session history (last 10 for trends)
  recentSessions: {
    date: string;
    workoutId: string;
    difficulty: number;
    durationSeconds: number;
    totalReps: number;
    calories: number;
  }[];

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Actions
  setUser: (userId: string, email: string) => void;
  clearUser: () => void;
  completeWorkout: (sessionStats: SessionStats) => void;
  quitWorkout: () => void; // Mark current workout as quit
  setOnboardingComplete: () => void;
  getCurrentWorkoutNumber: () => number;
  resetProgress: () => void; // DEV: Reset to workout 1
  resetStats: () => void;    // DEV: Reset cumulative stats
  setDevProgress: (week: number, day: number) => void; // DEV: Jump to specific week/day
}

// Default stats for a movement
const defaultMovementStats = (): MovementStats => ({
  totalReps: 0,
  totalIntervals: 0,
  sessions: 0,
});

// Generate mock HealthKit data for dev mode
const generateMockHealthData = (durationSeconds: number) => {
  // Approximate calories: ~10-15 cal per minute for HIIT
  const minutes = durationSeconds / 60;
  const calories = Math.round(minutes * (10 + Math.random() * 5));

  // Heart rate: 140-180 during HIIT
  const avgHR = Math.round(150 + Math.random() * 20);
  const maxHR = Math.round(avgHR + 15 + Math.random() * 15);

  return { calories, avgHR, maxHR };
};

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
      totalSeconds: 0,
      hasCompletedOnboarding: false,

      // Cumulative stats
      totalSessions: 0,
      stats: {
        brp: defaultMovementStats(),
        flsq: defaultMovementStats(),
      },
      totalCalories: 0,
      averageHeartRate: 0,
      maxHeartRate: 0,
      recentSessions: [],

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

      completeWorkout: (sessionStats: SessionStats) => {
        const state = get();
        const workoutNum = state.getCurrentWorkoutNumber();
        const workoutId = `week${state.currentWeek}-day${state.currentDay}`;

        // Update progress
        const completedWorkouts = state.completedWorkouts + 1;
        const completedWorkoutIds = [...state.completedWorkoutIds, workoutNum];
        const totalSeconds = state.totalSeconds + sessionStats.durationSeconds;
        const totalSessions = state.totalSessions + 1;

        // Calculate total reps for this session
        const brpTotalReps = sessionStats.brpReps * sessionStats.brpIntervals;
        const flsqTotalReps = sessionStats.flsqReps * sessionStats.flsqIntervals;

        // Update cumulative stats
        const newStats = { ...state.stats };

        // BRP stats
        newStats.brp = {
          totalReps: (newStats.brp?.totalReps || 0) + brpTotalReps,
          totalIntervals: (newStats.brp?.totalIntervals || 0) + sessionStats.brpIntervals,
          sessions: (newStats.brp?.sessions || 0) + 1,
        };

        // FLSQ stats
        newStats.flsq = {
          totalReps: (newStats.flsq?.totalReps || 0) + flsqTotalReps,
          totalIntervals: (newStats.flsq?.totalIntervals || 0) + sessionStats.flsqIntervals,
          sessions: (newStats.flsq?.sessions || 0) + 1,
        };

        // Other movements (8CBB, JSQ, etc.) - we don't have rep counts, just intervals
        sessionStats.otherMovements.forEach(({ movement, intervals }) => {
          const key = movement.toLowerCase();
          const existing = newStats[key] || defaultMovementStats();
          newStats[key] = {
            totalReps: existing.totalReps, // No rep data for these yet
            totalIntervals: existing.totalIntervals + intervals,
            sessions: existing.sessions + 1,
          };
        });

        // Generate mock HealthKit data (or use real data when available)
        const mockHealth = DEV_PERSIST_STATS
          ? generateMockHealthData(sessionStats.durationSeconds)
          : { calories: 0, avgHR: 0, maxHR: 0 };

        const sessionCalories = mockHealth.calories;
        const totalCalories = state.totalCalories + sessionCalories;

        // Running average for heart rate
        const averageHeartRate = state.totalSessions === 0
          ? mockHealth.avgHR
          : Math.round((state.averageHeartRate * state.totalSessions + mockHealth.avgHR) / (state.totalSessions + 1));
        const maxHeartRate = Math.max(state.maxHeartRate, mockHealth.maxHR);

        // Add to recent sessions (keep last 10)
        const sessionTotalReps = brpTotalReps + flsqTotalReps;
        const newSession = {
          date: new Date().toISOString(),
          workoutId,
          difficulty: sessionStats.difficulty,
          durationSeconds: sessionStats.durationSeconds,
          totalReps: sessionTotalReps,
          calories: sessionCalories,
        };
        const recentSessions = [newSession, ...state.recentSessions].slice(0, 10);

        // Progress to next day/week
        let currentDay = state.currentDay + 1;
        let currentWeek = state.currentWeek;

        if (currentDay > 3) {
          // 3 workouts per week
          currentDay = 1;
          currentWeek = Math.min(currentWeek + 1, 8);
        }

        set({
          completedWorkouts,
          completedWorkoutIds,
          totalSeconds,
          currentDay,
          currentWeek,
          totalSessions,
          stats: newStats,
          totalCalories,
          averageHeartRate,
          maxHeartRate,
          recentSessions,
        });
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

      resetProgress: () => {
        set({
          currentWeek: 1,
          currentDay: 1,
          completedWorkouts: 0,
          completedWorkoutIds: [],
          missedWorkoutIds: [],
          totalSeconds: 0,
        });
      },

      resetStats: () => {
        set({
          totalSessions: 0,
          stats: {
            brp: defaultMovementStats(),
            flsq: defaultMovementStats(),
          },
          totalCalories: 0,
          averageHeartRate: 0,
          maxHeartRate: 0,
          recentSessions: [],
        });
      },

      // DEV: Jump to specific week/day with completed workouts filled in
      setDevProgress: (week: number, day: number) => {
        const targetWorkout = (week - 1) * 3 + day;
        // Mark all previous workouts as completed (except last one of previous week = missed)
        const completedIds: number[] = [];
        const missedIds: number[] = [];

        for (let i = 1; i < targetWorkout; i++) {
          // Last workout of each completed week could be missed
          // For demo: miss the last workout of week 1 (workout 3)
          if (i === 3 && week > 1) {
            missedIds.push(i);
          } else {
            completedIds.push(i);
          }
        }

        set({
          currentWeek: week,
          currentDay: day,
          completedWorkouts: completedIds.length,
          completedWorkoutIds: completedIds,
          missedWorkoutIds: missedIds,
          totalSeconds: completedIds.length * 900, // ~15 min per workout
        });
      },
    }),
    {
      name: "grhiit-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
