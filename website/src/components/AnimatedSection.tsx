import { forwardRef, type ForwardedRef } from "react";
import { motion } from "framer-motion";
import type { SectionProps } from "@/utils/types/section";
import { ANIMATION_CONFIG } from "@/lib/constants";

interface AnimatedSectionProps extends SectionProps {
  isActive: boolean;
  index: number;
  currentSection: number;
}

export const AnimatedSection = forwardRef<
  HTMLElement,
  React.PropsWithChildren<AnimatedSectionProps>
>(
  (
    { id, title, index, currentSection, children },
    ref: ForwardedRef<HTMLElement>
  ) => {
    const variants = {
      hidden: (custom: number) => ({
        opacity: 0,
        y: `${(custom - currentSection) * 100}%`,
      }),
      visible: (custom: number) => ({
        opacity: 1,
        y: `${(custom - currentSection) * 100}%`,
        transition: {
          opacity: { duration: ANIMATION_CONFIG.transitionDuration * 0.5 },
          y: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: ANIMATION_CONFIG.transitionDuration,
          },
        },
      }),
    };

    return (
      <motion.section
        ref={ref}
        id={id}
        className="section"
        aria-label={title}
        initial="hidden"
        animate="visible"
        variants={variants}
        custom={index}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
        }}
      >
        {children}
      </motion.section>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";
