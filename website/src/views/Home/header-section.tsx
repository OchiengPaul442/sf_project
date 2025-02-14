"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { useRef, useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

export interface HeaderSectionProps {
  onNextSection?: () => void;
}

export default function HeaderSection({ onNextSection }: HeaderSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set the header height to 450vh for a longer scroll area.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Define thresholds:
  // - SCALE_COMPLETE_THRESHOLD: when the scaling should be fully reached.
  // - TRANSITION_THRESHOLD: when the tunnel effect and snapping begin.
  const SCALE_COMPLETE_THRESHOLD = 0.9;
  const TRANSITION_THRESHOLD = 0.99;

  // Control points are stretched to provide gradual scaling and movement.
  const progressRange = [
    0,
    0.5,
    SCALE_COMPLETE_THRESHOLD,
    TRANSITION_THRESHOLD,
    1,
  ];

  // Helper for choosing mobile or desktop values.
  const getAnimationValues = (
    mobileValues: number[],
    desktopValues: number[]
  ) => (isMobile ? mobileValues : desktopValues);

  // Increase scaling further:
  const textScale = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues(
      [1, 2.2, 4, 4, 4], // Mobile: scale up to 4×
      [1, 4, 8, 8, 8] // Desktop: scale up to 8×
    )
  );

  // Keep text fully opaque until near the end.
  const textOpacity = useTransform(
    scrollYProgress,
    [0, SCALE_COMPLETE_THRESHOLD, TRANSITION_THRESHOLD, 1],
    [1, 1, 0.8, 0]
  );

  // Slight horizontal and vertical movement.
  const xMovePercent = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues([0, -5, -10, -10, -10], [0, -10, -20, -20, -20])
  );
  const yMovePercent = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues([0, -3, -6, -6, -6], [0, -6, -12, -12, -12])
  );

  // Navigation and intro text opacity.
  const navOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25],
    [1, 0.7, 0]
  );
  const introTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2],
    [1, 0.7, 0]
  );

  // FUTURISTIC TUNNEL OVERLAY:
  // A full-screen radial gradient that simulates a tunnel effect.
  // Here, we use a radial gradient that starts fading in at 85% progress
  // and is fully visible by the time the header scroll completes.
  const tunnelOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  // Trigger the transition to the next section only when near the end.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value >= TRANSITION_THRESHOLD && !isTransitioning && onNextSection) {
        setIsTransitioning(true);
        // A slight delay allows the tunnel effect to fully display.
        setTimeout(() => {
          onNextSection();
          setTimeout(() => setIsTransitioning(false), 1000);
        }, 300);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, onNextSection, isTransitioning]);

  return (
    <section
      ref={sectionRef}
      id="header-section"
      className="relative h-[450vh] bg-white"
    >
      {/* Tunnel Overlay – full screen futuristic tunnel effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          opacity: tunnelOpacity,
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      <div className="sticky top-0 h-screen overflow-hidden relative z-20">
        {/* Navigation */}
        <motion.div
          style={{ opacity: navOpacity }}
          className="absolute top-4 right-4 z-40 transition-opacity duration-300"
        >
          <Nav />
        </motion.div>
        {/* Content Container */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-40">
          <motion.h2
            style={{ opacity: introTextOpacity }}
            className="text-gray-600 text-2xl md:text-4xl font-normal mb-4"
          >
            We&apos;re
          </motion.h2>
          <motion.h1
            style={{
              scale: textScale,
              opacity: textOpacity,
              x: xMovePercent,
              y: yMovePercent,
            }}
            className="font-bold tracking-tight text-black text-[8vw] md:text-[10vh] transform-gpu"
          >
            Saving Food.
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
