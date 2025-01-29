import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-20 flex-1 p-6 bg-white min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
