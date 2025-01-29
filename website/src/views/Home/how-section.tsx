"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll } from "framer-motion";

// --- Hook to get the current viewport height ---
const useViewportHeight = (): number => {
  const [vh, setVh] = useState<number>(0);

  useEffect(() => {
    const updateVh = () => {
      setVh(window.visualViewport?.height || window.innerHeight);
    };
    updateVh();
    window.addEventListener("resize", updateVh);
    window.addEventListener("orientationchange", updateVh);
    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, []);

  return vh;
};

// Simple device check
const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Mobi|Android/i.test(window.navigator.userAgent);
};

// --- TextReveal Component ---
interface TextRevealProps {
  text: string;
  scrollYProgress: number;
  range: [number, number];
  align?: "left" | "right";
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  scrollYProgress,
  range,
  align = "left",
}) => {
  // Calculate how far along we are in this text block reveal
  const progress = Math.max(
    0,
    Math.min(1, (scrollYProgress - range[0]) / (range[1] - range[0]))
  );

  const characters = text.split("");
  const totalChars = characters.length;

  return (
    <div
      className={`relative ${align === "right" ? "text-right" : "text-left"}`}
    >
      {/* Invisible text for layout */}
      <p
        className="invisible text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] 
                   font-normal leading-[1.4] sm:leading-[1.5] md:leading-[1] tracking-normal"
      >
        {text}
      </p>

      {/* Reveal container */}
      <div className="absolute top-0 left-0 right-0">
        <p
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] 
                     font-normal leading-[1.4] sm:leading-[1.5] md:leading-[1]
                     tracking-normal"
        >
          {/* Ghost layer */}
          <span className="absolute top-0 left-0 right-0 text-white/20">
            {characters.map((char, i) => (
              <span
                key={`ghost-${i}`}
                className="inline-block"
                style={{
                  width: char === " " ? "0.25em" : "auto",
                }}
              >
                {char}
              </span>
            ))}
          </span>

          {/* Reveal text layer */}
          <span className="relative">
            {characters.map((char, i) => {
              const charRevealProgress = Math.max(
                0,
                Math.min(1, (progress * totalChars - i) * 1.5)
              );

              return (
                <span
                  key={`reveal-${i}`}
                  className="inline-block relative"
                  style={{
                    width: char === " " ? "0.25em" : "auto",
                  }}
                >
                  <span
                    className="text-white"
                    style={{
                      opacity: charRevealProgress >= 1 ? 1 : 0,
                      transition: "opacity 0.1s ease-out",
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- Gradient Separator ---
const GradientSeparator: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="relative w-full flex items-center gap-4 py-6">
      {/* Ghost separator (gray) */}
      <div className="absolute w-full flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        <div className="flex-1 h-px bg-gradient-to-l from-white/20 to-transparent" />
      </div>

      {/* Revealed separator (white) */}
      <div
        className="flex-1 h-px bg-gradient-to-r from-white to-transparent transition-opacity duration-300"
        style={{ opacity: progress }}
      />
      <div
        className="flex-1 h-px bg-gradient-to-l from-white to-transparent transition-opacity duration-300"
        style={{ opacity: progress }}
      />
    </div>
  );
};

// --- HowSection Component ---
interface HowSectionProps {
  isActive?: boolean;
  onScrollProgress?: (progress: number) => void;
}

const HowSection: React.FC<HowSectionProps> = ({ onScrollProgress }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentScrollProgress, setCurrentScrollProgress] = useState(0);

  const vh = useViewportHeight();

  // SSR-safe mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Subscribe to scroll progress changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value: number) => {
      setCurrentScrollProgress(value);
      onScrollProgress?.(value);
    });
    return () => unsubscribe();
  }, [scrollYProgress, onScrollProgress]);

  // On mobile, only 1× vh; on desktop, 3× vh
  const sectionHeight = isMobileDevice() ? vh : vh * 3;

  const firstParagraph =
    "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability.";

  const secondParagraph =
    "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest.";

  if (!mounted) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-black min-h-screen"
      style={{ height: sectionHeight ? `${sectionHeight}px` : "100vh" }}
    >
      <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="relative mx-auto w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%]">
            <div className="flex flex-col justify-center items-center h-full space-y-4 sm:space-y-24 md:space-y-28">
              <div className="w-full">
                <TextReveal
                  text={firstParagraph}
                  scrollYProgress={currentScrollProgress}
                  range={[0.1, 0.4]}
                  align="left"
                />
              </div>

              <div className="w-full">
                <GradientSeparator
                  progress={Math.max(
                    0,
                    Math.min(1, (currentScrollProgress - 0.45) / 0.1)
                  )}
                />
              </div>

              <div className="w-full">
                <TextReveal
                  text={secondParagraph}
                  scrollYProgress={currentScrollProgress}
                  range={[0.6, 0.9]}
                  align="right"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
