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
import { mainConfigs } from "@/utils/configs";

// Optimized image component that prioritizes performance.
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

// Entrance animation for the main image container.
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 700, damping: 35, duration: 0.3 },
  },
};

// Floating animation for desktop devices.
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

const HeaderSection: React.FC<SectionProps> = memo(({ id, title, image }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = isMobileDevice();
  const controls = useAnimation();

  // Use Framer Motion's scroll hook to map scroll progress to animation values.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Define ranges for the transformation values.
  const scaleRange = isMobile ? [1, 1.8, 1.8] : [1, 2, 2];
  const translateRange = isMobile ? [0, -60, -60] : [0, -120, -120];
  const rotateRange = isMobile ? [0, 3, 3] : [0, 5, 5];

  // Map scroll progress to image transformations.
  const imageScale = useTransform(scrollYProgress, [0, 0.6, 1], scaleRange, {
    clamp: true,
  });
  const imageTranslateY = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    translateRange,
    { clamp: true }
  );
  const imageRotate = useTransform(scrollYProgress, [0, 0.6, 1], rotateRange, {
    clamp: true,
  });

  // Fade out the image smoothly after 60% scroll progress.
  const imageOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0], {
    clamp: true,
  });

  // Gradient overlay opacity values for a smooth, futuristic feel.
  const topGradientOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1], {
    clamp: true,
  });
  const bottomGradientOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.6],
    [0, 1],
    { clamp: true }
  );

  // Start the entrance animation.
  useEffect(() => {
    controls.start("visible");
    return () => controls.stop();
  }, [controls]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative min-h-[120vh] w-full overflow-hidden flex flex-col bg-white will-change-transform"
      style={{ perspective: "1000px", scrollSnapAlign: "start" }}
    >
      {/* Top Gradient Overlay */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent will-change-opacity"
        style={{ opacity: topGradientOpacity }}
      />

      {/* Bottom Gradient Overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[120vh] z-20 pointer-events-none bg-gradient-to-t from-black via-black to-transparent will-change-opacity"
        style={{ opacity: bottomGradientOpacity }}
      />

      {/* Navigation Bar */}
      <div
        className={`${mainConfigs.SECTION_CONTAINER_CLASS} absolute top-0 left-0 right-0 z-40`}
      >
        <Nav />
      </div>

      {/* Main Image Container */}
      <div
        className={`${mainConfigs.SECTION_CONTAINER_CLASS} relative flex-grow flex items-center justify-center`}
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
          {/* Blurred backdrop for desktop devices */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-full"
              aria-hidden="true"
            />
          )}

          {/* The SVG image with optional floating animation (desktop only) */}
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
    </section>
  );
});

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
