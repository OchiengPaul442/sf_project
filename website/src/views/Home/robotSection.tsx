"use client";

import React, { memo, useRef, useEffect } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
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

// Enhanced Glow effect behind the robot with more futuristic feel
const GlowEffect = memo(() => {
  const isMobile = isMobileDevice();
  const mobileConfig = {
    outer: "w-[250px] h-[250px] blur-[50px] opacity-25",
    inner: "w-[150px] h-[150px] blur-[30px] opacity-35",
    accent: "w-[100px] h-[100px] blur-[15px] opacity-40",
  };
  const desktopConfig = {
    outer: "w-[650px] h-[650px] blur-[130px] opacity-30",
    inner: "w-[400px] h-[400px] blur-[90px] opacity-40",
    accent: "w-[250px] h-[250px] blur-[50px] opacity-50",
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
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${config.accent} rounded-full bg-blue-400/20`}
        aria-hidden="true"
      />

      {/* Added subtle grid pattern for futuristic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,150,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
    </div>
  );
});
GlowEffect.displayName = "GlowEffect";

// New particle effect component
const ParticleEffect = memo(() => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-green-400"
          style={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});
ParticleEffect.displayName = "ParticleEffect";

const RobotSection: React.FC<SectionProps> = ({ id, animationData }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const controls = useAnimation();

  // Check if the content is in view for fade-in animation
  const isInView = useInView(contentRef, {
    once: false,
    amount: 0.2,
    margin: "-10% 0px -10% 0px",
  });

  // Set section height to cover the transition smoothly.
  const sectionHeight = "150vh";

  // Ensure the RobotSection has a persistent black background.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth out the progress for better animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Enhanced robot reveal: start a bit more visible and fade out later
  const containerOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.7, 0.9],
    [0.2, 1, 1, 0]
  );

  // New: Scale and position effects for smoother transition
  const containerScale = useTransform(
    smoothProgress,
    [0, 0.1, 0.7, 0.9],
    [0.95, 1, 1, 0.95]
  );

  // New: Move robot content slightly for parallax effect
  const containerY = useTransform(
    smoothProgress,
    [0, 0.1, 0.7, 0.9],
    [20, 0, 0, -20]
  );

  // Trigger the fade-in animation when content comes into view.
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Enhanced variants for the robot content with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full overflow-hidden bg-black z-20"
      style={{ height: sectionHeight }}
    >
      {/* Fixed container for Robot content */}
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
        <ParticleEffect />

        <motion.div
          ref={contentRef}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
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
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(RobotSection);
