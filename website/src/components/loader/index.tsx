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

  // Precompute angles for better performance
  const ICON_POSITIONS = Array.from({ length: 5 }, (_, i) => i * 72);

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

          {/* Animated sustainability icons */}
          {ICON_POSITIONS.map((angle, index) => (
            <motion.div
              key={index}
              className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center"
              animate={{
                rotate: [angle, angle + 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: ANIMATION_CONSTANTS.ICON_DURATION,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: ANIMATION_CONSTANTS.SCALE_DURATION,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * ANIMATION_CONSTANTS.DELAY_INCREMENT,
                },
              }}
              style={{
                transformOrigin: "100% 50%",
              }}
            >
              {getSustainabilityIcon(index)}
            </motion.div>
          ))}

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

// Moved icons to a separate constant for better organization
const SUSTAINABILITY_ICONS = [
  {
    key: "recycle",
    path: "M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z",
  },
  {
    key: "leaf",
    path: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z",
  },
  {
    key: "chart",
    path: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z",
  },
  {
    key: "globe",
    path: "M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z",
  },
  {
    key: "money",
    path: "M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z",
  },
];

const getSustainabilityIcon = (index: number): JSX.Element => (
  <svg
    key={SUSTAINABILITY_ICONS[index % SUSTAINABILITY_ICONS.length].key}
    className="w-full h-full text-black opacity-60"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d={SUSTAINABILITY_ICONS[index % SUSTAINABILITY_ICONS.length].path}
      clipRule="evenodd"
    />
  </svg>
);

export default RestaurantSustainabilityLoader;
