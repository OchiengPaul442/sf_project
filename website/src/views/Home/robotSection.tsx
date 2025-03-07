"use client";

import React, { memo, useRef, useEffect } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
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

// Glow effect behind the robot
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
  const sectionRef = useRef<HTMLElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const controls = useAnimation();

  // Outer wrapper height for spacing
  const sectionHeight = "300vh";

  // Use scroll on the RobotSection’s wrapper
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Fade out the Robot content from 80% → 100% scroll
  const containerOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  useEffect(() => {
    // Start the fade-in animation for the content
    controls.start("visible");
  }, [controls]);

  // Basic fade/slide variant
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
      ref={sectionRef}
      id={id}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: sectionHeight }}
    >
      {/* Fixed container for Robot content */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center"
        style={{ opacity: containerOpacity }}
      >
        <GlowEffect />

        <motion.div
          initial="hidden"
          animate={controls}
          variants={variants}
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-10 flex flex-col items-center text-center"
          style={{ willChange: "transform" }}
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
                loop
                autoplay
                lottieRef={lottieRef}
                style={{
                  filter: "brightness(0) invert(1)",
                  width: "100%",
                  height: "100%",
                }}
                renderer={isMobileDevice() ? ("canvas" as any) : "svg"}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid slice",
                  progressiveLoad: !isMobileDevice(),
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
      </motion.div>
    </section>
  );
};

export default memo(RobotSection);
