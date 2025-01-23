import React from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  index: number;
  isActive: boolean;
  children: React.ReactNode;
  total: number;
  scrollDirection: "up" | "down";
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  index,
  isActive,
  children,
  total,
  scrollDirection,
}) => {
  const variants = {
    initial: (direction: "up" | "down") => ({
      y: direction === "down" ? "100%" : "-100%",
      opacity: 0,
      zIndex: index,
    }),
    enter: {
      y: "0%",
      opacity: 1,
      zIndex: total - index,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "down" ? "-100%" : "100%",
      opacity: 0,
      zIndex: index,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-screen overflow-hidden touch-none"
      custom={scrollDirection}
      initial="initial"
      animate={isActive ? "enter" : "exit"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
