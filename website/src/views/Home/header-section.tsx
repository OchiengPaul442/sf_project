"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import VideoSection from "./VideoSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HeaderSection() {
  const animation = useScrollAnimation();

  // Use the animation.ref for the scroll target
  const { scrollYProgress } = useScroll({
    target: animation.ref,
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

  // Adjusted x and y move for a slight shift back to the left
  const xMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%", // Initial position
    "-150%", // Slightly less than before
    "-350%",
    "-550%",
    "-750%", // Slightly less extreme than original
  ]);

  const yMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%", // Initial position
    "-50%", // Slightly less vertical movement
    "-50%",
    "-50%",
    "-50%", // Slightly less extreme than original
  ]);

  // Control "We're" text visibility
  const wereTextOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Control video section visibility
  const videoOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  const navOpacity = useTransform(
    scrollYProgress,
    COMMON_INPUT_RANGE,
    [1, 1, 0.5, 0, 0]
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
        <motion.div style={{ opacity: navOpacity }}>
          <Nav />
        </motion.div>

        {/* Main Content */}
        <div className="text-center relative z-10">
          <motion.h2
            className="text-[#A8A8A8] text-4xl mb-2 font-normal"
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
