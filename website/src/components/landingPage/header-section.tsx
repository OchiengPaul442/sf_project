"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "../layout/Navs/nav";
import VideoSection from "./VideoSection";

export default function HeaderSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const COMMON_INPUT_RANGE = [0, 0.3, 0.5, 0.7, 1];

  const textScale = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    [1, 15, 30, 45, 60]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    [1, 1, 0.5, 0, 0]
  );
  const backgroundOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  // x and y move to center on letter F in "Saving Food"
  const xMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%",
    "-212.5%",
    "-425%",
    "-637.5%",
    "-850%",
  ]);
  const yMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%",
    "93.75%",
    "187.5%",
    "281.25%",
    "375%",
  ]);

  // Control "We're" text visibility
  const wereTextOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Control video section visibility
  const videoOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <motion.section ref={containerRef} className="relative min-h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: backgroundOpacity }}
        />

        {/* Navigation */}
        <Nav />

        {/* Main Content */}
        <div className="text-center relative z-10">
          <motion.h2
            className="text-[#A8A8A8] text-2xl mb-2 font-mono"
            style={{ opacity: wereTextOpacity }}
          >
            We&apos;re
          </motion.h2>
          <motion.h1
            style={{
              scale: textScale,
              opacity: textOpacity,
              x: xMove,
              y: yMove,
              fontSize: "10vw",
              color: "#000000",
            }}
            className="text-6xl font-bold tracking-tight"
          >
            Saving Food.
          </motion.h1>
        </div>

        {/* Video Section */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ opacity: videoOpacity }}
        >
          <VideoSection />
        </motion.div>
      </div>
    </motion.section>
  );
}
