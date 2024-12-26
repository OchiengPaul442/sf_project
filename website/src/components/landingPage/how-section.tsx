"use client";

import { GradientSeparator } from "@/components/ui/separator";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HowSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Hook up scroll to the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Define scroll progress ranges for each animation stage
  const SCROLL_RANGES = {
    firstScale: [0, 0.25, 0.5],
    secondFade: [0.25, 0.5, 0.75],
    thirdFade: [0.5, 0.75, 1],
  };

  // ---- FIRST SECTION: Scale Down from 1.2 to 1 and move up slightly ----
  const firstSectionScale = useTransform(
    scrollYProgress,
    SCROLL_RANGES.firstScale,
    [1.2, 1, 1.2]
  );
  const firstSectionY = useTransform(
    scrollYProgress,
    SCROLL_RANGES.firstScale,
    [0, -20, 0]
  );

  // ---- SECOND SECTION: Fade In and move up ----
  const secondSectionY = useTransform(
    scrollYProgress,
    SCROLL_RANGES.secondFade,
    [120, 0, 120]
  );
  const secondSectionOpacity = useTransform(
    scrollYProgress,
    SCROLL_RANGES.secondFade,
    [0, 1, 0]
  );

  // ---- SEPARATOR: Scale X from 0 to 1 over secondFade, then Rotate Y over thirdFade ----
  const separatorScaleX = useTransform(
    scrollYProgress,
    SCROLL_RANGES.secondFade,
    [0, 1, 0]
  );

  // ---- THIRD SECTION: Fade In and move up ----
  const thirdSectionY = useTransform(
    scrollYProgress,
    SCROLL_RANGES.thirdFade,
    [120, 0, 120]
  );
  const thirdSectionOpacity = useTransform(
    scrollYProgress,
    SCROLL_RANGES.thirdFade,
    [0, 1, 0]
  );

  // Common motion transition for a smoother, modern feel
  const transition = {
    duration: 0.8,
    ease: [0.25, 0.8, 0.25, 1],
  };

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-black min-h-[250vh] overflow-hidden snap-start"
    >
      <div className="container mx-auto space-y-36 md:space-y-48 lg:space-y-64">
        <div className="space-y-36 md:space-y-48 lg:space-y-64">
          <div className="relative z-10">
            {/* ---- FIRST SECTION (Scale Down) ---- */}
            <motion.div
              style={{
                scale: firstSectionScale,
                y: firstSectionY,
              }}
              transition={transition}
              className="origin-top-left"
            >
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 lg:mb-8">
                <span className="text-zinc-500 font-normal block mb-2 md:mb-4">
                  We&apos;re
                </span>
                <span className="inline-block">Saving Food.</span>
              </h2>
            </motion.div>

            {/* ---- SECOND SECTION (Fade In) ---- */}
            <motion.div
              style={{ y: secondSectionY, opacity: secondSectionOpacity }}
              transition={transition}
            >
              <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-mono tracking-tight leading-relaxed max-w-4xl mt-8 md:mt-12 lg:mt-16">
                <span className="text-white">
                  By building a platform that empowers
                </span>{" "}
                <span className="text-zinc-500">
                  restaurants to cut food waste, protect their bottom line, and
                  have a meaningful, cumulative impact on global sustainability.
                </span>
              </p>
            </motion.div>
          </div>

          {/* ---- SEPARATOR: Scale X and then Rotate Y ---- */}
          <motion.div
            style={{ scaleX: separatorScaleX }}
            transition={transition}
            className="w-full my-12"
          >
            <GradientSeparator />
          </motion.div>

          {/* ---- THIRD SECTION (Fade In) ---- */}
          <motion.div
            style={{ y: thirdSectionY, opacity: thirdSectionOpacity }}
            transition={transition}
          >
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-end font-mono leading-relaxed max-w-4xl ml-auto">
              <span className="text-white">
                Our team blends more than a decade of Food and AI
              </span>{" "}
              <span className="text-zinc-500">
                experience, in a packaged solution that lets you focus on
                creating while we handle the rest.
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
