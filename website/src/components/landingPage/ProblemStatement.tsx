"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import animationWithUs from "@/lottie/animationWithUs.json";
import animationWithoutUs from "@/lottie/animationWithoutUs.json";

export const ProblemStatement: React.FC = () => {
  const [hoveredSection, setHoveredSection] = useState<
    "with" | "without" | null
  >(null);

  return (
    <section className="min-h-screen w-full py-16 md:py-24 lg:py-32 font-mono -mt-52 md:-mt-[350px]">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 md:mb-16 lg:mb-20 flex flex-col items-start">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-xl sm:text-2xl mb-4 sm:mb-6"
          >
            The problem statement
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white text-4xl sm:text-5xl md:text-6xl font-normal mb-4"
          >
            By building a platform that empowers restaurants
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-400 text-2xl sm:text-3xl md:text-4xl leading-relaxed"
          >
            to cut food waste, protect their bottom line, and have a meaningful,
            cumulative impact on global sustainability.
          </motion.p>
        </div>

        {/* Interactive Section */}
        <div className="flex flex-col items-center w-full mt-16 sm:mt-24 md:mt-32">
          <div className="flex justify-between items-start w-full mb-8 sm:mb-12 md:mb-16 relative">
            <WithWithoutSection
              type="with"
              hoveredSection={hoveredSection}
              setHoveredSection={setHoveredSection}
            />
            <WithWithoutSection
              type="without"
              hoveredSection={hoveredSection}
              setHoveredSection={setHoveredSection}
            />

            {/* Centered Animation */}
            <AnimatePresence>
              {hoveredSection && (
                <motion.div
                  key={hoveredSection}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute top-full left-1/4 transform -translate-x-1/2 w-full max-w-[600px] md:max-w-[800px] aspect-square"
                >
                  <Lottie
                    animationData={
                      hoveredSection === "with"
                        ? animationWithUs
                        : animationWithoutUs
                    }
                    loop={true}
                    className="w-full h-full rounded-2xl overflow-hidden"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

interface WithWithoutSectionProps {
  type: "with" | "without";
  hoveredSection: "with" | "without" | null;
  setHoveredSection: React.Dispatch<
    React.SetStateAction<"with" | "without" | null>
  >;
}

const WithWithoutSection: React.FC<WithWithoutSectionProps> = ({
  type,
  hoveredSection,
  setHoveredSection,
}) => {
  const isHovered = hoveredSection === type;
  const isWithUs = type === "with";

  return (
    <motion.div
      className={`cursor-pointer ${isWithUs ? "" : "text-right"}`}
      onMouseEnter={() => setHoveredSection(type)}
      onMouseLeave={() => setHoveredSection(null)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex items-center gap-2 ${
          isWithUs ? "" : "flex-row-reverse"
        }`}
      >
        <div className={`space-y-0 ${isWithUs ? "" : "text-right"}`}>
          <motion.p
            animate={{
              fontSize: isHovered ? "72px" : "32px",
              fontWeight: isHovered ? "700" : "200",
              lineHeight: isHovered ? "1" : "1.2",
            }}
            transition={{ duration: 0.3 }}
            className="text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {isWithUs ? "With" : "Without"}
          </motion.p>
          <motion.p
            animate={{
              fontSize: isHovered ? "72px" : "32px",
              fontWeight: isHovered ? "700" : "200",
              lineHeight: isHovered ? "1" : "1.2",
            }}
            transition={{ duration: 0.3 }}
            className="text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Us
          </motion.p>
        </div>
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
          className={`text-white transform ${
            isWithUs ? "rotate-[-45deg]" : "rotate-45"
          }`}
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default ProblemStatement;
