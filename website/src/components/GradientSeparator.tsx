import React from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";

interface GradientSeparatorProps {
  progress: number;
}

export const GradientSeparator: React.FC<GradientSeparatorProps> = ({
  progress,
}) => {
  const motionProgress = useMotionValue(progress);
  const rotateY = useTransform(motionProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(motionProgress, [0, 0.5, 1], [0, 15, 0]);
  const scale = useTransform(motionProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const translateZ = useTransform(motionProgress, [0, 0.5, 1], [0, 20, 0]);

  React.useEffect(() => {
    motionProgress.set(progress);
  }, [progress, motionProgress]);

  return (
    <div className="relative w-full py-12 perspective-[1000px] overflow-hidden">
      {/* Background line (low opacity) */}
      <div className="absolute w-full top-1/2 -translate-y-1/2">
        <div className="w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      {/* Animated line that reveals and transforms based on progress */}
      <motion.div
        className="w-full h-[1px] bg-gradient-to-r from-white to-transparent"
        style={{
          opacity: motionProgress,
          rotateY,
          rotateX,
          scale,
          translateZ,
          transformOrigin: "center center",
        }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
          duration: 0.5,
        }}
      >
        {/* Add a subtle glow effect */}
        <div className="absolute inset-0 bg-white/30 blur-sm" />
      </motion.div>
    </div>
  );
};
