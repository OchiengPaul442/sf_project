"use client";

import React, { memo, useRef, useCallback, useEffect, useState } from "react";
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
import { mainConfigs } from "@/utils/configs";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface HeaderSectionProps {
  id: string;
  image: string;
  nextSectionId?: string;
}

// Optimize image rendering with proper memoization
const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt || ""}
    width={400}
    height={300}
    priority
    className="w-full h-auto"
    sizes="(max-width: 768px) 60vw, 400px" // Reduced size for mobile
    loading="eager"
    placeholder="blur"
    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  />
));
OptimizedImage.displayName = "OptimizedImage";

// Simplified floating animation for better performance
const floatingVariants: Variants = {
  float: {
    y: [-5, 5], // Reduced movement range
    transition: {
      duration: 3, // Slower animation
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
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);

  // Simplified dimensions and transform ranges
  const sectionHeight = isMobile ? "120dvh" : "160vh"; // Reduced height
  const imageScaleRange = isMobile ? [0.7, 2.0] : [1, 2.8]; // Less extreme scaling
  const yMoveRange = isMobile ? [0, -40] : [0, -80]; // Reduced movement

  // Setup scroll progress with reduced computation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // More gentle spring physics for smoother animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50, // Further reduced stiffness
    damping: 30, // Increased damping
    restDelta: 0.001, // Less precise to improve performance
  });

  // Simplified transform calculations with fewer breakpoints
  const imageScale = useTransform(smoothProgress, [0, 0.5], imageScaleRange);
  const yMove = useTransform(smoothProgress, [0, 0.5], yMoveRange);
  const contentOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const uiOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.45],
    ["rgba(255,255,255,1)", "rgba(0,0,0,0)"]
  );
  const overlayOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 0.8]);

  // Simplified handling of section visibility
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest) => {
      // Update visibility state based on scroll position
      setIsVisible(latest <= 0.6);

      // Update pointer events only when necessary
      if (headerContentRef.current) {
        headerContentRef.current.style.pointerEvents =
          latest > 0.5 ? "none" : "auto";
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Handle navigation to next section - using manual button only
  const handleNext = useCallback(() => {
    if (nextSectionId) {
      const nextElem = document.getElementById(nextSectionId);
      if (nextElem) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          nextElem.scrollIntoView({
            behavior: isMobile ? "auto" : "smooth", // Use auto on mobile for performance
            block: "start",
          });
        });
      }
    }
  }, [nextSectionId, isMobile]);

  // Dynamic class for image container based on device
  const imageContainerClass = isMobile
    ? "w-[250px] mx-auto relative" // Smaller on mobile
    : "w-[350px] mx-auto relative"; // Smaller on desktop

  // If section is not visible, don't render heavy content
  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className="relative w-full"
      style={{
        height: sectionHeight,
        backgroundColor,
        zIndex: isVisible ? 20 : -1,
        overflow: "hidden", // Prevent content from causing scrollbars
      }}
    >
      {isVisible && (
        <motion.div
          ref={headerContentRef}
          className="fixed inset-0 w-full h-screen flex items-center justify-center"
          style={{
            opacity: contentOpacity,
            willChange: "transform, opacity",
          }}
        >
          <motion.div
            className={imageContainerClass}
            style={{
              scale: imageScale,
              y: yMove,
              willChange: "transform",
              // Apply hardware acceleration
              translateZ: 0,
            }}
            // Only apply floating animation on non-mobile devices
            {...(!isMobile && { variants: floatingVariants, animate: "float" })}
          >
            <OptimizedImage src={image} alt="Header Image" />
          </motion.div>

          <motion.div
            className="absolute w-full top-4 right-4"
            style={{ opacity: uiOpacity }}
          >
            <div className={`${mainConfigs.SECTION_CONTAINER_CLASS}`}>
              <Nav />
            </div>
          </motion.div>

          <motion.div
            className="fixed bottom-12 left-1/2 -translate-x-1/2"
            style={{ opacity: uiOpacity }}
          >
            <NextButton onClick={handleNext} />
          </motion.div>
        </motion.div>
      )}

      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{
            opacity: overlayOpacity,
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, black 80%)",
            zIndex: -1,
          }}
        />
      )}
    </motion.section>
  );
};

HeaderSection.displayName = "HeaderSection";
export default memo(HeaderSection);
