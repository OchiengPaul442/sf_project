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

const ANIMATION_DURATION = 0.5;

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
      initial: {
        y: scrollDirection === "down" ? "100%" : "-100%",
        opacity: 0,
      },
      animate: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: ANIMATION_DURATION,
        },
      },
      exit: {
        y: scrollDirection === "down" ? "-100%" : "100%",
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: ANIMATION_DURATION,
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
