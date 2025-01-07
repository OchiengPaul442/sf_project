"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const RestaurantSustainabilityLoader: React.FC = () => {
  // Animation constants for better maintainability
  const ANIMATION_CONSTANTS = {
    ROTATION_DURATION: 8, // Duration for one full rotation (in seconds)
    ICON_SCALE_DURATION: 1, // Duration for icon scaling (in seconds)
    ICON_INITIAL_DELAY: 0.2, // Initial delay before icon scaling starts (in seconds)
    ICON_FADE_DURATION: 0.3, // Duration for icon fade-in (in seconds)
  };

  useEffect(() => {
    // Prevent scrolling when loader is active
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Cleanup: Restore original overflow style when loader unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden font-mono z-50">
      <div className="relative w-48 h-48 mb-8">
        {/* Circular Track */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white"
          animate={{ rotate: 360 }}
          transition={{
            duration: ANIMATION_CONSTANTS.ROTATION_DURATION,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center ".sf" Text */}
        <motion.div
          className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: ANIMATION_CONSTANTS.ICON_INITIAL_DELAY,
            duration: ANIMATION_CONSTANTS.ICON_FADE_DURATION,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.span
            className="text-4xl text-black font-bold"
            role="img"
            aria-label="sf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: ANIMATION_CONSTANTS.ICON_INITIAL_DELAY,
              duration: ANIMATION_CONSTANTS.ICON_FADE_DURATION,
            }}
          >
            .sf
          </motion.span>
        </motion.div>
      </div>

      {/* Accessibility: Screen Reader Only Text */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading Saving Food platform, please wait...
      </div>
    </div>
  );
};

export default RestaurantSustainabilityLoader;
