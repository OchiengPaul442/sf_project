"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useSpring } from "framer-motion";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { mainConfigs } from "@/utils/configs";

export interface HowSectionProps {
  id: string;
}

const HowSection: React.FC<HowSectionProps> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set a fixed section height.
  const sectionHeight = "150vh";

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

  // Define a breakpoint where the first paragraph ends and second begins.
  const revealBreak = 0.5; // adjust as needed
  const gradientBuffer = 0.05; // a short buffer range for the gradient

  // Define reveal ranges for sequential effect.
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
      className="relative w-full bg-black overflow-hidden"
      style={{ height: sectionHeight }}
    >
      {/*
        The sticky container is confined to this section and uses:
          • CSS sticky with a top offset of 25% (top-1/4)
          • A fixed height of 75vh so that the content is centered vertically.
      */}
      <div className="sticky top-1/4 flex items-center justify-center h-[75vh]">
        <div className={`${mainConfigs.SECTION_CONTAINER_CLASS} space-y-40`}>
          <div>
            <TextReveal
              text={paragraphs.first}
              progress={progress}
              // Reveal only during the first half of the scroll.
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
              // Reveal during the second half of the scroll.
              range={paragraphRanges.second}
              align="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
