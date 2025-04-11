
import React from "react";
import { 
  Bell, 
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white border-b py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <div className="flex items-center">
            <div className="mr-3 text-right">
              <div className="text-sm font-medium">{currentUser?.displayName}</div>
              <div className="text-xs text-muted-foreground">Patient</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {currentUser?.displayName?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
