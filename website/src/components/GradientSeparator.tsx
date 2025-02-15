import type React from "react";
import { motion } from "framer-motion";

interface GradientSeparatorProps {
  progress: number;
}

export const GradientSeparator: React.FC<GradientSeparatorProps> = ({
  progress,
}) => {
  return (
    <div className="relative w-full h-[2px]">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white via-white to-transparent"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent blur-[2px] transform -translate-y-[1px]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
};
