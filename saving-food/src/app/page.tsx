"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiMenu } from "react-icons/fi";

const LandingPage: React.FC = () => {
  const { scrollY } = useScroll();

  // Define scaling and opacity transformations for the entire "Saving Food" text
  const scale = useTransform(scrollY, [0, 1200], [1, 20], { clamp: true }); // Increased scale for full zoom
  const opacity = useTransform(scrollY, [1200, 1500], [1, 0], { clamp: true }); // Fade out after full zoom

  // Define horizontal translation (x) to center on the "F"
  const x = useTransform(scrollY, [0, 1200], [0, -1700], { clamp: true });

  return (
    <div className="relative bg-white min-h-[200vh] overflow-x-hidden">
      {/* Top Bar - Static */}
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 bg-transparent">
        {/* Logo */}
        <div className="text-black font-bold text-lg">sf.</div>

        {/* Menu Icon */}
        <FiMenu className="text-black text-2xl" />
      </header>

      {/* Main Animated Text */}
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        <h2 className="text-gray-500 font-light text-xl sm:text-4xl tracking-wider">
          We’re
        </h2>
        <motion.h1
          style={{
            scale,
            opacity,
            x,
          }}
          className="font-bold text-6xl sm:text-8xl md:text-9xl tracking-tight text-black"
        >
          Saving Food
        </motion.h1>
      </div>
    </div>
  );
};

export default LandingPage;
