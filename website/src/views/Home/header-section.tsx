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

// Optimized image component.
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

// Entrance animation for the image container.
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

  // Using a larger scrollable area for a more pronounced zoom effect.
  // For example, using 150vh ensures more scroll space.
  // Adjust your CSS min-height value to control the scroll area.
  const extendedMinHeight = "min-h-[150vh]";

  // Track scroll progress within this section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Define transformation ranges.
  // More pronounced effect on desktop devices.
  const scaleRange = isMobile ? [1, 2, 2] : [1, 2.5, 2.5];
  const translateRange = isMobile ? [0, -90, -90] : [0, -150, -150];
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

  // Fade out the image smoothly near the end of the scroll.
  const imageOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0], {
    clamp: true,
  });

  // Top gradient overlay opacity.
  const topGradientOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1], {
    clamp: true,
  });

  // Bottom gradient now transitions from transparent (white background)
  // to opaque black to match the next section's background.
  const bottomGradientOpacity = useTransform(
    scrollYProgress,
    [0.5, 1],
    [0, 1],
    { clamp: true }
  );

  useEffect(() => {
    controls.start("visible");
    return () => controls.stop();
  }, [controls]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative ${extendedMinHeight} w-full overflow-hidden flex flex-col bg-white will-change-transform`}
      style={{ perspective: "1000px", scrollSnapAlign: "start" }}
    >
      {/* Top Gradient Overlay */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent will-change-opacity"
        style={{ opacity: topGradientOpacity }}
      />

      {/* Bottom Gradient Overlay for seamless transition to black */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-full z-20 pointer-events-none bg-gradient-to-b from-transparent to-black will-change-opacity"
        style={{ opacity: bottomGradientOpacity }}
      />

      {/* Navigation */}
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
          {/* Blurred backdrop on desktop */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-full"
              aria-hidden="true"
            />
          )}

          {/* The SVG image with optional floating animation on desktop */}
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
