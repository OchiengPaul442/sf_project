"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "../layout/Navs/nav";

export default function HeaderSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const COMMON_INPUT_RANGE = [0, 1];

  const textScale = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [1, 60]);
  const textOpacity = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [1, 1]);
  const backgroundOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  // x and y move to center on letter F in "Saving Food"
  const xMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%",
    "-850%",
  ]);
  const yMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%",
    "375%",
  ]);

  return (
    <motion.section ref={containerRef} className="relative min-h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: backgroundOpacity }}
        />

        {/* Navigation */}
        <Nav />

        {/* Main Content */}
        <div className="text-center">
          <h2 className="text-[#A8A8A8] text-2xl mb-2 font-mono">We&apos;re</h2>
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
      </div>
    </motion.section>
  );
}
