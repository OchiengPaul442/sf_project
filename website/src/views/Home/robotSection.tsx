"use client";

import React, { useEffect, useRef, lazy } from "react";
import { motion } from "framer-motion";
import type { LottieRefCurrentProps } from "lottie-react";

// Lazy load Lottie
const Lottie = lazy(() => import("lottie-react"));
import RobotAnimation from "@/public/lottie/robot.json";

const RobotSection: React.FC<any> = () => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    if (lottieRef.current?.animationItem) {
      lottieRef.current.animationItem.setSpeed(1.2);
    }
  }, []);

  return (
    <section className="relative h-dvh snap-start bg-black flex flex-col items-center justify-center py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto flex flex-col items-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white text-2xl md:text-4xl font-extralight tracking-[-0.02em] mb-16 text-center"
        >
          with{" "}
          <span className="inline-block font-extrabold">
            AI<span className="text-white">...</span>
          </span>
        </motion.h2>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-[400px] aspect-square relative"
        >
          <Lottie
            animationData={RobotAnimation}
            loop
            autoplay
            lottieRef={lottieRef}
            style={{
              filter: "brightness(0) invert(1)",
              width: "100%",
              height: "100%",
            }}
          />
        </motion.div>
      </motion.div>
      <GlowEffect />
    </section>
  );
};

RobotSection.displayName = "RobotSection";
export default RobotSection;

// Optional Glow Effect
const GlowEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full opacity-10 blur-[100px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500 rounded-full opacity-10 blur-[100px] animate-pulse-slower" />
    </div>
  );
};
