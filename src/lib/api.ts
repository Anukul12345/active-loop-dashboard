
// API utility functions for fitness app
import { User, Workout } from "./types";

const API_URL = "https://api.example.com"; // Replace with your actual API endpoint when integrated with backend

// JWT token management
export const getToken = (): string | null => {
  return localStorage.getItem("fitnessToken");
};

export const setToken = (token: string): void => {
  localStorage.setItem("fitnessToken", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("fitnessToken");
};

// Generic API request function with authentication
export const apiRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Something went wrong");
    }
    
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth API functions
import { mockLogin, mockRegister, mockUpdateProfile } from "./mockAuth";

export const login = async (email: string, password: string) => {
  try {
    // Use our mock authentication service
    return await mockLogin(email, password);
    // When connected to a real backend:
    // return apiRequest<{ user: User; token: string }>("/auth/login", "POST", { email, password });
  } catch (error) {
    throw error;
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    // Use our mock authentication service
    return await mockRegister(name, email, password);
    // When connected to a real backend:
    // return apiRequest<{ user: User; token: string }>("/auth/register", "POST", { name, email, password });
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userId: string, data: Partial<User>) => {
  try {
    // Use our mock authentication service
    return await mockUpdateProfile(userId, data);
    // When connected to a real backend:
    // return apiRequest<User>(`/users/${userId}`, "PATCH", data);
  } catch (error) {
    throw error;
  }
};

// Workout API functions
export const getWorkouts = async () => {
  // For now, returning mock workout data
  return mockWorkouts;
  // When connected to a real backend:
  // return apiRequest<Workout[]>("/workouts");
};

export const getWorkout = async (id: string) => {
  // For now, return a mock workout
  return mockWorkouts.find(workout => workout.id === id) || mockWorkouts[0];
  // When connected to a real backend:
  // return apiRequest<Workout>(`/workouts/${id}`);
};

export const createWorkout = async (workout: Omit<Workout, "id" | "userId">) => {
  // For now, mocking a successful workout creation
  const newWorkout = {
    ...workout,
    id: `workout-${Date.now()}`,
    userId: "user-123"
  };
  mockWorkouts.push(newWorkout);
  return newWorkout;
  // When connected to a real backend:
  // return apiRequest<Workout>("/workouts", "POST", workout);
};

export const updateWorkout = async (id: string, workout: Partial<Workout>) => {
  // For now, mocking a successful workout update
  const index = mockWorkouts.findIndex(w => w.id === id);
  if (index >= 0) {
    mockWorkouts[index] = { ...mockWorkouts[index], ...workout };
    return mockWorkouts[index];
  }
  throw new Error("Workout not found");
  // When connected to a real backend:
  // return apiRequest<Workout>(`/workouts/${id}`, "PATCH", workout);
};

export const deleteWorkout = async (id: string) => {
  // For now, mocking a successful workout deletion
  const index = mockWorkouts.findIndex(w => w.id === id);
  if (index >= 0) {
    mockWorkouts.splice(index, 1);
    return { success: true };
  }
  throw new Error("Workout not found");
  // When connected to a real backend:
  // return apiRequest<{ success: boolean }>(`/workouts/${id}`, "DELETE");
};

// Mock data
// This will serve as our in-memory "database" until we connect to a real backend
export let mockWorkouts: Workout[] = [
  {
    id: "workout-1",
    userId: "user-123",
    type: "Running",
    duration: 30,
    calories: 320,
    date: "2025-04-15T18:30:00.000Z",
    notes: "Evening run in the park"
  },
  {
    id: "workout-2",
    userId: "user-123",
    type: "Weightlifting",
    duration: 45,
    calories: 280,
    date: "2025-04-14T17:00:00.000Z",
    notes: "Upper body day"
  },
  {
    id: "workout-3",
    userId: "user-123",
    type: "Cycling",
    duration: 60,
    calories: 450,
    date: "2025-04-13T09:00:00.000Z",
    notes: "Long ride on mountain trails"
  },
  {
    id: "workout-4",
    userId: "user-123",
    type: "Yoga",
    duration: 40,
    calories: 180,
    date: "2025-04-12T08:00:00.000Z",
    notes: "Morning yoga session"
  },
  {
    id: "workout-5",
    userId: "user-123",
    type: "Swimming",
    duration: 35,
    calories: 300,
    date: "2025-04-11T19:00:00.000Z",
    notes: "Laps at the community pool"
  },
  {
    id: "workout-6",
    userId: "user-123",
    type: "Running",
    duration: 25,
    calories: 260,
    date: "2025-04-10T07:30:00.000Z",
    notes: "Quick morning run"
  },
  {
    id: "workout-7",
    userId: "user-123",
    type: "HIIT",
    duration: 20,
    calories: 240,
    date: "2025-04-09T18:00:00.000Z",
    notes: "Intense interval training"
  }
];
