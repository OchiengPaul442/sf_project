"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { isMobileDevice } from "@/utils/deviceDetection";

interface AnimatedSectionProps {
  isActive: boolean;
  index: number;
  total: number;
  scrollDirection: "up" | "down";
  children: React.ReactNode;
  className?: string;
}

const ANIMATION_CONFIG = {
  desktop: {
    type: "spring" as const,
    stiffness: 90,
    damping: 20,
    mass: 0.5,
    duration: 0.3,
    opacity: { duration: 0.3 },
  },
  mobile: {
    type: "tween" as const,
    duration: 0.3,
    ease: "easeInOut",
    opacity: { duration: 0.2 },
  },
};

const AnimatedSection: React.FC<AnimatedSectionProps> = React.memo(
  ({ isActive, index, total, scrollDirection, children, className = "" }) => {
    const isMobile = isMobileDevice();
    const animationConfig = isMobile
      ? ANIMATION_CONFIG.mobile
      : ANIMATION_CONFIG.desktop;

    const variants = useMemo(
      () => ({
        initial: {
          y: scrollDirection === "down" ? "100%" : "-100%",
          opacity: 0,
        },
        animate: {
          y: 0,
          opacity: 1,
          transition: animationConfig,
        },
        exit: {
          y: scrollDirection === "down" ? "-100%" : "100%",
          opacity: 0,
          transition: {
            ...animationConfig,
            duration: animationConfig.duration - 0.1,
          },
        },
      }),
      [scrollDirection, animationConfig]
    );

    return (
      <motion.div
        className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}
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
  }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
