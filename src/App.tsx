
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Dashboard from "@/pages/Dashboard/Dashboard";
import WorkoutList from "@/pages/Workouts/WorkoutList";
import WorkoutDetail from "@/pages/Workouts/WorkoutDetail";
import WorkoutForm from "@/pages/Workouts/WorkoutForm";
import UserProfile from "@/pages/Profile/UserProfile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="workouts" element={<WorkoutList />} />
              <Route path="workouts/:id" element={<WorkoutDetail />} />
              <Route path="workouts/new" element={<WorkoutForm />} />
              <Route path="workouts/edit/:id" element={<WorkoutForm />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
