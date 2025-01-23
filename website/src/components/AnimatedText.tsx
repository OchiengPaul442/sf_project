// components/ui/AnimatedText.tsx
"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  className: string;
  align?: "left" | "right" | "center";
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  align = "left",
}) => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
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

export default AnimatedText;
