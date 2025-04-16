
// This file simulates a backend authentication service
// In a real application, this would be replaced with actual API calls

import { User } from "./types";

// Simulate a database of users
const mockUsers = [
  {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "user-456",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456", // In a real app, this would be hashed
    profilePicture: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

// Mock JWT token generation
const generateToken = (userId: string): string => {
  // In a real app, this would be a proper JWT token
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Mock login function
export const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve({
          user: userWithoutPassword as User,
          token: generateToken(user.id)
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
};

// Mock registration function
export const mockRegister = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (existingUser) {
        reject(new Error("User with this email already exists"));
        return;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        profilePicture: null
      };
      
      mockUsers.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      resolve({
        user: userWithoutPassword as User,
        token: generateToken(newUser.id)
      });
    }, 800);
  });
};

// Mock update profile function
export const mockUpdateProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        reject(new Error("User not found"));
        return;
      }
      
      // Update user data
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData
      };
      
      const { password, ...userWithoutPassword } = mockUsers[userIndex];
      resolve(userWithoutPassword as User);
    }, 800);
  });
};
