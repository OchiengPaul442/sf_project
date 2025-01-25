// components/AnimatedSection.tsx
import { motion } from "framer-motion";
import React, { useMemo } from "react";

interface Props {
  isActive: boolean;
  index: number;
  total: number;
  scrollDirection: "up" | "down";
  children: React.ReactNode;
}

const AnimatedSection: React.FC<Props> = ({
  isActive,
  index,
  total,
  scrollDirection,
  children,
}) => {
  const variants = useMemo(
    () => ({
      initial: {
        y: scrollDirection === "down" ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95,
      },
      animate: {
        y: "0%",
        opacity: 1,
        scale: 1,
        transition: {
          type: "tween",
          duration: 0.3,
          ease: "easeOut",
        },
      },
      exit: {
        y: scrollDirection === "down" ? "-100%" : "100%",
        opacity: 0,
        scale: 0.95,
        transition: {
          type: "tween",
          duration: 0.3,
          ease: "easeIn",
        },
      },
    }),
    [scrollDirection]
  );

  return (
    <motion.div
      className="fixed inset-0 w-full h-screen overflow-hidden touch-none"
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
