"use client";

import { GradientSeparator } from "@/components/ui/separator";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import React, { useRef, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  className: string;
  align?: "left" | "right";
}

const AnimatedText = ({
  text,
  className,
  align = "left",
}: AnimatedTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const words = text.split(" ");

  // Reset animation when section leaves viewport
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
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block mr-[0.4em]"
          variants={wordVariants}
          style={{
            display: "inline-block",
            textAlign: align,
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const HowSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isEntirelyInView = useInView(sectionRef, { amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smoother parallax effect
  const yFirst = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const ySecond = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Force re-render of animations when section comes into view
  useEffect(() => {
    if (isEntirelyInView) {
      const timer = setTimeout(() => {
        sectionRef.current?.style.setProperty("opacity", "1");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEntirelyInView]);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative min-h-screen py-40 flex justify-center items-center bg-black overflow-hidden snap-start"
    >
      <div className="container mx-auto space-y-32 px-6">
        <motion.div style={{ y: yFirst }}>
          <AnimatedText
            text="By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability."
            className="text-white text-[2.75rem] md:text-[3.25rem] font-normal leading-[1.4] tracking-[-0.02em] max-w-[90%]"
          />
        </motion.div>

        <GradientSeparator />

        <motion.div style={{ y: ySecond }}>
          <AnimatedText
            text="Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest."
            className="text-white text-[2.75rem] md:text-[3.25rem] font-normal leading-[1.4] tracking-[-0.02em]"
            align="right"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowSection;
