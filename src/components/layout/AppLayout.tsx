
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const isMobile = useIsMobile();

  // Show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-fitness-primary rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-fitness-primary/60 rounded"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        <Outlet />
      </main>
      
      {/* Mobile bottom navigation */}
      {isMobile && <MobileNav />}
    </div>
  );
};

export default AppLayout;
