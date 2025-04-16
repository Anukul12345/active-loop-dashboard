
// Type definitions for fitness app

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}

// Workout related types
export interface Workout {
  id: string;
  userId: string;
  type: string;
  duration: number; // in minutes
  calories: number;
  date: string; // ISO string format
  notes?: string;
}

// Dashboard statistics
export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; 
  totalCalories: number;
  workoutsByType: Record<string, number>;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
}

export type WorkoutFormData = Omit<Workout, "id" | "userId">;
