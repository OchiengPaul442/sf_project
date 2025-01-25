"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";

interface HyperOptimizedAnimatedSectionProps {
  index: number;
  isActive: boolean;
  children: React.ReactNode;
  total: number;
  scrollDirection: "up" | "down";
}

export const HyperOptimizedAnimatedSection: React.FC<HyperOptimizedAnimatedSectionProps> =
  React.memo(
    ({ index, isActive, children, total, scrollDirection }) => {
      const variants: Variants = useMemo(
        () => ({
          initial: {
            y: scrollDirection === "down" ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95,
            transformOrigin: "center",
          },
          enter: {
            y: "0%",
            opacity: 1,
            scale: 1,
            transition: {
              type: "tween",
              duration: 0.25,
              ease: "easeOut",
            },
          },
          exit: {
            y: scrollDirection === "down" ? "-100%" : "100%",
            opacity: 0,
            scale: 0.95,
            transition: {
              type: "tween",
              duration: 0.25,
              ease: "easeIn",
            },
          },
        }),
        [scrollDirection]
      );

      return (
        <motion.div
          className="fixed inset-0 w-full h-screen overflow-hidden touch-none will-change-transform will-change-opacity"
          initial="initial"
          animate={isActive ? "enter" : "exit"}
          variants={variants}
          style={{
            zIndex: isActive ? total : index,
            willChange: "transform, opacity, scale",
          }}
        >
          {children}
        </motion.div>
      );
    },
    (prevProps, nextProps) =>
      prevProps.isActive === nextProps.isActive &&
      prevProps.scrollDirection === nextProps.scrollDirection
  );

HyperOptimizedAnimatedSection.displayName = "HyperOptimizedAnimatedSection";
