"use client";

import React, { memo, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { LottieRefCurrentProps } from "lottie-react";
import type { SectionProps } from "@/utils/types/section";

// Dynamically load Lottie
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
    </div>
  ),
});

// Enhanced Glow effect behind the robot with a futuristic feel
const GlowEffect = memo(() => {
  const isMobile = isMobileDevice();
  const mobileConfig = {
    outer: "w-[250px] h-[250px] blur-[50px] opacity-25",
    inner: "w-[150px] h-[150px] blur-[30px] opacity-35",
  };
  const desktopConfig = {
    outer: "w-[650px] h-[650px] blur-[130px] opacity-30",
    inner: "w-[400px] h-[400px] blur-[90px] opacity-40",
  };
  const config = isMobile ? mobileConfig : desktopConfig;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${config.outer} rounded-full bg-green-500/40`}
        aria-hidden="true"
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${config.inner} rounded-full bg-green-400/30`}
        aria-hidden="true"
      />
      {/* Subtle grid pattern for added futuristic detail */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,150,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
    </div>
  );
});
GlowEffect.displayName = "GlowEffect";

const RobotSection: React.FC<SectionProps> = ({ id, animationData }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const isMobile = isMobileDevice();
  // On mobile, use full viewport height for a more compact, smooth scroll.
  const sectionHeight = isMobile ? "100vh" : "150vh";

  // Set up scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Adjusted breakpoints for smoother transitions
  const containerOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 1, 0],
    { clamp: true }
  );
  const containerScale = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 1, 0.95],
    { clamp: true }
  );
  const containerY = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0, 0, 0, -20],
    { clamp: true }
  );

  // Variants for child elements – visible immediately with subtle entrance transition
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: sectionHeight }}
    >
      {/* Fixed container for the robot content */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center"
        style={{
          opacity: containerOpacity,
          scale: containerScale,
          y: containerY,
          willChange: "opacity, transform",
        }}
      >
        <GlowEffect />

        <motion.div
          initial="visible"
          animate="visible"
          className="relative z-10 flex flex-col items-center text-center"
          style={{ willChange: "transform, opacity" }}
        >
          <motion.h2
            className="text-white text-3xl sm:text-4xl font-light mb-12 tracking-tight"
            variants={itemVariants}
          >
            with{" "}
            <span className="font-extrabold text-green-400 drop-shadow-lg">
              AI
              <motion.span
                className="text-white"
                animate={{
                  opacity: [1, 0.5, 1],
                  textShadow: [
                    "0 0 0px rgba(74, 222, 128, 0)",
                    "0 0 8px rgba(74, 222, 128, 0.6)",
                    "0 0 0px rgba(74, 222, 128, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ...
              </motion.span>
            </span>
          </motion.h2>
          <motion.div
            className="w-full max-w-[280px] sm:max-w-[400px] aspect-square"
            variants={itemVariants}
          >
            {animationData ? (
              <Lottie
                animationData={animationData}
                loop
                autoplay
                lottieRef={lottieRef}
                style={{
                  filter:
                    "brightness(0) invert(1) drop-shadow(0 0 8px rgba(74, 222, 128, 0.3))",
                  width: "100%",
                  height: "100%",
                  transform: "translateZ(0)",
                }}
                renderer={isMobile ? ("canvas" as any) : "svg"}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid slice",
                  progressiveLoad: !isMobile,
                  hideOnTransparent: true,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(RobotSection);
