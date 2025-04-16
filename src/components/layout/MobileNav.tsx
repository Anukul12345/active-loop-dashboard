
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, UserCircle, Plus, BookOpen, Newspaper, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Workouts",
      icon: Dumbbell,
      href: "/workouts",
    },
    {
      label: "Add",
      icon: Plus,
      href: "/workouts/new",
      primary: true,
    },
    {
      label: "Tutorials",
      icon: BookOpen,
      href: "/tutorials",
    },
    {
      label: "Blog",
      icon: Newspaper,
      href: "/blog",
    },
    {
      label: "Contact",
      icon: Mail,
      href: "/contact",
    },
    {
      label: "Profile",
      icon: UserCircle,
      href: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-7 h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              currentPath === item.href ? "text-fitness-primary" : "text-gray-500"
            )}
          >
            {item.primary ? (
              <div className="-mt-6 bg-fitness-primary text-white p-3 rounded-full shadow-lg">
                <item.icon className="h-6 w-6" />
              </div>
            ) : (
              <item.icon className="h-6 w-6" />
            )}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
