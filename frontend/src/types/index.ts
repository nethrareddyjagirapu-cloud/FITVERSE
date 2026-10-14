export type FitnessGoal = 'FAT_LOSS' | 'MUSCLE_GAIN' | 'WEIGHT_MAINTENANCE' | 'GENERAL_FITNESS';
export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
export type FitnessExperience = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type DietPreference = 'VEGETARIAN' | 'VEGAN' | 'EGGETARIAN' | 'NON_VEGETARIAN';
export type WorkoutLocation = 'HOME' | 'GYM' | 'OUTDOORS';

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  heightCm: number;
  currentWeightKg: number;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  fitnessExperience: FitnessExperience;
  dietPreference: DietPreference;
  workoutLocation: WorkoutLocation;
  preferredWorkoutDays: number;
  allergies?: string;
  targetDailyCalories?: number;
  targetDailyProtein?: number;
  targetDailyCarbs?: number;
  targetDailyFat?: number;
  targetDailyFibre?: number;
}

export type MealCategory = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';

export interface ServingOption {
  id: string;
  label: string; // e.g. "1 Medium Roti (35g)"
  grams: number; // Gram weight of 1 serving
  unitName: string; // e.g. "roti", "katori", "piece", "egg", "g"
  isGramBased?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  alternateNames?: string[];
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fibrePer100g: number;
  servingOptions: ServingOption[];
  isVerified: boolean;
  description?: string;
}

export interface LoggedMealItem {
  id: string;
  foodId: string;
  foodName: string;
  mealCategory: MealCategory;
  date: string; // 'YYYY-MM-DD'
  quantity: number; // e.g. 2
  servingOptionId: string;
  servingLabel: string;
  totalGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  loggedAt: string;
  notes?: string;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

export interface MuscleGroup {
  id: string;
  name: string;
  iconName: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  instructions: string;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  isCompleted: boolean;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  durationMinutes: number;
  muscleGroups: string[];
  totalVolumeKg: number;
  notes?: string;
  exercisesLogged: number;
}

export type JourneyStatus = 'ACTIVE' | 'PAUSED' | 'ENDED_EARLY' | 'COMPLETED';

export interface FitnessJourney {
  id: string;
  name: string;
  goalType: FitnessGoal;
  startingWeightKg: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  status: JourneyStatus;
  targetWorkoutDaysPerWeek: number;
  notes?: string;
}

export interface ProgressMeasurement {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  chestCm?: number;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  label: string;
  notes?: string;
}

export interface DailyHabitState {
  date: string;
  waterIntakeMl: number;
  waterTargetMl: number;
  sleepHours: number;
  sleepTargetHours: number;
  habits: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDemo?: boolean;
}
