"use client";

import type React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedText from "@/components/AnimatedText";
import { GradientSeparator } from "@/components/ui/separator";

const HowSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yFirst = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const ySecond = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const separatorOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative h-dvh snap-start py-20 sm:py-32 md:py-40 flex flex-col justify-center items-center bg-black overflow-hidden"
    >
      <div className="container mx-auto space-y-16 sm:space-y-24 px-4 sm:px-6">
        <motion.div style={{ y: yFirst }} className="relative">
          <AnimatedText
            text="By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability."
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-normal leading-tight sm:leading-[1.3] md:leading-[1.4] tracking-[-0.02em] max-w-full sm:max-w-[95%] md:max-w-[90%]"
          />
        </motion.div>

        <motion.div
          style={{ opacity: separatorOpacity }}
          className="w-full relative bottom-10 md:bottom-14"
        >
          <GradientSeparator
            gradientColors={[
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 0)",
            ]}
            leftThickness={2}
            rightThickness={1}
          />
        </motion.div>

        <motion.div style={{ y: ySecond }} className="relative">
          <AnimatedText
            text="Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest."
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-normal leading-tight sm:leading-[1.3] md:leading-[1.4] tracking-[-0.02em]"
            align="right"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowSection;
