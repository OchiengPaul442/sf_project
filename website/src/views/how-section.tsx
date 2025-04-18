"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useScroll,
  MotionValue,
} from "framer-motion";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { mainConfigs } from "@/utils/configs";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInView } from "framer-motion";

export interface HowSectionProps {
  id: string;
}

/**
 * Clamps and transforms a scroll progress MotionValue into a plain number.
 */
function useClampedProgress(
  value: MotionValue<number>,
  inputRange: [number, number],
  outputRange: [number, number]
): number {
  const transformed = useTransform(value, inputRange, outputRange);
  const [progress, setProgress] = useState<number>(transformed.get());

  useEffect(() => {
    const unsubscribe = transformed.on("change", setProgress);
    return () => unsubscribe();
  }, [transformed]);

  return progress;
}

const HowSection: React.FC<HowSectionProps> = ({ id }) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Reduce scroll height on mobile to prevent overscrolling
  const scrollHeight = isMobile ? "230vh" : "350vh";

  // Check if section is in view
  const inView = useInView(spacerRef, { margin: "-40% 0px" });

  // Framer Motion scroll progress
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    mass: 0.8,
    restDelta: 0.0005,
  });

  // Combined opacity for the entire fixed container
  // - fade in from 0 to 0.15,
  // - remain visible until 0.8,
  // - fade out from 0.8 to 1
  const combinedOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.8, 1],
    [0, 1, 1, 0]
  );

  // Determine breakpoints for text reveal
  const revealBreak = isMobile ? 0.45 : 0.5;
  const gradientBuffer = isMobile ? 0.1 : 0.08;

  const paragraphRanges = {
    first: [0.1, revealBreak] as [number, number],
    gradient: [revealBreak - gradientBuffer, revealBreak + gradientBuffer] as [
      number,
      number
    ],
    second: [revealBreak, 0.9] as [number, number],
  };

  // Convert MotionValue progress to numeric for each text
  const firstTextProgress = useClampedProgress(
    smoothProgress,
    paragraphRanges.first,
    [0, 1]
  );
  const gradientProgress = useClampedProgress(
    smoothProgress,
    paragraphRanges.gradient,
    [0, 1]
  );
  const secondTextProgress = useClampedProgress(
    smoothProgress,
    paragraphRanges.second,
    [0, 1]
  );

  return (
    <section
      id={id}
      ref={spacerRef}
      className="relative w-full text-white overflow-hidden"
      style={{ height: scrollHeight }}
    >
      {inView && (
        <motion.div
          className="fixed top-0 left-0 w-full h-screen"
          style={{
            opacity: combinedOpacity,
            willChange: "opacity, transform",
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative h-full flex flex-col items-center justify-center w-full px-4 md:px-0">
            <div
              className={`${mainConfigs.SECTION_CONTAINER_CLASS} space-y-8 md:space-y-20 2xl:space-y-32 py-8 md:py-16`}
            >
              {/* First text block (left-aligned) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <TextReveal
                  text="By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability."
                  progress={firstTextProgress}
                  align="left"
                  className="text-lg md:text-xl lg:text-2xl"
                />
              </motion.div>

              {/* Gradient Separator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="my-8 md:my-0"
              >
                <GradientSeparator progress={gradientProgress} />
              </motion.div>

              {/* Second text block (right-aligned) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              >
                <TextReveal
                  text="Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest."
                  progress={secondTextProgress}
                  align="right"
                  className="text-lg md:text-xl lg:text-2xl"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default HowSection;
