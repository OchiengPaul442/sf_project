import React from "react";
import { motion } from "framer-motion";

const RestaurantSustainabilityLoader: React.FC = () => {
  // Animation constants for better maintainability
  const ANIMATION_CONSTANTS = {
    ROTATION_DURATION: 8,
    ICON_DURATION: 4,
    SCALE_DURATION: 1,
    DELAY_INCREMENT: 0.1,
    FADE_DURATION: 0.3,
    INITIAL_DELAY: 0.2,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white text-black p-4 overflow-hidden font-mono">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <motion.div
          className="relative w-48 h-48 mb-8"
          animate={{ rotate: 360 }}
          transition={{
            duration: ANIMATION_CONSTANTS.ROTATION_DURATION,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Circular track */}
          <div className="absolute inset-0 rounded-full border-4 border-black opacity-10" />

          {/* Center restaurant icon */}
          <motion.div
            className="absolute inset-0 m-auto w-24 h-24 bg-black rounded-full shadow-lg flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: ANIMATION_CONSTANTS.INITIAL_DELAY,
              duration: ANIMATION_CONSTANTS.FADE_DURATION,
            }}
          >
            <span
              className="text-4xl text-white"
              role="img"
              aria-label="Restaurant"
            >
              sf.
            </span>
          </motion.div>
        </motion.div>

        {/* Text content */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: ANIMATION_CONSTANTS.INITIAL_DELAY,
            duration: ANIMATION_CONSTANTS.FADE_DURATION,
          }}
        >
          <p className="text-sm opacity-60 font-sans">We&apos;re</p>
          <h2 className="text-4xl sm:text-5xl font-bold font-sans tracking-tight">
            Saving Food
          </h2>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          className="flex space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: ANIMATION_CONSTANTS.INITIAL_DELAY,
            duration: ANIMATION_CONSTANTS.FADE_DURATION,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-black rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading Saving Food platform, please wait...
      </div>
    </div>
  );
};

export default RestaurantSustainabilityLoader;
