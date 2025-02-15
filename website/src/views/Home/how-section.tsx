"use client";

import React, { useRef, useState, useEffect } from "react";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { isMobileDevice } from "@/utils/deviceDetection";

interface HowSectionProps {
  id: string;
}

const HowSection: React.FC<HowSectionProps> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * progress ∈ [0, 1]: overall reveal progress of the section.
   */
  const [progress, setProgress] = useState<number>(0);
  const isMobile = isMobileDevice();

  /**
   * Increase the factor to require more scrolling distance for a slow reveal.
   */
  const SCROLL_FACTOR = 2.0;

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      /**
       * Calculate progress:
       * - When the section’s top is at the bottom of the viewport, progress is near 0.
       * - When the section’s top is far above the viewport, progress is near 1.
       * Multiplying sectionHeight by SCROLL_FACTOR stretches the scroll distance.
       */
      const rawProgress =
        (windowHeight - rect.top) /
        (windowHeight + sectionHeight * SCROLL_FACTOR);
      const clamped = Math.max(0, Math.min(1, rawProgress));
      setProgress(clamped);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run on mount in case the user reloads mid-page.
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Example text content
  const firstParagraph =
    "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability.";
  const secondParagraph =
    "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest.";

  /**
   * Define sub-ranges for a sequential reveal:
   * - First paragraph: revealed from 0.0 to 0.4 progress.
   * - Separator: revealed from 0.4 to 0.45.
   * - Second paragraph: revealed from 0.45 to 1.0.
   */
  const firstParagraphRange: [number, number] = [0.0, 0.4];
  const gradientRange: [number, number] = [0.4, 0.45];
  const secondParagraphRange: [number, number] = [0.45, 1.0];

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative bg-black overflow-hidden w-full"
    >
      {/*
        Extra vertical padding provides ample scroll distance for a smooth reveal.
      */}
      <div className="container mx-auto px-4 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] py-64">
        <div className="flex flex-col items-center space-y-16 sm:space-y-20 md:space-y-24">
          {/* First Paragraph Reveal */}
          <div className="w-full">
            <TextReveal
              text={firstParagraph}
              scrollYProgress={progress}
              range={isMobile ? [0, 0.4] : firstParagraphRange}
              align="left"
            />
          </div>

          {/* Gradient Separator Reveal */}
          <div className="w-full">
            <GradientSeparator
              progress={Math.max(
                0,
                Math.min(
                  1,
                  (progress - gradientRange[0]) /
                    (gradientRange[1] - gradientRange[0])
                )
              )}
            />
          </div>

          {/* Second Paragraph Reveal */}
          <div className="w-full">
            <TextReveal
              text={secondParagraph}
              scrollYProgress={progress}
              range={isMobile ? [0.5, 1] : secondParagraphRange}
              align="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
