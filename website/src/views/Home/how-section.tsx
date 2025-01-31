"use client";

import React from "react";
import { motion } from "framer-motion";
import type { SectionProps } from "@/utils/types/section";
import { SECTION_CONTAINER_CLASS } from "@/utils/configs";

const GradientSeparator: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="relative w-full flex items-center gap-4 py-6">
      <div className="absolute w-full flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        <div className="flex-1 h-px bg-gradient-to-l from-white/20 to-transparent" />
      </div>

      <div
        className="flex-1 h-px bg-gradient-to-r from-white to-transparent transition-opacity duration-300"
        style={{ opacity: progress }}
      />
      <div
        className="flex-1 h-px bg-gradient-to-l from-white to-transparent transition-opacity duration-300"
        style={{ opacity: progress }}
      />
    </div>
  );
};

const HowSection: React.FC<SectionProps> = ({ id }) => {
  return (
    <section
      id={id}
      className="relative w-full bg-black text-white h-screen flex items-center justify-center px-6 snap-start"
    >
      <div
        className={`container mx-auto text-center space-y-12 ${SECTION_CONTAINER_CLASS}`}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left text-2xl sm:text-3xl md:text-[54px] font-normal leading-[1.3] sm:leading-[1.4] md:leading-[1.3] tracking-normal"
        >
          By building a platform that empowers restaurants to cut food waste,
          protect their bottom line, and have a meaningful, cumulative impact on
          global sustainability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full flex items-center gap-4 py-6"
        >
          <GradientSeparator
            progress={Math.max(0, Math.min(1, (window.scrollY / 1000) % 1))}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-right text-2xl sm:text-3xl md:text-[54px] font-normal leading-[1.3] sm:leading-[1.4] md:leading-[1.3] tracking-normal"
        >
          Our team blends more than a decade of Food and AI experience in a
          packaged solution that lets you focus on creating while we handle the
          rest.
        </motion.p>
      </div>
    </section>
  );
};

export default HowSection;
