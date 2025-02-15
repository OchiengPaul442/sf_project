"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { TextReveal } from "@/components/TextReveal";
import { GradientSeparator } from "@/components/GradientSeparator";
import { isMobileDevice } from "@/utils/deviceDetection";

interface HowSectionProps {
  id: string;
  scrollLockControls?: {
    lockScroll: () => void;
    unlockScroll: () => void;
  };
  onTransitionNext?: () => void;
  onTransitionPrev?: () => void;
  isActive?: boolean;
}

const HowSection: React.FC<HowSectionProps> = ({
  id,
  scrollLockControls,
  onTransitionNext,
  onTransitionPrev,
  isActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Single progress state that controls both paragraphs.
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const isMobile = isMobileDevice();

  // Lower sensitivity so that more scrolling is needed.
  const SCROLL_SENSITIVITY = 0.0015;
  // Increase overscroll threshold so transition only happens on deliberate extra scroll.
  const OVERSCROLL_THRESHOLD = 300;
  const overscrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingDelta = useRef(0);

  const processDelta = useCallback(
    (delta: number) => {
      // Downward scrolling
      if (delta > 0) {
        // Only update progress if not yet fully revealed.
        if (progressRef.current < 1) {
          const newProgress = Math.min(
            1,
            progressRef.current + delta * SCROLL_SENSITIVITY
          );
          progressRef.current = newProgress;
          setProgress(newProgress);
          // Reset any overscroll accumulation.
          overscrollRef.current = 0;
        }
        // Once fully revealed, start accumulating overscroll for deliberate transition.
        else if (progressRef.current === 1) {
          overscrollRef.current += delta;
          if (overscrollRef.current >= OVERSCROLL_THRESHOLD) {
            onTransitionNext?.();
            overscrollRef.current = 0;
          }
        }
      }
      // Upward scrolling
      else if (delta < 0) {
        // Only update progress if not fully hidden.
        if (progressRef.current > 0) {
          const newProgress = Math.max(
            0,
            progressRef.current + delta * SCROLL_SENSITIVITY
          );
          progressRef.current = newProgress;
          setProgress(newProgress);
          overscrollRef.current = 0;
        }
        // Once fully hidden, accumulate overscroll for upward transition.
        else if (progressRef.current === 0) {
          overscrollRef.current += Math.abs(delta);
          if (overscrollRef.current >= OVERSCROLL_THRESHOLD) {
            onTransitionPrev?.();
            overscrollRef.current = 0;
          }
        }
      }
    },
    [onTransitionNext, onTransitionPrev]
  );

  const flushDelta = useCallback(() => {
    processDelta(pendingDelta.current);
    pendingDelta.current = 0;
    rafRef.current = null;
  }, [processDelta]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Prevent propagation so global scrolling doesn’t interfere.
      e.preventDefault();
      pendingDelta.current += e.deltaY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushDelta);
      }
    },
    [flushDelta]
  );

  const touchStartYRef = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const currentY = e.touches[0].clientY;
      const delta = touchStartYRef.current - currentY;
      pendingDelta.current += delta;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushDelta);
      }
      touchStartYRef.current = currentY;
    },
    [flushDelta]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) return;

    // Lock global scroll when active.
    scrollLockControls?.lockScroll();

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      scrollLockControls?.unlockScroll();
    };
  }, [
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    scrollLockControls,
    isActive,
  ]);

  // Example text content.
  const firstParagraph =
    "By building a platform that empowers restaurants to cut food waste, protect their bottom line, and have a meaningful, cumulative impact on global sustainability";
  const secondParagraph =
    "Our team blends more than a decade of Food and AI experience, in a packaged solution that lets you focus on creating while we handle the rest";

  return (
    <section
      id={id}
      ref={containerRef}
      className={`${
        isActive ? "fixed inset-0 z-50" : "relative"
      } bg-black overflow-hidden`}
    >
      {/* Center content vertically and horizontally */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-[90%] sm:max-w-[85%] md:max-w-[75%]">
          <div className="flex flex-col items-center space-y-8 sm:space-y-16 md:space-y-20">
            <div className="w-full">
              <TextReveal
                text={firstParagraph}
                scrollYProgress={progress}
                // Adjust the range for a smooth letter-by-letter reveal.
                range={isMobile ? [0, 0.5] : [0, 0.55]}
                align="left"
              />
            </div>
            <div className="w-full">
              <GradientSeparator
                progress={Math.max(
                  0,
                  Math.min(1, (progress - (isMobile ? 0.5 : 0.55)) / 0.1)
                )}
              />
            </div>
            <div className="w-full">
              <TextReveal
                text={secondParagraph}
                scrollYProgress={progress}
                range={isMobile ? [0.65, 1] : [0.7, 1]}
                align="right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
