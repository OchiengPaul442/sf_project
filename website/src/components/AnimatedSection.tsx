"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useMemo } from "react";

interface Props {
  isActive: boolean;
  index: number;
  total: number;
  scrollDirection: "up" | "down";
  children: React.ReactNode;
  className?: string;
}

const ANIMATION_DURATION = 0.3;

const AnimatedSection: React.FC<Props> = ({
  isActive,
  index,
  total,
  scrollDirection,
  children,
  className = "",
}) => {
  const variants = useMemo(
    () => ({
      // Initial state (before animation starts)
      initial: {
        y: scrollDirection === "down" ? "100%" : "-100%", // Start position
        opacity: 0, // Fully transparent
      },

      // Animated state (during active view)
      animate: {
        y: 0, // Center position
        opacity: 1, // Fully visible
        transition: {
          type: "spring", // Spring animation type
          stiffness: 200, // Spring stiffness (higher = more rigid)
          damping: 25, // Spring bounce (lower = more bounce)
          duration: ANIMATION_DURATION,
          mass: 0.5,
        },
      },

      // Exit state (when leaving view)
      exit: {
        y: scrollDirection === "down" ? "-100%" : "100%", // Exit position
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: ANIMATION_DURATION,
          mass: 0.5,
        },
      },
    }),
    [scrollDirection] // Recalculate when scroll direction changes
  );

  return (
    <motion.div
      className={`fixed inset-0 w-full h-full ${className}`}
      initial="initial"
      animate={isActive ? "animate" : "exit"}
      variants={variants}
      style={{
        zIndex: isActive ? total : index,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
