import { motion } from "framer-motion";
import type { SectionProps } from "@/utils/types/section";
import { ANIMATION_CONFIG } from "@/lib/constants";

interface AnimatedSectionProps extends SectionProps {
  isActive: boolean;
  index: number;
  currentSection: number;
  observerRef?: React.RefObject<HTMLElement>;
}

export const AnimatedSection: React.FC<
  React.PropsWithChildren<AnimatedSectionProps>
> = ({ isActive, index, currentSection, observerRef, children }) => {
  return (
    <motion.section
      ref={observerRef}
      className="section"
      data-section-index={index}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.8,
        y: `${(index - currentSection) * 100}%`,
      }}
      transition={{
        opacity: { duration: ANIMATION_CONFIG.transitionDuration * 0.5 },
        scale: { duration: ANIMATION_CONFIG.transitionDuration * 0.5 },
        y: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: ANIMATION_CONFIG.transitionDuration,
        },
      }}
    >
      {children}
    </motion.section>
  );
};
