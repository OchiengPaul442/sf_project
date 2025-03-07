"use client";

import React, { memo, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import NextButton from "@/components/NextButton";

export interface HeaderSectionProps {
  id: string;
  image: string;
  nextSectionId?: string;
}

const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt || ""}
    width={400}
    height={300}
    priority
    className="w-full h-auto"
    sizes="(max-width: 768px) 80vw, 400px"
    loading="eager"
  />
));
OptimizedImage.displayName = "OptimizedImage";

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
  id,
  image,
  nextSectionId,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerContentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smoother spring for better transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.0001,
  });

  // Adjusted image animations for a smoother transition to robot section
  // Scale from 1 to 3.5 more gradually with faster upward movement
  const imageScale = useTransform(smoothProgress, [0, 0.45], [1, 3.5]);
  const yMove = useTransform(smoothProgress, [0, 0.45], [0, -120]);

  // Content fades out more gradually but completes earlier
  const contentOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);

  // UI elements (nav and button) fade out faster to clear space for transition
  const uiOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // Background color fades from white to transparent to blend with robot section
  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.4],
    ["rgba(255,255,255,1)", "rgba(255,255,255,0)"]
  );

  // Create a black overlay that fades in to match the robot section background
  const overlayOpacity = useTransform(
    smoothProgress,
    [0.15, 0.45, 0.6],
    [0, 0.7, 1]
  );

  // New: Display property for hiding the content after transition
  const headerVisibility = useTransform(
    smoothProgress,
    [0, 0.6, 0.61],
    ["visible", "visible", "hidden"]
  );

  // New: Z-index transition to ensure content is behind other sections
  const headerZIndex = useTransform(
    smoothProgress,
    [0, 0.5, 0.51],
    [10, 10, -1]
  );

  // Scroll to the next section on click
  const handleNext = useCallback(() => {
    if (nextSectionId) {
      const nextElem = document.getElementById(nextSectionId);
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [nextSectionId]);

  // Monitor progress value and apply display:none when fully transitioned
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest) => {
      if (headerContentRef.current && latest > 0.6) {
        headerContentRef.current.style.pointerEvents = "none";
      } else if (headerContentRef.current) {
        headerContentRef.current.style.pointerEvents = "auto";
      }
    });

    return () => unsubscribe();
  }, [smoothProgress]);

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className="relative w-full"
      style={{
        height: "180vh", // Reduced from 200vh for quicker transition
        backgroundColor,
        zIndex: headerZIndex,
      }}
    >
      {/* Header content */}
      <motion.div
        ref={headerContentRef}
        className="fixed inset-0 w-full h-screen flex items-center justify-center"
        style={{
          opacity: contentOpacity,
          visibility: headerVisibility,
          willChange: "transform, opacity, visibility",
        }}
      >
        <motion.div
          className="w-[400px] mx-auto relative"
          style={{
            scale: imageScale,
            y: yMove,
            willChange: "transform, opacity",
          }}
          variants={floatingVariants}
          animate="float"
        >
          {/* Add subtle glow effect to image */}
          <div className="absolute inset-0 blur-lg opacity-30 bg-blue-400 rounded-full transform scale-75 -z-10" />
          <OptimizedImage src={image} alt="Header Image" />
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="absolute top-4 right-4"
          style={{ opacity: uiOpacity }}
        >
          <Nav />
        </motion.div>

        {/* Next Button */}
        <motion.div
          className="fixed bottom-12 left-1/2 -translate-x-1/2"
          style={{ opacity: uiOpacity }}
        >
          <NextButton onClick={handleNext} />
        </motion.div>
      </motion.div>

      {/* Enhanced overlay with gradient for more futuristic feel */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: overlayOpacity,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, black 70%)",
          visibility: headerVisibility,
          zIndex: -1,
        }}
      />
    </motion.section>
  );
};

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
