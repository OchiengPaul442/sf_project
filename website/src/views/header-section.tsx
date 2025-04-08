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

// Optimized image component
const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt || "Header visual"}
    width={400}
    height={300}
    priority
    className="w-full h-auto"
    sizes="(max-width: 768px) 250px, 350px"
    loading="eager"
    placeholder="blur"
    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  />
));
OptimizedImage.displayName = "OptimizedImage";

// Simplified floating animation
const floatingVariants: Variants = {
  float: {
    y: [-3, 3],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = memo(
  ({ id, image, nextSectionId }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const headerContentRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [isVisible, setIsVisible] = useState(true);

    // Simplified dimensions
    const sectionHeight = isMobile ? "100dvh" : "140vh";

    // Setup scroll tracking with reduced computation
    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start start", "end start"],
    });

    // Optimized spring physics for better performance
    const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 40,
      damping: 25,
      restDelta: 0.002,
    });

    // Define all transforms at the top level
    const imageScale = useTransform(
      smoothProgress,
      [0, 0.5],
      isMobile ? [0.8, 1.8] : [1, 2.2]
    );

    const yMove = useTransform(
      smoothProgress,
      [0, 0.5],
      isMobile ? [0, -30] : [0, -60]
    );

    const contentOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);
    const uiOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
    const backgroundColor = useTransform(
      smoothProgress,
      [0, 0.45],
      ["rgba(255,255,255,1)", "rgba(0,0,0,0)"]
    );
    const overlayOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 0.8]);

    // Only recalculate visible state when necessary
    useEffect(() => {
      const unsubscribe = smoothProgress.onChange((latest) => {
        if (latest > 0.6 !== !isVisible) {
          setIsVisible(latest <= 0.6);
        }

        if (headerContentRef.current) {
          headerContentRef.current.style.pointerEvents =
            latest > 0.5 ? "none" : "auto";
        }
      });
      return () => unsubscribe();
    }, [smoothProgress, isVisible]);

    // Optimized scroll handling
    const handleNext = useCallback(() => {
      if (!nextSectionId) return;

      const nextElem = document.getElementById(nextSectionId);
      if (nextElem) {
        requestAnimationFrame(() => {
          nextElem.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    }, [nextSectionId]);

    return (
      <motion.section
        ref={sectionRef}
        id={id}
        className="relative w-full overflow-hidden"
        style={{
          height: sectionHeight,
          backgroundColor,
          zIndex: isVisible ? 20 : -1,
        }}
      >
        {isVisible && (
          <>
            <motion.div
              ref={headerContentRef}
              className="fixed inset-0 w-full h-screen flex items-center justify-center"
              style={{
                opacity: contentOpacity,
                willChange: "transform, opacity",
              }}
            >
              <motion.div
                className={`${
                  isMobile ? "w-[250px]" : "w-[350px]"
                } mx-auto relative`}
                style={{
                  scale: imageScale,
                  y: yMove,
                  willChange: "transform",
                  translateZ: 0,
                }}
                variants={!isMobile ? floatingVariants : undefined}
                animate={!isMobile ? "float" : undefined}
              >
                <OptimizedImage src={image} alt="Header visual" />
              </motion.div>

              <motion.div
                className="absolute w-full top-4 right-4"
                style={{ opacity: uiOpacity }}
              >
                <div className={mainConfigs.SECTION_CONTAINER_CLASS}>
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

            <motion.div
              className="fixed inset-0 pointer-events-none"
              style={{
                opacity: overlayOpacity,
                background:
                  "radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, black 80%)",
                zIndex: -1,
              }}
            />
          </>
        )}
      </motion.section>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
