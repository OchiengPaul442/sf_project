"use client";

import { GradientSeparator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HowSection() {
  const animation = useScrollAnimation();

  // Hook up scroll to the section
  const { scrollYProgress } = useScroll({
    target: animation.ref,
    offset: ["start start", "end end"],
  });

  // Define scroll progress ranges for each animation stage
  const SCROLL_RANGES = {
    firstScale: [0, 0.25],
    secondFade: [0.3, 0.5], // Start slightly after the first section
    separatorRotate: [0.35, 0.65], // Start after the second section starts
    thirdFade: [0.55, 0.8], // Start after the separator begins rotating
  };

  // ---- FIRST SECTION: Scale Down and Move Up Slightly ----
  const firstSectionScale = useTransform(
    scrollYProgress,
    SCROLL_RANGES.firstScale,
    [1.2, 1]
  );
  const firstSectionY = useTransform(
    scrollYProgress,
    SCROLL_RANGES.firstScale,
    [0, -20]
  );

  // ---- SECOND SECTION: Smooth Fade In from Bottom ----
  const secondSectionY = useTransform(
    scrollYProgress,
    SCROLL_RANGES.secondFade,
    [60, 0]
  );
  const secondSectionOpacity = useTransform(
    scrollYProgress,
    SCROLL_RANGES.secondFade,
    [0, 1]
  );

  // ---- SEPARATOR: Scale X and Rotate X ----
  const separatorScaleX = useTransform(
    scrollYProgress,
    SCROLL_RANGES.separatorRotate,
    [0, 1]
  );
  const separatorRotateX = useTransform(
    scrollYProgress,
    SCROLL_RANGES.separatorRotate,
    [0, 360] // Full 360-degree rotation
  );

  // ---- THIRD SECTION: Smooth Fade In from Bottom ----
  const thirdSectionY = useTransform(
    scrollYProgress,
    SCROLL_RANGES.thirdFade,
    [60, 0]
  );
  const thirdSectionOpacity = useTransform(
    scrollYProgress,
    SCROLL_RANGES.thirdFade,
    [0, 1]
  );

  // Common motion transition for a smoother, modern feel
  const transition = {
    duration: 0.8,
    ease: [0.25, 0.8, 0.25, 1],
  };

  return (
    <section
      ref={animation.ref}
      id="solutions"
      className="relative flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-black h-[250vh] overflow-hidden snap-start"
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

            {/* ---- SECOND SECTION (Fade In from Bottom) ---- */}
            <motion.div
              style={{ y: secondSectionY, opacity: secondSectionOpacity }}
              transition={transition}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight leading-relaxed mt-8 md:mt-12 lg:mt-16">
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

          {/* ---- SEPARATOR: Scale X and Rotate X ---- */}
          <motion.div
            style={{
              scaleX: separatorScaleX,
              rotateX: separatorRotateX,
            }}
            transition={transition}
            className="w-full my-12"
          >
            <GradientSeparator />
          </motion.div>

          {/* ---- THIRD SECTION (Fade In from Bottom) ---- */}
          <motion.div
            style={{ y: thirdSectionY, opacity: thirdSectionOpacity }}
            transition={transition}
          >
            <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-end font-normal ml-auto leading-relaxed">
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
