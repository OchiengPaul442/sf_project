"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

const SavingFoodLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
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
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: index * 0.5,
            }}
          />
        ))}

        {/* Pulsing circles */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`pulse-${index}`}
            className="absolute inset-0 m-auto rounded-full bg-green-500/20"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.5],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.6,
              ease: "easeOut",
            }}
            style={{
              width: "calc(100% - 16px)",
              height: "calc(100% - 16px)",
            }}
          />
        ))}

        {/* Center circle */}
        <motion.div
          className={cn(
            "absolute inset-0 m-auto rounded-full",
            "w-28 h-28",
            "bg-gradient-radial from-green-500/40 via-green-400/20 to-transparent"
          )}
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(22,163,74,0.2) 50%, transparent 100%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Rotating leaf icon */}
        <motion.div
          className="absolute inset-0 m-auto w-10 h-10 z-10"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
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
