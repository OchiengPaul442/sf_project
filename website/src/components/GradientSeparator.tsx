import React from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

interface GradientSeparatorProps {
  progress: number;
}

export const GradientSeparator: React.FC<GradientSeparatorProps> = ({
  progress,
}) => {
  // Use spring for smoother animation
  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const smoothProgress = useSpring(useMotionValue(progress), springConfig);

  // Transform values with spring for smoother transitions
  const rotateY = useTransform(smoothProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [0, 15, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  // Update progress smoothly
  React.useEffect(() => {
    smoothProgress.set(progress);
  }, [progress, smoothProgress]);

  return (
    <div className="relative w-full h-32 flex items-center justify-center perspective-[2000px] overflow-hidden">
      <motion.div
        className="w-full max-w-[90%] relative"
        style={{
          rotateY,
          rotateX,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main gradient line */}
        <div className="relative h-[2px] w-full">
          {/* Gradient line */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-transparent" />

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent blur-[2px] transform -translate-y-[1px]" />
        </div>
      </motion.div>
    </div>
  );
};
