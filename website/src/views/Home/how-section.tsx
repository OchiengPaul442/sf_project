"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useSpring } from "framer-motion";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { mainConfigs } from "@/utils/configs";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface HowSectionProps {
  id: string;
}

const HowSection: React.FC<HowSectionProps> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Adjust the section height based on the device.
  const sectionHeight = isMobile ? "200vh" : "150vh";

  // Compute scroll progress over this section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((v) => setProgress(v));
    return () => unsubscribe();
  }, [smoothProgress]);

  // Define breakpoints and reveal ranges.
  const revealBreak = 0.5;
  const gradientBuffer = 0.05;
  const paragraphRanges = {
    first: [0, revealBreak] as [number, number],
    gradient: [revealBreak - gradientBuffer, revealBreak + gradientBuffer] as [
      number,
      number
    ],
    second: [revealBreak, 1] as [number, number],
  };

  // Text content.
  const paragraphs = {
    first:
      "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability.",
    second:
      "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest.",
  };

  return (
    <section
      id={id}
      ref={containerRef}
      data-section-id="how"
      className="relative snap-start w-full bg-black overflow-hidden"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container centered vertically and horizontally */}
      <div className="sticky top-1/2 transform -translate-y-1/2 flex items-center justify-center w-full">
        <div
          className={`${mainConfigs.SECTION_CONTAINER_CLASS} space-y-10 md:space-y-40`}
        >
          <div className="mb-8 md:mb-0">
            <TextReveal
              text={paragraphs.first}
              progress={progress}
              range={paragraphRanges.first}
              align="left"
            />
          </div>
          <div>
            <GradientSeparator
              progress={Math.max(
                0,
                Math.min(
                  1,
                  (progress - paragraphRanges.gradient[0]) /
                    (paragraphRanges.gradient[1] - paragraphRanges.gradient[0])
                )
              )}
            />
          </div>
          <div>
            <TextReveal
              text={paragraphs.second}
              progress={progress}
              range={paragraphRanges.second}
              align={isMobile ? "left" : "right"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
