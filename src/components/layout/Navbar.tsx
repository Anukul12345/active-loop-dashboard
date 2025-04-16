
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and brand */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-fitness-primary">FitTrack</span>
          </Link>
        </div>

        {/* Navigation Links - Only visible on desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray-600 hover:text-fitness-primary font-medium">
            Dashboard
          </Link>
          <Link to="/workouts" className="text-gray-600 hover:text-fitness-primary font-medium">
            Workouts
          </Link>
          <Link to="/tutorials" className="text-gray-600 hover:text-fitness-primary font-medium">
            Tutorials
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-fitness-primary font-medium">
            Blog
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-fitness-primary font-medium">
            Contact
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-fitness-primary font-medium">
            Profile
          </Link>
        </nav>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-fitness-primary rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem className="cursor-pointer">
                <span className="text-sm">New workout suggestion</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <span className="text-sm">You reached your weekly goal!</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture || ""} />
                  <AvatarFallback className="bg-fitness-primary text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
