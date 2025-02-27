import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { mainConfigs } from "@/utils/configs";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface HowSectionProps {
  id: string;
  onSectionComplete?: () => void;
}

/**
 * Maps a MotionValue from an input range to an output range while clamping
 * the result.
 */
function useClampedProgress(
  value: MotionValue<number>,
  inputRange: [number, number],
  outputRange: [number, number]
) {
  const transformed = useTransform(value, inputRange, outputRange);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = transformed.onChange((v) => setProgress(v));
    return () => unsubscribe();
  }, [transformed]);

  return progress;
}

const HowSection: React.FC<HowSectionProps> = ({ id, onSectionComplete }) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Store metrics for scroll calculations.
  const spacerMetrics = useRef({ top: 0, effectiveHeight: 0 });

  // Track scroll progress for the entire section.
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  // Create a smoothed version of scroll progress.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    mass: 0.8,
  });

  /**
   * For mobile we want the section to:
   * - Fade in from 0 to full opacity between 0% and 10% of scroll progress.
   * - Stay fully opaque while text is being revealed.
   * - Fade out between 90% and 100% of scroll progress so that once the text
   *   has been fully revealed, the section gradually disappears.
   */
  const mobileSectionOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );
  const sectionOpacity = isMobile ? mobileSectionOpacity : 1;

  /**
   * Define breakpoints for text reveal.
   * The first text block reveals from 10% to 45% of the section scroll,
   * and the second text block reveals from 45% to 90%.
   */
  const revealBreak = isMobile ? 0.45 : 0.5;
  const gradientBuffer = isMobile ? 0.1 : 0.08;

  const paragraphRanges = {
    first: [0.1, revealBreak] as [number, number],
    gradient: [revealBreak - gradientBuffer, revealBreak + gradientBuffer] as [
      number,
      number
    ],
    second: [revealBreak, 0.9] as [number, number],
  };

  // Calculate progress for each text element.
  const firstTextProgress = useClampedProgress(
    smoothProgress,
    paragraphRanges.first,
    [0, 1]
  );
  const gradientProgress = useClampedProgress(
    smoothProgress,
    paragraphRanges.gradient,
    [0, 1]
  );
  const secondTextProgress = useClampedProgress(
    smoothProgress,
    paragraphRanges.second,
    [0, 1]
  );

  // On mobile, auto-scroll to the next section once the section is nearly done.
  const [autoScrolled, setAutoScrolled] = useState(false);
  useEffect(() => {
    if (isMobile && onSectionComplete && !autoScrolled) {
      const unsubscribe = smoothProgress.onChange((value) => {
        if (value >= 0.99) {
          setAutoScrolled(true);
          onSectionComplete();
        }
      });
      return () => unsubscribe();
    }
  }, [isMobile, onSectionComplete, autoScrolled, smoothProgress]);

  // Update spacer metrics and handle scroll behavior for fixed positioning.
  useEffect(() => {
    if (!spacerRef.current) return;

    const updateMetrics = () => {
      const rect = spacerRef.current!.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const height = rect.height;
      const effHeight = Math.max(0, height - window.innerHeight);
      spacerMetrics.current = { top, effectiveHeight: effHeight };
    };

    const handleScroll = () => {
      if (!spacerRef.current || !containerRef.current) return;

      const { top, effectiveHeight } = spacerMetrics.current;
      const scrollY = window.scrollY;

      // Fix the container during scrolling within the section.
      if (scrollY >= top && scrollY < top + effectiveHeight) {
        containerRef.current.style.position = "fixed";
        containerRef.current.style.top = "0";
      } else {
        containerRef.current.style.position = "absolute";
        containerRef.current.style.top =
          scrollY < top ? "0" : `${effectiveHeight}px`;
      }
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const paragraphs = {
    first:
      "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability.",
    second:
      "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest.",
  };

  return (
    <section
      id={id}
      ref={spacerRef}
      data-section-id="how"
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? "200vh" : "250vh" }}
    >
      <motion.div
        ref={containerRef}
        className="absolute inset-0 w-full"
        style={{
          height: "100vh",
          opacity: sectionOpacity,
        }}
      >
        <div
          ref={contentRef}
          className="relative h-full flex items-center justify-center w-full px-4 md:px-0"
        >
          <div
            className={`${mainConfigs.SECTION_CONTAINER_CLASS} space-y-8 md:space-y-32 py-8 md:py-16`}
          >
            <div className="transform transition-all duration-700">
              <TextReveal
                text={paragraphs.first}
                progress={firstTextProgress}
                align="left"
                className="text-left md:text-left text-lg md:text-xl lg:text-2xl"
              />
            </div>
            <div className="my-8 md:my-0">
              <GradientSeparator progress={gradientProgress} />
            </div>
            <div className="transform transition-all duration-700">
              <TextReveal
                text={paragraphs.second}
                progress={secondTextProgress}
                align="right"
                className="text-left md:text-right text-lg md:text-xl lg:text-2xl"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowSection;
