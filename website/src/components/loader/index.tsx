"use client";

import type React from "react";
import { useEffect } from "react";

const ModernLoader: React.FC = () => {
  useEffect(() => {
    // Prevent scrolling when loader is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-t-4 border-b-4 border-blue-300 animate-ping"></div>
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-blue-200 animate-pulse"></div>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        Loading, please wait...
      </div>
    </div>
  );
};

export default ModernLoader;
