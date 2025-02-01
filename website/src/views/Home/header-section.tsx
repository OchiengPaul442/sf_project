"use client";

import React, { memo, useRef, useEffect, useState } from "react";
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
  />
));
OptimizedImage.displayName = "OptimizedImage";

// Entrance animation variant for the image container.
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30, duration: 0.4 },
  },
};

// Floating variant for a subtle bobbing effect (only on non-mobile devices).
const floatingVariants: Variants = {
  float: {
    y: [-8, 8],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  id,
  title,
  image,
  onNextSection,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const controls = useAnimation();

  // Monitor the scroll progress within this section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* 
    Advanced Zoom Effect:
    - imageScale: Dramatically scales from 1× to 2.5× at mid-scroll then settles at ~2.2×.
    - imageTranslateY: Moves upward to enhance the 3D pop.
    - imageRotate: Adds a slight rotation for extra depth.
    - imageOpacity: Remains fully visible until 70% of scroll progress then fades out.
  */
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 2.5, 2.2]);
  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const imageOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);

  // Gradient overlays for smooth visual transition.
  const gradientLayer1 = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const bottomGradient = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  // Check for mobile devices.
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(isMobileDevice());
    checkIsMobile();
    const handleResize = () => checkIsMobile();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start the entrance animation.
  useEffect(() => {
    controls.start("visible");
    return () => controls.stop();
  }, [controls]);

  return (
    <section
      ref={sectionRef}
      id={id}
      // Extended scroll area with a perspective for enhanced depth.
      className="relative min-h-[150vh] w-full overflow-hidden flex flex-col justify-start bg-white"
      style={{ perspective: "1500px" }}
    >
      {/* Gradient overlays */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent"
        style={{ opacity: gradientLayer1 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[150vh] z-20 pointer-events-none bg-gradient-to-t from-black via-black to-transparent"
        style={{ opacity: bottomGradient }}
      />

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-40">
        <Nav />
      </div>

      {/* Image container pushed upward (via translateY) so it’s in view on first glance. */}
      <div
        className={`relative flex-grow flex items-center justify-center ${mainConfigs.SECTION_CONTAINER_CLASS}`}
        style={{ transform: "translateY(-10%)" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] flex items-center justify-center"
          style={{
            scale: imageScale,
            translateY: imageTranslateY,
            rotate: imageRotate,
            opacity: imageOpacity,
            transformStyle: "preserve-3d",
          }}
        >
          {/* A subtle blurred overlay on desktop for a futuristic look */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
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
      </div>

      {/* Fixed NextButton so it's always visible at the bottom of the viewport */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-auto">
        <NextButton onClick={onNextSection} />
      </div>
    </section>
  );
};

HeaderSection.displayName = "HeaderSection";
export default memo(HeaderSection);
