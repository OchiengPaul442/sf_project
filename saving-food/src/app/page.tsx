"use client";

import React from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { FiMenu } from "react-icons/fi";

const LandingPage: React.FC = () => {
  const { scrollY } = useScroll();

  // Fade-out for header and subtitle
  const opacityElements = useTransform(scrollY, [1200, 1700], [1, 0], {
    clamp: true,
  });

  // Transformations for "Saving Food" text
  const scale = useTransform(scrollY, [0, 1800], [1, 35], { clamp: true });
  const opacityText = useTransform(scrollY, [1200, 1700], [1, 0], {
    clamp: true,
  });
  const translateX = useTransform(scrollY, [0, 1500], [0, -2600], {
    clamp: true,
  });
  const translateY = useTransform(scrollY, [0, 1800], [0, 400], {
    clamp: true,
  });

  // Video reveal with clipPath and opacity
  const opacityVideo = useTransform(scrollY, [1200, 1700], [0, 1], {
    clamp: true,
  });

  // Clip path for text masking and video reveal
  const textMaskClipPath = useTransform(
    scrollY,
    [800, 1500],
    ["circle(100% at 50% 50%)", "circle(10% at 50% 50%)"],
    { clamp: true }
  );

  const videoClipPath = useTransform(
    scrollY,
    [1000, 1800],
    ["circle(10% at 50% 50%)", "circle(150% at 50% 50%)"],
    { clamp: true }
  );

  return (
    <div className="relative bg-white min-h-[300vh] overflow-hidden">
      {/* Video Section with Clip Path Reveal */}
      <motion.div
        className="fixed inset-0 z-10"
        style={{
          opacity: opacityVideo,
          clipPath: videoClipPath as MotionValue<string>,
        }}
      >
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
      </motion.div>

      {/* Top Bar */}
      <motion.header
        style={{ opacity: opacityElements }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 bg-transparent"
      >
        <div className="text-black font-bold text-xl">sf.</div>
        <FiMenu className="text-black text-2xl cursor-pointer" />
      </motion.header>

      {/* Main Animated Content */}
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
        style={{
          clipPath: textMaskClipPath as MotionValue<string>,
        }}
      >
        {/* Subtitle */}
        <motion.h2
          style={{ opacity: opacityElements }}
          className="text-gray-500 font-light text-xl sm:text-4xl tracking-wider"
        >
          We&apos;re
        </motion.h2>

        {/* Animated "Saving Food" */}
        <motion.h1
          style={{
            scale,
            opacity: opacityText,
            translateX,
            translateY,
          }}
          className="font-bold text-6xl sm:text-8xl md:text-9xl tracking-tight text-black"
        >
          Saving Food
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default LandingPage;
