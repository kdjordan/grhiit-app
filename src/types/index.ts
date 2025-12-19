// Workout Types
export interface Workout {
  id: string;
  week: number;
  day: number;
  name: string;
  duration: number; // minutes
  rounds: number;
  workDuration: number; // seconds
  restDuration: number; // seconds
  movements: Movement[];
}

export interface Movement {
  id: string;
  name: string;
  description: string;
  targetReps?: number;
}

// Session Types
export interface WorkoutSession {
  id: string;
  odId: string;
  userId: string;
  completedAt: Date;
  duration: number; // actual minutes
  totalReps: number;
  heartRateData?: HeartRateData;
  identityCheckIn?: IdentityCheckIn;
}

export interface HeartRateData {
  average: number;
  max: number;
  min: number;
  samples: HeartRateSample[];
}

export interface HeartRateSample {
  timestamp: Date;
  bpm: number;
}

export interface IdentityCheckIn {
  mentalToughness: number; // 1-5
  discipline: number; // 1-5
  confidence: number; // 1-5
  notes?: string;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  currentWeek: number;
  currentDay: number;
  totalWorkouts: number;
  totalMinutes: number;
}

// Program Types
export interface ProgramProgress {
  week: number;
  day: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}
