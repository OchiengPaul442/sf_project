"use client";

import { GradientSeparator } from "@/components/ui/separator";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import React, { useRef, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedTextProps {
  text: string;
  className: string;
  align?: "left" | "right" | "center";
}

const AnimatedText = ({
  text,
  className,
  align = "left",
}: AnimatedTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const words = text.split(" ");

  useEffect(() => {
    if (!isInView) {
      ref.current?.style.setProperty("opacity", "0");
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`${className} ${
        align === "center"
          ? "text-center"
          : align === "right"
          ? "text-right"
          : "text-left"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block mr-[0.4em] last:mr-0"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const HowSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const isEntirelyInView = useInView(sectionRef, { amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yFirst = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const ySecond = useTransform(scrollYProgress, [0, 1], [0, -30]);

  useEffect(() => {
    if (isEntirelyInView) {
      const timer = setTimeout(() => {
        sectionRef.current?.style.setProperty("opacity", "1");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEntirelyInView, sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className={`relative min-h-screen py-20 sm:py-32 md:py-40 flex justify-center items-center bg-black overflow-hidden snap-start transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto space-y-16 sm:space-y-24 md:space-y-32 px-4 sm:px-6">
        <motion.div style={{ y: yFirst }} className="relative">
          <AnimatedText
            text="By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability."
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-normal leading-tight sm:leading-[1.3] md:leading-[1.4] tracking-[-0.02em] max-w-full sm:max-w-[95%] md:max-w-[90%]"
          />
        </motion.div>

        <GradientSeparator className="w-full" />

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
