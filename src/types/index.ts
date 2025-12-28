// Workout Block Types (for timer)
export interface WorkoutBlock {
  id: string;
  movement: string; // Short code: "8CBB", "JSQ", "OGBRP", "PUBRP", "FLSQ", "REST" or combo "OGBRP>FLSQ"
  displayName: string; // Full name: "8-COUNT BODYBUILDERS" or "BURPEES → FLYING SQUATS"
  intervals: number; // Number of work intervals
  workDuration: number; // Seconds (0 for REST/transition blocks)
  restDuration: number; // Seconds (for smoker: hold duration)
  repTarget?: string; // Optional rep goal per interval - "8" or "8-12" for ranges
  isTransition?: boolean; // True for REST blocks between exercises
  group?: string; // Group tag for collapsing into "rounds" in preview
  type?: string; // Block type: "SM" for smoker, empty for standard

  // Smoker-specific (Type = SM)
  isSmoker?: boolean; // True for smoker blocks (no true rest)
  holdMovement?: {
    code: string;
    displayName: string;
    repTarget?: string;
  };
  workMovement?: {
    code: string;
    displayName: string;
    repTarget?: string;
  };

  // Sequence-specific (movement contains ">")
  isSequence?: boolean; // True for sequence blocks (multiple movements in one work phase)
  sequence?: Array<{
    code: string;
    displayName: string;
    repTarget?: string;
  }>;

  // Choice-specific (movement contains "/")
  isChoice?: boolean; // True for choice blocks (user picks one movement)
  choices?: Array<{
    code: string;
    displayName: string;
    repTarget?: string;
  }>;
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
