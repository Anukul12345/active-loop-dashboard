
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContextType, AuthState, User } from "@/lib/types";
import { login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile, getToken, setToken, removeToken } from "@/lib/api";

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth reducer
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "AUTH_LOADED" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case "AUTH_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload
      };
    case "AUTH_LOADED":
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth context provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for token on initial load
  useEffect(() => {
    // For demonstration, we'll simply check if a token exists
    // In a real app, you'd also validate the token
    const token = getToken();
    if (token) {
      // Normally you would verify the token here
      // For now, we'll just assume it's valid and set a mock user
      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: {
          id: "user-123",
          name: "John Doe",
          email: "john.doe@example.com",
          profilePicture: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      });
    } else {
      dispatch({ type: "AUTH_LOADED" });
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await apiLogin(email, password);
      setToken(token);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      let errorMessage = "Login failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const { user, token } = await apiRegister(name, email, password);
      setToken(token);
      dispatch({ type: "REGISTER_SUCCESS", payload: user });
    } catch (error) {
      let errorMessage = "Registration failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    dispatch({ type: "LOGOUT" });
  };

  // Update profile function
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!state.user) {
        throw new Error("No user logged in");
      }
      const updatedUser = await apiUpdateProfile(state.user.id, data);
      dispatch({ type: "UPDATE_USER", payload: { ...state.user, ...updatedUser } });
    } catch (error) {
      let errorMessage = "Profile update failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile: updateUserProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
