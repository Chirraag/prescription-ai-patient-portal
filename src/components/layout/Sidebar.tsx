
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  User,
  Pill,
  Calendar,
  UserRound,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    },
    {
      name: "Medications",
      path: "/medications",
      icon: <Pill className="mr-2 h-5 w-5" />,
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: <UserRound className="mr-2 h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <Calendar className="mr-2 h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="mr-2 h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="mr-2 h-5 w-5" />,
    },
  ];

  return (
    <div className="h-screen w-64 bg-slate-50 border-r flex flex-col">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center">
          <div className="font-bold text-primary text-2xl">Prescription AI</div>
        </Link>
      </div>

      <nav className="mt-6 flex-1">
        <div className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
