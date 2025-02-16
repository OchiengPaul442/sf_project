"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { isMobileDevice } from "@/utils/deviceDetection";

export interface HowSectionProps {
  id: string;
  onNextSection?: () => void;
}

const HowSection: React.FC<HowSectionProps> = ({ id, onNextSection }) => {
  const isMobile = isMobileDevice();

  // Use a multiplier for section height (adjust as needed).
  const viewportMultiplier = isMobile ? 2.5 : 3;
  const sectionHeight = useMemo(
    () => `${viewportMultiplier * 100}vh`,
    [viewportMultiplier]
  );

  // Use an intersection observer to determine if the section is in view.
  const { ref: containerRef, inView: sectionInView } = useInView({
    threshold: 0.3, // when at least 30% of the section is visible
    triggerOnce: false,
  });

  // An invisible element covers the section to drive scroll progress.
  const progressRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: progressRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll progress.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((v) => setProgress(v));
    return () => unsubscribe();
  }, [smoothProgress]);

  // Trigger onNextSection when nearing the end.
  useEffect(() => {
    if (progress >= 0.95 && onNextSection) {
      onNextSection();
    }
  }, [progress, onNextSection]);

  // Create an opacity mapping for the fixed container (fade in/out).
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Only render the fixed (pinned) content when this section is in view.
  const renderFixed = sectionInView;

  // Define the reveal ranges for each text element (as two-element tuples).
  const paragraphRanges: {
    first: [number, number];
    gradient: [number, number];
    second: [number, number];
  } = {
    first: isMobile
      ? ([0, 0.3] as [number, number])
      : ([0, 0.25] as [number, number]),
    gradient: isMobile
      ? ([0.28, 0.35] as [number, number])
      : ([0.24, 0.32] as [number, number]),
    second: isMobile
      ? ([0.35, 0.7] as [number, number])
      : ([0.32, 0.65] as [number, number]),
  };

  // Example text content.
  const paragraphs = {
    first:
      "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability.",
    second:
      "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest.",
  };

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden"
      style={{ height: sectionHeight, zIndex: 1 }} // Lower z-index so that later sections overlay it when needed.
    >
      {/* Invisible element for scroll progress */}
      <div ref={progressRef} className="absolute inset-0" />

      {renderFixed && (
        <motion.div
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none"
          style={{ opacity, zIndex: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-12 md:space-y-16">
              <div className="relative">
                <TextReveal
                  text={paragraphs.first}
                  progress={progress}
                  range={paragraphRanges.first}
                  align="left"
                />
              </div>
              <div className="relative">
                <GradientSeparator
                  progress={Math.max(
                    0,
                    Math.min(
                      1,
                      (progress - paragraphRanges.gradient[0]) /
                        (paragraphRanges.gradient[1] -
                          paragraphRanges.gradient[0])
                    )
                  )}
                />
              </div>
              <div className="relative">
                <TextReveal
                  text={paragraphs.second}
                  progress={progress}
                  range={paragraphRanges.second}
                  align="right"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default HowSection;
