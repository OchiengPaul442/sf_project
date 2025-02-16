"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { useWindowSize } from "@/hooks/useWindowSize";
import NextButton from "@/components/NextButton"; // adjust import path as needed
import { mainConfigs } from "@/utils/configs";

export interface HeaderSectionProps {
  onNextSection?: () => void;
  onScrollProgress?: (progress: number) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  onNextSection,
  onScrollProgress,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Monitor scroll progress of the header section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Define thresholds.
  const SCALE_START = 0.1;
  const SCALE_PEAK = 0.5;
  const TEXT_FADE_START = 0.6;
  const TEXT_FADE_END = 0.8;
  const TRANSITION_TRIGGER = 0.95; // trigger a bit later to ensure bg is fully black

  const progressRange = [
    0,
    SCALE_START,
    SCALE_PEAK,
    TEXT_FADE_START,
    TEXT_FADE_END,
    1,
  ];

  // Utility to choose responsive transform ranges.
  const getResponsiveValue = (mobile: number[], desktop: number[]) =>
    isMobile ? mobile : desktop;

  // Animate text scaling.
  const textScale: MotionValue<number> = useTransform(
    scrollYProgress,
    progressRange,
    getResponsiveValue([1, 2, 5, 7, 9, 12], [1, 3, 8, 12, 14, 16])
  );

  // Instead of fading out the text, we now keep it fully visible.
  const textOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1]
  );

  // Adjust x/y movement (feel free to fine-tune these values).
  const xMove: MotionValue<number> = useTransform(
    scrollYProgress,
    progressRange,
    getResponsiveValue([0, -2, -5, -8, -10, -12], [0, -5, -10, -15, -20, -25])
  );

  const yMove: MotionValue<number> = useTransform(
    scrollYProgress,
    progressRange,
    getResponsiveValue([0, -1, -3, -4, -5, -6], [0, -3, -6, -9, -12, -15])
  );

  // Animate navigation opacity.
  const navOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3],
    [1, 0.7, 0]
  );

  // Intro text opacity (if you wish to tweak, you can adjust this too).
  const introTextOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25],
    [1, 0.5, 0]
  );

  // Animate the background color from white to black.
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["#ffffff", "#000000", "#000000"]
  );

  // Next button opacity fades out as scroll nears the end.
  const nextButtonOpacity = useTransform(
    scrollYProgress,
    [0, TEXT_FADE_END, 1],
    [1, 0.3, 0]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (onScrollProgress) {
        onScrollProgress(value);
      }
      // When progress nears the end, trigger the next section.
      if (value >= TRANSITION_TRIGGER && onNextSection) {
        onNextSection();
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, onScrollProgress, onNextSection]);

  return (
    // motion.section animates the background.
    <motion.section
      ref={sectionRef}
      id="header-section"
      style={{ backgroundColor }}
      className="relative h-[450vh] overflow-hidden"
    >
      <div
        className={`sticky top-0 h-screen ${mainConfigs.SECTION_CONTAINER_CLASS}`}
      >
        <motion.div
          style={{ opacity: navOpacity }}
          className="absolute top-4 right-4 z-40"
        >
          <Nav />
        </motion.div>

        {/* Next Button at bottom center */}
        <motion.div
          style={{ opacity: nextButtonOpacity }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40"
        >
          <NextButton onClick={onNextSection} />
        </motion.div>

        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-40">
          <motion.h2
            style={{ opacity: introTextOpacity }}
            className="text-gray-600 text-2xl md:text-4xl font-normal mb-4"
          >
            We&apos;re
          </motion.h2>
          <motion.h1
            style={{
              scale: textScale,
              opacity: textOpacity,
              x: xMove,
              y: yMove,
            }}
            className="font-bold tracking-tight text-black text-[8vw] md:text-[10vh]"
          >
            Saving Food.
          </motion.h1>
        </div>
      </div>
    </motion.section>
  );
};

export default HeaderSection;
