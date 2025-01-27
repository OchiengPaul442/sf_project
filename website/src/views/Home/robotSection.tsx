"use client";

import React, { useEffect, useRef, memo } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";

// Preload the Lottie component
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// Use a static import for better performance
import robotAnimation from "@/public/lottie/robot.json";

// Optimized glow effect with reduced DOM elements
const GlowEffect = memo(function GlowEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px] animate-pulse-slow bg-blue-500/50"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] animate-pulse-slower bg-purple-500/50"
        aria-hidden="true"
      />
    </div>
  );
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const RobotSection: React.FC<any> = memo(function RobotSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: false });
  const controls = useAnimation();

  // Handle animation and visibility
  useEffect(() => {
    if (!lottieRef.current?.animationItem) return;

    const animation = lottieRef.current.animationItem;
    animation.setSpeed(1.2);

    if (isInView) {
      animation.play();
      controls.start("visible");
    } else {
      animation.pause();
    }

    // Cleanup
    return () => {
      animation.destroy();
    };
  }, [isInView, controls]);

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh snap-start bg-black flex flex-col items-center justify-center py-24 overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto flex flex-col items-center"
      >
        <motion.h2
          variants={itemVariants}
          className="text-white text-2xl md:text-4xl font-extralight tracking-[-0.02em] mb-16 text-center"
        >
          with{" "}
          <span className="inline-block font-extrabold">
            AI<span className="text-white">...</span>
          </span>
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="w-full max-w-[400px] aspect-square relative"
        >
          <Lottie
            animationData={robotAnimation}
            loop={isInView}
            autoplay={isInView}
            lottieRef={lottieRef}
            style={{
              filter: "brightness(0) invert(1)",
              width: "100%",
              height: "100%",
            }}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
              progressiveLoad: true,
              hideOnTransparent: true,
            }}
          />
        </motion.div>
      </motion.div>
      <GlowEffect />
    </section>
  );
});

export default RobotSection;
