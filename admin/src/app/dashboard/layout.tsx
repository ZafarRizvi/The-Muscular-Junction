"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-gray-50 text-gray-900 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
        style={{
          marginLeft: "var(--sidebar-width, 16rem)",
        }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
