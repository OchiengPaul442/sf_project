"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import lottie from "lottie-web";
import RobotAnimation from "@/public/lottie/robot.json";

const RobotSection: React.FC = () => {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: RobotAnimation,
      });

      return () => anim.destroy();
    }
  }, []);

  return (
    <section className="relative min-h-dvh snap-start bg-black flex flex-col items-center justify-center py-24 overflow-hidden">
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
          <div
            ref={animationContainer}
            className="w-full h-full"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </motion.div>
      </motion.div>
      <GlowEffect />
    </section>
  );
};

const GlowEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full opacity-10 blur-[100px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500 rounded-full opacity-10 blur-[100px] animate-pulse-slower" />
    </div>
  );
};

export default RobotSection;
