"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import dynamic from "next/dynamic";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import Lottie animation data
import foodAnimation from "@/lottie/food.json";
import waterAnimation from "@/lottie/water.json";
import energyAnimation from "@/lottie/energy.json";
import stuffAnimation from "@/lottie/stuff.json";

interface LandingSectionProps {
  opacityText: MotionValue<number>;
}

const LandingSection: React.FC<LandingSectionProps> = ({ opacityText }) => (
  <section className="relative bg-white h-screen flex items-center justify-center overflow-hidden">
    {/* Top Bar */}
    <motion.header
      style={{ opacity: opacityText }}
      className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 bg-transparent container mx-auto"
    >
      <div className="text-black font-bold text-xl">sf.</div>
      <FiMenu className="text-black text-2xl cursor-pointer" />
    </motion.header>

    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center container mx-auto">
      {/* Subtitle */}
      <motion.h2
        style={{ opacity: opacityText }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-gray-500 font-light text-xl sm:text-2xl tracking-wide"
      >
        We&apos;re
      </motion.h2>

      {/* Title */}
      <motion.h1
        style={{ opacity: opacityText }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        className="font-bold text-6xl sm:text-8xl md:text-9xl tracking-tight text-black text-center"
      >
        Saving Food
      </motion.h1>
    </div>

    {/* Lottie Animations Positioned Around the Text */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none container mx-auto">
      {/* Top-Left Animation */}
      <motion.div
        className="absolute top-16 left-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Lottie animationData={foodAnimation} className="w-24 h-24" />
      </motion.div>

      {/* Top-Right Animation */}
      <motion.div
        className="absolute top-16 right-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      >
        <Lottie animationData={waterAnimation} className="w-24 h-24" />
      </motion.div>

      {/* Bottom-Left Animation */}
      <motion.div
        className="absolute bottom-16 left-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
      >
        <Lottie animationData={energyAnimation} className="w-24 h-24" />
      </motion.div>

      {/* Bottom-Right Animation */}
      <motion.div
        className="absolute bottom-16 right-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
      >
        <Lottie animationData={stuffAnimation} className="w-24 h-24" />
      </motion.div>
    </div>
  </section>
);

export default LandingSection;
