"use client";

import React, { memo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { SectionProps } from "@/utils/types/section";
import NextButton from "@/components/NextButton";
import { mainConfigs } from "@/utils/configs";

interface HeaderSectionProps extends SectionProps {
  onNextSection: () => void;
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

// Snappy entrance animation.
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 700,
      damping: 35,
      duration: 0.3,
    },
  },
};

// Subtle floating effect on larger screens.
const floatingVariants: Variants = {
  float: {
    y: [-6, 6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = memo(
  ({ id, title, image, onNextSection }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const isMobile = isMobileDevice();
    const controls = useAnimation();

    // Track scroll progress within this (shorter) section.
    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start start", "end start"],
    });

    /*
      Compressed Animation Range:
      We apply most of the transform changes up to ~60% scroll, then keep values steady.
      This ensures the animation completes sooner, so the user can quickly transition.
    */
    const scaleRange = isMobile ? [1, 1.8, 1.8] : [1, 2, 2];
    const translateRange = isMobile ? [0, -60, -60] : [0, -120, -120];
    const rotateRange = isMobile ? [0, 3, 3] : [0, 5, 5];

    const imageScale = useTransform(scrollYProgress, [0, 0.6, 1], scaleRange, {
      clamp: true,
    });
    const imageTranslateY = useTransform(
      scrollYProgress,
      [0, 0.6, 1],
      translateRange,
      { clamp: true }
    );
    const imageRotate = useTransform(
      scrollYProgress,
      [0, 0.6, 1],
      rotateRange,
      {
        clamp: true,
      }
    );

    // Fade out between 60% and 100%.
    const imageOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0], {
      clamp: true,
    });

    // Adjust gradient overlays more tightly.
    const gradientLayer1 = useTransform(scrollYProgress, [0, 0.3], [0, 1], {
      clamp: true,
    });
    const bottomGradient = useTransform(scrollYProgress, [0.2, 0.6], [0, 1], {
      clamp: true,
    });

    useEffect(() => {
      controls.start("visible");
      return () => controls.stop();
    }, [controls]);

    // Smoothly scroll to the next section when NextButton is clicked.
    const handleNextSection = () => {
      onNextSection?.();
    };

    return (
      <section
        ref={sectionRef}
        id={id}
        className="relative min-h-[120vh] w-full overflow-hidden flex flex-col justify-start bg-white will-change-transform"
        style={{
          perspective: "1000px",
          scrollSnapAlign: "start",
        }}
      >
        {/* Gradient overlays */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent will-change-opacity"
          style={{ opacity: gradientLayer1 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[120vh] z-20 pointer-events-none bg-gradient-to-t from-black via-black to-transparent will-change-opacity"
          style={{ opacity: bottomGradient }}
        />

        {/* Navigation at the top */}
        <div
          className={` ${mainConfigs.SECTION_CONTAINER_CLASS} absolute top-0 left-0 right-0 z-40`}
        >
          <Nav />
        </div>

        {/* Main image container, slightly shifted upward */}
        <div
          className={`relative flex-grow flex items-center justify-center ${mainConfigs.SECTION_CONTAINER_CLASS}`}
          style={{ transform: "translateY(-5%)" }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] flex items-center justify-center will-change-transform"
            style={{
              scale: imageScale,
              translateY: imageTranslateY,
              rotate: imageRotate,
              opacity: imageOpacity,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Slightly blurred backdrop on desktop */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-full"
                aria-hidden="true"
              />
            )}

            {/* Floating motion only on non-mobile */}
            <motion.div
              variants={!isMobile ? floatingVariants : undefined}
              animate={!isMobile ? "float" : undefined}
              className="relative z-10"
            >
              <OptimizedImage
                src={image || "/placeholder.svg"}
                alt={title || ""}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Next button to scroll to the next section */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-auto">
          <NextButton onClick={handleNextSection} />
        </div>
      </section>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
