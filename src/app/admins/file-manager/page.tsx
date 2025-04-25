"use client";

import React from "react";
import AllFolders from "@/components/file-manager/AllFolders";
import AllMediaSection from "@/components/file-manager/AllMedia";
import "../admin-styles.css";
//import { useAuthGuard } from "@/hooks/useGuard";

const FileManager = () => {
  //useAuthGuard();

  return (
    <div className="min-h-screen p-2">
      {/* Page Title */}
      <header className="mt-0 pt-0 mb-10 flex justify-between items-center">
        <h3 className="text-2xl font-bold mt-0">File Manager</h3>
      </header>

      {/* Folders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-0">
        <AllMediaSection />
        <AllFolders />
      </div>
    </div>
  );
};

export default FileManager;
