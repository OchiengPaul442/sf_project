"use client";

// Previous imports remain the same
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
import { mainConfigs } from "@/utils/configs";
import NextButton from "@/components/NextButton";

// Previous components remain unchanged
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

// Animation variants remain unchanged
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 700, damping: 35, duration: 0.3 },
  },
};

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

const HeaderSection: React.FC<SectionProps> = memo(
  ({ id, title, image, onNextSection }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const isMobile = isMobileDevice();
    const controls = useAnimation();
    const extendedMinHeight = "min-h-[200vh]";

    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start start", "end start"],
    });

    // Previous transforms remain unchanged
    const scaleRange = isMobile ? [1, 2.5, 2.5] : [1, 3, 3];
    const translateRange = isMobile ? [0, -120, -120] : [0, -200, -200];
    const rotateRange = isMobile ? [0, 4, 4] : [0, 6, 6];

    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], scaleRange, {
      clamp: true,
    });
    const imageTranslateY = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      translateRange,
      { clamp: true }
    );
    const imageRotate = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      rotateRange,
      {
        clamp: true,
      }
    );
    const imageOpacity = useTransform(scrollYProgress, [0.4, 0.8], [1, 0], {
      clamp: true,
    });

    // Gradient controls remain unchanged
    const topGradientOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1], {
      clamp: true,
    });
    const bottomGradientOpacity = useTransform(
      scrollYProgress,
      [0.4, 0.8],
      [0, 1],
      { clamp: true }
    );

    // New scroll indicator opacity control - fades out quickly on scroll
    const scrollIndicatorOpacity = useTransform(
      scrollYProgress,
      [0, 0.1], // Shorter range for quicker fadeout
      [1, 0],
      { clamp: true }
    );

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
        className={`relative ${extendedMinHeight} w-full overflow-hidden flex flex-col bg-white will-change-transform`}
        style={{ perspective: "1000px", scrollSnapAlign: "start" }}
      >
        {/* Gradients remain unchanged */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent will-change-opacity"
          style={{ opacity: topGradientOpacity }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full z-20 pointer-events-none bg-gradient-to-b from-transparent via-black/80 to-black will-change-opacity"
          style={{ opacity: bottomGradientOpacity }}
        />

        <div
          className={`${mainConfigs.SECTION_CONTAINER_CLASS} absolute top-0 left-0 right-0 z-40`}
        >
          <Nav />
        </div>

        <div className="h-dvh relative flex flex-col items-center justify-center">
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
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-full"
                aria-hidden="true"
              />
            )}

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

          {/* Updated Scroll Indicator with opacity control */}
          <motion.button
            onClick={handleNextSection}
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            aria-label="Scroll down"
          >
            <NextButton />
          </motion.button>
        </div>
      </section>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
