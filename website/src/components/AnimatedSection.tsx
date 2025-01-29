"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  isActive: boolean;
  index: number;
  total: number;
  scrollDirection: "up" | "down";
  children: React.ReactNode;
  className?: string;
}

const ANIMATION_DURATION = 0.3;

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  isActive,
  index,
  total,
  scrollDirection,
  children,
  className = "",
}) => {
  // UseMemo to define animation variants
  const variants = useMemo(
    () => ({
      initial: {
        y: scrollDirection === "down" ? "100%" : "-100%",
        opacity: 0,
      },
      animate: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 90,
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
          stiffness: 90,
          damping: 20,
          duration: ANIMATION_DURATION,
          mass: 0.5,
          opacity: { duration: 0.2 },
        },
      },
    }),
    [scrollDirection]
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
