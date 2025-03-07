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
import { mainConfigs } from "@/utils/configs";

export interface HeaderSectionProps {
  id: string;
  image: string;
  nextSectionId?: string; // Pass in the ID of the next section to scroll to
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

  // Track scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth out the progress for better transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.0001,
  });

  // Scale the image up from 1 to 3.5 as user scrolls 0 to ~45% down this section
  const imageScale = useTransform(smoothProgress, [0, 0.45], [1, 3.5]);
  const yMove = useTransform(smoothProgress, [0, 0.45], [0, -120]);

  // Fade out the main content by 35% scroll
  const contentOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);

  // Fade out the nav and next button by 15% scroll
  const uiOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // Background color transitions to transparent by ~40% scroll
  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.4],
    ["rgba(255,255,255,1)", "rgba(255,255,255,0)"]
  );

  // Dark overlay that fades in by ~45–60% scroll
  const overlayOpacity = useTransform(
    smoothProgress,
    [0.15, 0.45, 0.6],
    [0, 0.7, 1]
  );

  // Visibility toggles off at ~60% scroll
  const headerVisibility = useTransform(
    smoothProgress,
    [0, 0.6, 0.61],
    ["visible", "visible", "hidden"]
  );

  // Keep the header on top (zIndex = 20) until ~80% scroll,
  // so the Robot section doesn’t show behind it.
  const headerZIndex = useTransform(
    smoothProgress,
    [0, 0.799, 0.8],
    [20, 20, -1]
  );

  // Scroll to the next section on button click
  const handleNext = useCallback(() => {
    if (nextSectionId) {
      const nextElem = document.getElementById(nextSectionId);
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [nextSectionId]);

  // Disable pointer events after ~60% scroll
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
      className="relative w-full z-50"
      style={{
        height: "180vh",
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
          {/* Image (removed any extra glow layers) */}
          <OptimizedImage src={image} alt="Header Image" />
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="absolute w-full top-4 right-4"
          style={{ opacity: uiOpacity }}
        >
          <div className={`${mainConfigs.SECTION_CONTAINER_CLASS} `}>
            <Nav />
          </div>
        </motion.div>

        {/* Next Button */}
        <motion.div
          className="fixed bottom-12 left-1/2 -translate-x-1/2"
          style={{ opacity: uiOpacity }}
        >
          <NextButton onClick={handleNext} />
        </motion.div>
      </motion.div>

      {/* Dark overlay for transition effect */}
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
