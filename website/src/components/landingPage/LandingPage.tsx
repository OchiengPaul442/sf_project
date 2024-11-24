"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import dynamic from "next/dynamic";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import Lottie animation data
import animationWithUs from "@/lottie/animationWithUs.json";
import animationWithoutUs from "@/lottie/animationWithoutUs.json";

// Import individual sections
import LandingSection from "./LandingSection";
import VideoSection from "./VideoSection";
import MaskedTextSection from "./MaskedTextSection";
import FormSection from "./FormSection";
import FooterSection from "./FooterSection";

const Loader = dynamic(() => import("@/components/loader"), { ssr: false });

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHoveringWithUs, setIsHoveringWithUs] = useState<boolean>(false);
  const [isHoveringWithoutUs, setIsHoveringWithoutUs] =
    useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Framer Motion hooks for scroll-based animations
  const { scrollY } = useScroll();
  const opacityText = useTransform(scrollY, [0, 500], [1, 0], { clamp: true });

  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Variants for smooth transitions between sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Landing Section */}
      <LandingSection opacityText={opacityText} />

      {/* Smooth transition */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8 }}
      >
        {/* Fullscreen Video Section */}
        <VideoSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Third Section: Video in Text */}
        <MaskedTextSection maskId="text-mask" fontSize={120} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Top Text */}
        <div className="text-gray-300 text-center w-full text-xl md:text-2xl font-medium mb-2 z-10">
          We&apos;re
        </div>

        {/* Masked Video Text */}
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-5xl h-[200px] flex text-center justify-center items-center">
            {/* Background Video */}
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/video/video.webm" type="video/webm" />
              <source src="/video/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* SVG for Text Mask */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute w-full h-full"
              viewBox="0 0 1200 200"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <mask id="text-mask-1" x="0" y="0" width="100%" height="100%">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="black"
                    fontFamily="Arial, sans-serif"
                    fontWeight="bold"
                    fontSize="100px"
                  >
                    Saving Food
                  </text>
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="black"
                mask={`url(#text-mask-1)`}
              />
            </svg>
          </div>
        </div>

        {/* Problem Statement Text */}
        <div className="text-start text-white w-full mb-16 container mx-auto px-8">
          <h2 className="font-thin text-5xl md:text-6xl text-[#A8A8A8] mb-8 tracking-wide">
            The problem statement
          </h2>
          <p className="text-[#A8A8A8] text-3xl md:text-4xl font-medium leading-tight">
            <span className="font-bold text-white">
              By building a platform that empowers restaurants
            </span>
            <br />
            to cut food waste,{" "}
            <span className="font-bold">protect their bottom line</span>, and
            have a meaningful, cumulative impact on global sustainability.
          </p>
        </div>
      </motion.div>

      {/* With Us and Without Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex justify-between items-center w-full container mx-auto px-8 mb-56"
      >
        {/* With Us */}
        <motion.div
          className="relative flex flex-col items-start gap-2 text-white cursor-pointer"
          onMouseEnter={() => setIsHoveringWithUs(true)}
          onMouseLeave={() => setIsHoveringWithUs(false)}
        >
          <p
            className={`transition-all duration-300 ${
              isHoveringWithUs ? "text-6xl font-bold" : "text-4xl font-thin"
            }`}
          >
            With
          </p>
          <p
            className={`transition-all duration-300 ${
              isHoveringWithUs ? "text-6xl font-bold" : "text-4xl font-thin"
            }`}
          >
            Us
          </p>
          <FiArrowDownLeft
            className={`transition-all duration-300 ${
              isHoveringWithUs
                ? "text-5xl text-gray-200"
                : "text-3xl text-gray-400"
            }`}
          />
          {isHoveringWithUs && (
            <motion.div
              className="absolute top-[20px] left-[120%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, x: -100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Lottie animationData={animationWithUs} loop={true} />
            </motion.div>
          )}
        </motion.div>

        {/* Without Us */}
        <motion.div
          className="relative flex flex-col items-end gap-2 text-white cursor-pointer"
          onMouseEnter={() => setIsHoveringWithoutUs(true)}
          onMouseLeave={() => setIsHoveringWithoutUs(false)}
        >
          <p
            className={`transition-all duration-300 ${
              isHoveringWithoutUs ? "text-6xl font-bold" : "text-4xl font-thin"
            }`}
          >
            Without
          </p>
          <p
            className={`transition-all duration-300 ${
              isHoveringWithoutUs ? "text-6xl font-bold" : "text-4xl font-thin"
            }`}
          >
            Us
          </p>
          <FiArrowUpRight
            className={`transition-all duration-300 ${
              isHoveringWithoutUs
                ? "text-5xl text-gray-200"
                : "text-3xl text-gray-400"
            }`}
          />
          {isHoveringWithoutUs && (
            <motion.div
              className="absolute top-[20px] right-[120%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Lottie animationData={animationWithoutUs} loop={false} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Work with Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="w-full flex justify-center h-screen items-center pt-20 container mx-auto px-8"
      >
        <div className="bg-[#F5F5F5] rounded-3xl px-8 py-12 text-center">
          {/* Top Heading */}
          <h2 className="text-[36px] font-normal text-gray-600 tracking-wide mb-4">
            Work with us
          </h2>

          {/* Main Question */}
          <h1 className="text-4xl md:text-[96px] font-semibold text-black leading-[96px] mb-8">
            Are you’re an engineer <br />
            who’s excited about our mission?
          </h1>

          {/* Button */}
          <div className="flex justify-center items-center">
            <motion.button
              className="flex items-center gap-4 px-6 py-2 w-[140px] bg-gray-300 rounded-full relative shadow-md"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="text-lg text-black font-medium">Reach out</span>
              <motion.div
                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full absolute -right-4"
                animate={{
                  x: isHovering ? 10 : 0,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                →
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <FormSection />
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <FooterSection scrollToTop={scrollToTop} />
      </motion.div>
    </div>
  );
};

export default LandingPage;
