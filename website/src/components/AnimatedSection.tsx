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

      animate: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100, // Reduced for smoother mobile animation
          damping: 20,
          duration: ANIMATION_DURATION,
          mass: 0.5,
          opacity: { duration: 0.3 },
        },
      },
      exit: {
        y: scrollDirection === "down" ? "-100%" : "100%",
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: ANIMATION_DURATION,
          mass: 0.5,
          opacity: { duration: 0.2 },
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
