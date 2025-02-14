// views/Home/header-section.tsx
"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useAnimation, type Variants } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import type { SectionProps } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";
import NextButton from "@/components/NextButton";

export interface HeaderSectionProps extends SectionProps {
  onNextSection?: () => void;
  scrollLockControls: { lockScroll: () => void; unlockScroll: () => void };
}

const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt}
    width={480}
    height={480}
    priority
    className="w-full h-auto"
    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
    loading="eager"
  />
));
OptimizedImage.displayName = "OptimizedImage";

const containerVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  zoomed: {
    scale: 1.5,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = memo(
  ({ id, title, image, onNextSection, scrollLockControls }) => {
    const controls = useAnimation();
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
      // Lock scrolling until the animation finishes.
      scrollLockControls.lockScroll();
      controls.start("zoomed").then(() => {
        setAnimationComplete(true);
        scrollLockControls.unlockScroll();
      });
      return () => {
        scrollLockControls.unlockScroll();
      };
    }, [controls, scrollLockControls]);

    const handleNextSection = useCallback(() => {
      onNextSection?.();
    }, [onNextSection]);

    return (
      <section
        id={id}
        className="relative min-h-[200vh] w-full overflow-hidden flex flex-col bg-white"
        style={{ perspective: "1000px", scrollSnapAlign: "start" }}
      >
        <div
          className={`${mainConfigs.SECTION_CONTAINER_CLASS} absolute top-0 left-0 right-0 z-40`}
        >
          <Nav />
        </div>
        <div className="relative h-dvh flex flex-col items-center justify-center">
          {/* Center the image inside an absolute container */}
          <motion.div
            initial="initial"
            animate={controls}
            variants={containerVariants}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full max-w-[480px]">
              <OptimizedImage
                src={image || "/placeholder.svg"}
                alt={title || ""}
              />
            </div>
          </motion.div>
          {animationComplete && (
            <motion.button
              onClick={handleNextSection}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              aria-label="Scroll down"
            >
              <NextButton />
            </motion.button>
          )}
        </div>
      </section>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
