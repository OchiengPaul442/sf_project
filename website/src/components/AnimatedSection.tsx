"use client";

import { motion } from "framer-motion";
import React, { useMemo } from "react";

interface Props {
  isActive: boolean;
  index: number;
  total: number;
  scrollDirection: "up" | "down";
  children: React.ReactNode;
  className?: string;
}

const ANIMATION_DURATION = 0.15;
const ANIMATION_SCALE = 0.98;

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
        transform: `translateY(${
          scrollDirection === "down" ? "100%" : "-100%"
        })`,
        opacity: 0,
        scale: ANIMATION_SCALE,
      },
      animate: {
        transform: "translateY(0%)",
        opacity: 1,
        scale: 1,
        transition: {
          type: "tween",
          duration: ANIMATION_DURATION,
          ease: "easeInOut",
        },
      },
      exit: {
        transform: `translateY(${
          scrollDirection === "down" ? "-100%" : "100%"
        })`,
        opacity: 0,
        scale: ANIMATION_SCALE,
        transition: {
          type: "tween",
          duration: ANIMATION_DURATION,
          ease: "easeInOut",
        },
      },
    }),
    [scrollDirection]
  );

  return (
    <motion.div
      className={`fixed inset-0 w-full overflow-hidden touch-none will-change-transform ${className}`}
      initial="initial"
      animate={isActive ? "animate" : "exit"}
      variants={variants}
      style={{
        zIndex: isActive ? total : index,
        perspective: "1000px",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
