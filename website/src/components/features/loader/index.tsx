"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

const outerRingVariants = {
  animate: {
    rotate: 360,
    scale: [1, 1.05, 1],
  },
};

const outerRingTransition = (delay: number) => ({
  duration: 8,
  repeat: Infinity,
  ease: "linear",
  delay,
});

const pulseVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: [0.5, 1.5], opacity: [0.7, 0] },
};

const pulseTransition = (delay: number) => ({
  duration: 2,
  repeat: Infinity,
  delay,
  ease: "easeOut",
});

const centerCircleVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 0.8, 0.6],
  },
};

const centerCircleTransition = {
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut",
};

const leafVariants = {
  animate: {
    rotate: 360,
    scale: [1, 1.2, 1],
  },
};

const leafTransition = {
  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
  scale: {
    duration: 2,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  },
};

const SavingFoodLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ willChange: "opacity, transform" }}
    >
      <div className="relative w-40 h-40">
        {/* Outer rotating rings */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "absolute inset-0 rounded-full border-2",
              "border-green-400/30"
            )}
            style={{
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)",
              willChange: "transform, opacity",
            }}
            variants={outerRingVariants}
            animate="animate"
            transition={outerRingTransition(index * 0.5)}
          />
        ))}

        {/* Pulsing circles */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`pulse-${index}`}
            className="absolute inset-0 m-auto rounded-full bg-green-500/20"
            style={{
              width: "calc(100% - 16px)",
              height: "calc(100% - 16px)",
              willChange: "transform, opacity",
            }}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            transition={pulseTransition(index * 0.6)}
          />
        ))}

        {/* Center circle */}
        <motion.div
          className="absolute inset-0 m-auto rounded-full w-28 h-28"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(22,163,74,0.2) 50%, transparent 100%)",
            willChange: "transform, opacity",
          }}
          variants={centerCircleVariants}
          animate="animate"
          transition={centerCircleTransition}
        />

        {/* Rotating leaf icon */}
        <motion.div
          className="absolute inset-0 m-auto w-10 h-10 z-10"
          style={{ willChange: "transform" }}
          variants={leafVariants}
          animate="animate"
          transition={leafTransition}
        >
          <Leaf className="w-full h-full text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
        </motion.div>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        Loading SavingFood.ai, please wait...
      </div>
    </div>
  );
};

export default SavingFoodLoader;
