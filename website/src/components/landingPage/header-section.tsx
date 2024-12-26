"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "../layout/Navs/nav";
import VideoSection from "./VideoSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HeaderSection() {
  const animation = useScrollAnimation();

  // Use the animation.ref for the scroll target
  const { scrollYProgress } = useScroll({
    target: animation.ref,
    offset: ["start start", "end start"],
  });

  // Common input range for multiple transforms
  const COMMON_INPUT_RANGE = [0, 0.3, 0.5, 0.7, 1];

  // Adjusted scale for a more pronounced and modern effect
  const textScale = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    [1, 15, 25, 35, 45] // Increased scale values for dramatic exit
  );

  // Adjusted opacity to synchronize with scaling
  const textOpacity = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    [1, 1, 0.6, 0.3, 0] // Smoother fade-out
  );

  // Extended background opacity transition for a smoother effect
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.6], // Extended range for smoother transition
    [0, 1]
  );

  // Adjusted xMove to shift text to the left more subtly
  const xMove = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    ["0%", "-100%", "-200%", "-300%", "-400%"] // Moved left less for a subtle effect
  );

  // Adjusted yMove for smoother vertical movement
  const yMove = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    ["0%", "60%", "120%", "180%", "240%"] // Smoother vertical movement
  );

  // Control "We're" text visibility
  const wereTextOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Extended video opacity transition for longer visibility
  const videoOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.7], // Extended range for smoother fade-in
    [0, 1]
  );

  return (
    <section
      ref={animation.ref}
      style={animation.style}
      className="relative min-h-[400vh] snap-start"
    >
      <div className="sticky top-0 h-screen bg-white flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black to-gray-800"
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
    </section>
  );
}
