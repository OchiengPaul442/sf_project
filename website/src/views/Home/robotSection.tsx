"use client";

import React, { memo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useAnimation } from "framer-motion";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamically load Lottie
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import robotAnimation from "@/public/lottie/robot.json";

// 🌟 Adaptive Futuristic Glow Effect (Works on Mobile & Desktop) 🌟
const GlowEffect = memo(() => {
  const isMobile = isMobileDevice();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Outer Glow (Larger on Desktop, Scales Down on Mobile) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          ${
            isMobile
              ? "w-[350px] h-[350px] blur-[70px]"
              : "w-[600px] h-[600px] blur-[120px]"
          } 
          rounded-full opacity-30 animate-pulse-slow bg-green-500/50`}
        aria-hidden="true"
      />
      {/* Inner Glow (More Subtle, Smaller on Mobile) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          ${
            isMobile
              ? "w-[200px] h-[200px] blur-[40px]"
              : "w-[350px] h-[350px] blur-[80px]"
          } 
          rounded-full opacity-40 animate-pulse-slower bg-green-400/40`}
        aria-hidden="true"
      />
    </div>
  );
});

GlowEffect.displayName = "GlowEffect";

type RobotSectionProps = {
  id: string;
};

const RobotSection: React.FC<RobotSectionProps> = ({ id }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const controls = useAnimation();
  const isMobile = isMobileDevice();

  // 🚀 Ensure animation plays when in view (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lottieRef.current?.animationItem?.play();
          controls.start("visible");
        } else {
          lottieRef.current?.animationItem?.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [controls, isMobile]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative min-h-screen bg-black flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
    >
      {/* 🌟 Futuristic Glow Effect (Now Works on Mobile) */}
      <GlowEffect />

      {/* Title & Animation Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate="visible"
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* 🚀 Title */}
        <h2 className="text-white text-3xl sm:text-4xl font-light mb-12 tracking-tight">
          with{" "}
          <span className="font-extrabold text-green-400 drop-shadow-lg">
            AI<span className="text-white">...</span>
          </span>
        </h2>

        {/* 🤖 Robot Animation */}
        <div className="w-full max-w-[280px] sm:max-w-[400px] aspect-square">
          <Lottie
            animationData={robotAnimation}
            loop
            autoplay
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
        </div>
      </motion.div>
    </section>
  );
};

export default memo(RobotSection);
