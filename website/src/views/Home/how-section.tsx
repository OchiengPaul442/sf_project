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

  // For mobile, use a reduced dynamic viewport height (dvh) value.
  // For desktop, keep the current vh value.
  const sectionHeight = isMobile ? "120dvh" : "150vh";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Improve animation smoothness with a spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50, // Reduced for smoother animation
    damping: 20, // Adjusted for better response
    mass: 0.5, // Added for more natural movement
  });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((v) => setProgress(v));
    return () => unsubscribe();
  }, [smoothProgress]);

  // Adjusted reveal timing for better mobile experience
  const revealBreak = isMobile ? 0.4 : 0.5;
  const gradientBuffer = isMobile ? 0.08 : 0.05;

  const paragraphRanges = {
    first: [0, revealBreak] as [number, number],
    gradient: [revealBreak - gradientBuffer, revealBreak + gradientBuffer] as [
      number,
      number
    ],
    second: [revealBreak, 1] as [number, number],
  };

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
      className="relative snap-start w-full overflow-hidden"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-1/2 transform -translate-y-1/2 flex items-center justify-center w-full px-4 md:px-0">
        <div
          className={`${mainConfigs.SECTION_CONTAINER_CLASS} space-y-8 md:space-y-40`}
        >
          <div className="mb-6 md:mb-0">
            <TextReveal
              text={paragraphs.first}
              progress={progress}
              range={paragraphRanges.first}
              align="left"
              className="text-left md:text-left"
            />
          </div>
          <div className="my-8 md:my-0">
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
              align="right"
              className="text-left md:text-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
