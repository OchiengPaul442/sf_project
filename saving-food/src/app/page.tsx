"use client";

import React from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Lottie from "lottie-react";

import stuffAnimation from "../lottie/stuff.json";
import waterAnimation from "../lottie/water.json";
import energyAnimation from "../lottie/energy.json";
import foodAnimation from "../lottie/food.json";

// Reusable Lottie Animation Component with Framer Motion for Entrance Animations
interface LottieAnimationProps {
  animationData: object;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  delay?: number;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className,
  style,
  loop = true,
  autoplay = true,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay }}
      className={className}
      style={style}
    >
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </motion.div>
  );
};

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

  // Fade-out and movement for Lottie animations on scroll
  const fadeLottie = useTransform(scrollY, [1500, 2000], [1, 0], {
    clamp: true,
  });

  // Movement transforms for each Lottie animation
  const translateLottieTopLeftX = useTransform(
    scrollY,
    [1500, 2000],
    [0, -100],
    { clamp: true }
  );
  const translateLottieTopLeftY = useTransform(
    scrollY,
    [1500, 2000],
    [0, -100],
    { clamp: true }
  );

  const translateLottieTopRightX = useTransform(
    scrollY,
    [1500, 2000],
    [0, 100],
    { clamp: true }
  );
  const translateLottieTopRightY = useTransform(
    scrollY,
    [1500, 2000],
    [0, -100],
    { clamp: true }
  );

  const translateLottieBottomLeftX = useTransform(
    scrollY,
    [1500, 2000],
    [0, -100],
    { clamp: true }
  );
  const translateLottieBottomLeftY = useTransform(
    scrollY,
    [1500, 2000],
    [0, 100],
    { clamp: true }
  );

  const translateLottieBottomRightX = useTransform(
    scrollY,
    [1500, 2000],
    [0, 100],
    { clamp: true }
  );
  const translateLottieBottomRightY = useTransform(
    scrollY,
    [1500, 2000],
    [0, 100],
    { clamp: true }
  );

  // Variants for staggering Lottie animations
  const lottieContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const lottieVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div>
      <section className="relative bg-white min-h-[300vh] overflow-hidden">
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
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-gray-500 font-light text-xl sm:text-4xl tracking-wider relative"
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="font-bold text-6xl sm:text-8xl md:text-9xl tracking-tight text-black text-center"
          >
            Saving Food
          </motion.h1>
        </motion.div>

        {/* Lottie Animations Positioned Around the Text */}
        <motion.div
          className="absolute inset-0 flex items-center h-dvh justify-center pointer-events-none"
          variants={lottieContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top-Left Animation */}
          <motion.div
            className="absolute top-16 left-16 transform -translate-x-1/2 -translate-y-1/2"
            variants={lottieVariants}
            style={{
              x: translateLottieTopLeftX,
              y: translateLottieTopLeftY,
              opacity: fadeLottie,
            }}
          >
            <LottieAnimation
              animationData={foodAnimation}
              className="w-24 h-24 sm:w-40 sm:h-40"
              delay={1.5} // Delay after text reveal
            />
          </motion.div>

          {/* Top-Right Animation */}
          <motion.div
            className="absolute top-16 right-16 transform translate-x-1/2 -translate-y-1/2"
            variants={lottieVariants}
            style={{
              x: translateLottieTopRightX,
              y: translateLottieTopRightY,
              opacity: fadeLottie,
            }}
          >
            <LottieAnimation
              animationData={waterAnimation}
              className="w-24 h-24 sm:w-40 sm:h-40"
              delay={1.7}
            />
          </motion.div>

          {/* Bottom-Left Animation */}
          <motion.div
            className="absolute bottom-16 left-16 transform -translate-x-1/2 translate-y-1/2"
            variants={lottieVariants}
            style={{
              x: translateLottieBottomLeftX,
              y: translateLottieBottomLeftY,
              opacity: fadeLottie,
            }}
          >
            <LottieAnimation
              animationData={energyAnimation}
              className="w-24 h-24 sm:w-40 sm:h-40"
              delay={1.9}
            />
          </motion.div>

          {/* Bottom-Right Animation */}
          <motion.div
            className="absolute bottom-16 right-16 transform translate-x-1/2 translate-y-1/2"
            variants={lottieVariants}
            style={{
              x: translateLottieBottomRightX,
              y: translateLottieBottomRightY,
              opacity: fadeLottie,
            }}
          >
            <LottieAnimation
              animationData={stuffAnimation}
              className="w-24 h-24 sm:w-40 sm:h-40"
              delay={2.1}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
