"use client";

import React, { useRef, useEffect, memo } from "react";
import { motion, useAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { LottieRefCurrentProps } from "lottie-react";
import type { SectionProps } from "@/utils/types/section";

// Dynamically load Lottie.
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
    </div>
  ),
});

// GlowEffect component.
const GlowEffect = memo(() => {
  const isMobile = isMobileDevice();

  const mobileConfig = {
    outer: "w-[250px] h-[250px] blur-[40px] opacity-20",
    inner: "w-[150px] h-[150px] blur-[25px] opacity-30",
  };

  const desktopConfig = {
    outer: "w-[600px] h-[600px] blur-[120px] opacity-30",
    inner: "w-[350px] h-[350px] blur-[80px] opacity-40",
  };

  const config = isMobile ? mobileConfig : desktopConfig;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${config.outer} rounded-full bg-green-500/50`}
        aria-hidden="true"
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${config.inner} rounded-full bg-green-400/40`}
        aria-hidden="true"
      />
    </div>
  );
});

GlowEffect.displayName = "GlowEffect";

const RobotSection: React.FC<SectionProps> = ({ id, animationData }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const controls = useAnimation();

  // Start the fade-in animation when the section is in view.
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id={id}
      className="relative w-full h-dvh md:min-h-screen bg-black flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
    >
      {/* Glow effect behind the animation */}
      <GlowEffect />
      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h2 className="text-white text-3xl sm:text-4xl font-light mb-12 tracking-tight">
          with{" "}
          <span className="font-extrabold text-green-400 drop-shadow-lg">
            AI<span className="text-white">...</span>
          </span>
        </h2>
        <div className="w-full max-w-[280px] sm:max-w-[400px] aspect-square">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
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
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(RobotSection);
