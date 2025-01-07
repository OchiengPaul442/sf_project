"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const ModernLoader: React.FC = () => {
  useEffect(() => {
    // Prevent scrolling when loader is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white font-sans z-50">
      <div className="text-4xl font-bold mb-4">Loading</div>
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-white rounded-full"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              ...dotTransition,
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        Loading, please wait...
      </div>
    </div>
  );
};

export default ModernLoader;
