// Workout Block Types (for timer)
export interface WorkoutBlock {
  id: string;
  movement: string; // Short code: "8CBB", "JSQ", "BRP", "FLSQ", "REST"
  displayName: string; // Full name: "8-COUNT BODYBUILDERS"
  intervals: number; // Number of work intervals
  workDuration: number; // Seconds (0 for REST/transition blocks)
  restDuration: number; // Seconds
  repTarget?: number; // Optional rep goal per interval
  isTransition?: boolean; // True for REST blocks between exercises
  group?: string; // Group tag for collapsing into "rounds" in preview
}

export interface WorkoutProgram {
  id: string;
  name: string;
  week: number;
  day: number;
  blocks: WorkoutBlock[];
}

// Legacy Workout Types (keep for compatibility)
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
