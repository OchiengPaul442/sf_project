"use client";

import React, { memo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { useWindowSize } from "@/hooks/useWindowSize";
import NextButton from "@/components/NextButton";
import { mainConfigs } from "@/utils/configs";

export interface HeaderSectionProps {
  image: string; // URL of the image to display
  title?: string; // Alt text for the image
  onNextSection?: () => void;
  onScrollProgress?: (progress: number) => void;
}

// Custom OptimizedImage component using Next.js Image.
const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt || ""}
    width={480}
    height={480}
    priority
    className="w-full h-auto"
    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
    loading="eager"
  />
));
OptimizedImage.displayName = "OptimizedImage";

// Floating effect variants (applied only on non‑mobile devices).
const floatingVariants: Variants = {
  float: {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  image,
  title,
  onNextSection,
  onScrollProgress,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const controls = useAnimation();

  // Monitor scroll progress for the section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Thresholds and mapping ranges.
  const SCALE_START = 0.1;
  const SCALE_PEAK = 0.5;
  const FADE_START = 0.6;
  const FADE_END = 0.8; // When the image is fully faded.
  const TRANSITION_TRIGGER = FADE_END; // Trigger onNextSection when faded.
  const progressRange = [0, SCALE_START, SCALE_PEAK, FADE_START, FADE_END, 1];

  // Desktop transform arrays (used on both mobile and desktop now).
  const imageScaleDesktop: number[] = [0.6, 1, 2.8, 3.5, 4.0, 4.2];
  const xMoveDesktop: number[] = [0, -2, -4, -6, -8, -10];
  const yMoveDesktop: number[] = [0, -1, -2, -3, -4, -5];

  // Transforms based on scroll progress.
  const desktopImageScale = useTransform(
    scrollYProgress,
    progressRange,
    imageScaleDesktop
  );
  const desktopXMove = useTransform(
    scrollYProgress,
    progressRange,
    xMoveDesktop
  );
  const desktopYMove = useTransform(
    scrollYProgress,
    progressRange,
    yMoveDesktop
  );
  const desktopImageOpacity = useTransform(
    scrollYProgress,
    [0.4, FADE_START, FADE_END],
    [1, 1, 0],
    { clamp: true }
  );

  // Use the desktop transforms for all devices.
  const imageScale: MotionValue<number> = desktopImageScale;
  const xMove: MotionValue<number> = desktopXMove;
  const yMove: MotionValue<number> = desktopYMove;
  const imageOpacity: MotionValue<number> = desktopImageOpacity;

  // Navigation opacity remains the same.
  const navOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3],
    [1, 0.7, 0]
  );

  // Background color transition.
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["#ffffff", "#000000", "#000000"]
  );

  // Next button opacity.
  const nextButtonOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, FADE_END, 1],
    [1, 0.3, 0]
  );

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (onScrollProgress) onScrollProgress(value);
      // When the image has faded, trigger next section.
      if (value >= TRANSITION_TRIGGER && onNextSection) onNextSection();
    });
    return () => unsubscribe();
  }, [scrollYProgress, onScrollProgress, onNextSection, TRANSITION_TRIGGER]);

  const handleNextSection = () => {
    onNextSection?.();
  };

  return (
    <motion.section
      ref={sectionRef}
      id="header-section"
      style={{ backgroundColor }}
      className={`relative ${isMobile ? "h-dvh" : "h-[450vh]"} overflow-hidden`}
    >
      <div
        className={`sticky top-0 h-screen ${mainConfigs.SECTION_CONTAINER_CLASS}`}
      >
        {/* Navigation */}
        <motion.div
          style={{ opacity: navOpacity }}
          className="absolute top-4 right-4 z-40"
        >
          <Nav />
        </motion.div>

        {/* Next Button */}
        <motion.div
          style={{ opacity: nextButtonOpacity }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40"
        >
          <NextButton onClick={handleNextSection} />
        </motion.div>

        {/* Centered Image with Floating and Transform effects */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-40">
          <motion.div
            style={{
              scale: imageScale,
              opacity: imageOpacity,
              x: xMove,
              y: yMove,
            }}
            className={`mx-auto ${
              isMobile ? "max-w-[200px]" : "max-w-[400px]"
            }`}
            // Apply floating only on desktop.
            variants={!isMobile ? floatingVariants : undefined}
            animate={!isMobile ? "float" : undefined}
          >
            <OptimizedImage src={image} alt={title || "Header Image"} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
