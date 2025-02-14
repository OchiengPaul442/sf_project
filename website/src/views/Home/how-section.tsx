// views/Home/how-section.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { isMobileDevice } from "@/utils/deviceDetection";

interface HowSectionProps {
  id: string;
  animationData?: any;
  scrollLockControls?: {
    lockScroll: () => void;
    unlockScroll: () => void;
  };
  // Optionally, you could add scrollLockControls here if desired.
}

const HowSection: React.FC<HowSectionProps> = ({ id }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentScrollProgress, setCurrentScrollProgress] = useState(0);
  const isMobile = isMobileDevice();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let frameId: number | null = null;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = 1 - rect.bottom / (windowHeight + rect.height);
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        setCurrentScrollProgress(clampedProgress);
      }
    };

    const onScroll = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  const firstParagraph =
    "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability";
  const secondParagraph =
    "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest";

  if (!mounted) return null;

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full h-dvh md:h-[200vh] bg-black snap-start flex items-center justify-center"
    >
      <div className="container mx-auto px-4 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] sticky top-0 h-screen flex items-center">
        <div className="flex flex-col justify-center items-center space-y-4 sm:space-y-24 md:space-y-28">
          <div className="w-full">
            <TextReveal
              text={firstParagraph}
              scrollYProgress={currentScrollProgress}
              range={isMobile ? [0.25, 0.3] : [0.25, 0.4]}
              align="left"
            />
          </div>
          <div className="w-full">
            <GradientSeparator
              progress={Math.max(
                0,
                Math.min(
                  1,
                  (currentScrollProgress - 0.35) / (isMobile ? 0.04 : 0.1)
                )
              )}
            />
          </div>
          <div className="w-full">
            <TextReveal
              text={secondParagraph}
              scrollYProgress={currentScrollProgress}
              range={isMobile ? [0.4, 0.6] : [0.45, 0.65]}
              align="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
