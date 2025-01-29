import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Grid,
  Users,
  DollarSign,
  Building,
  Settings,
  LogOut,
} from "lucide-react"; 

const Sidebar = () => {
  return (
    <div
      className="h-3/4 w-20 bg-white shadow-lg fixed top-16 left-6 flex flex-col items-center py-4s rounded-2xl border border-gray-200"
    >
      {/* Logo */}
      <div className="mb-6">
        <img
          src="src/assests/Technia_Main logo-01.png" 
          alt="Logo"
          className=""
        />
      </div>

      {/* Top Buttons */}
      <nav className="flex flex-col space-y-4 flex-1">
        {/* Dashboard Button */}
        <Link
          to="/dashboard"
          className="group flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-blue-100"
        >
          <Grid className="w-6 h-6 text-gray-700 group-hover:text-blue-500" />
        </Link>

        {/* HR Button */}
        <Link
          to="/hr"
          className="group flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-blue-100"
        >
          <Users className="w-6 h-6 text-gray-700 group-hover:text-blue-500" />
        </Link>

        {/* Real Estate Button */}
        <Link
          to="/real-estate"
          className="group flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-blue-100"
        >
          <Building className="w-6 h-6 text-gray-700 group-hover:text-blue-500" />
        </Link>

        {/* Finance Button */}
        
      </nav>

      {/* Bottom Buttons */}
      <div className="flex flex-col space-y-4">
        {/* Settings Button */}
        <Link
          to="/settings"
          className="group flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-blue-100"
        >
          <Settings className="w-6 h-6 text-gray-700 group-hover:text-blue-500" />
        </Link>

        {/* Logout Button */}
        <Link
          to="/logout"
          className="group flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-red-100"
        >
          <LogOut className="w-6 h-6 text-red-500 group-hover:text-red-700" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
