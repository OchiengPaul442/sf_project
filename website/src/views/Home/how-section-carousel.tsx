"use client";

import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import type { StepWithData } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";

// Dynamically load Lottie with a fallback spinner.
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
    </div>
  ),
});

// ----------------------------------------------------------------
// Carousel Variants for Framer Motion
// ----------------------------------------------------------------

const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({
    y: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

// ----------------------------------------------------------------
// NavItem Component (with dot and title)
// ----------------------------------------------------------------

interface NavItemProps {
  step: StepWithData;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = memo(({ step, isActive, onClick }) => (
  <motion.button
    className="relative cursor-pointer focus:outline-none w-full"
    onClick={onClick}
    initial={false}
    animate={{ opacity: isActive ? 1 : 0.5 }}
    transition={{ duration: 0.3 }}
    aria-pressed={isActive}
    aria-label={step.title}
  >
    <div className="flex items-center pl-6 sm:pl-12 whitespace-nowrap">
      <motion.div
        className={`mr-2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
          isActive ? "bg-white" : ""
        }`}
        animate={{ scale: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      />
      <span
        className={`font-light tracking-wide transition-all duration-300 ${
          isActive
            ? "text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
            : "text-zinc-200 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
        }`}
      >
        {step.title}
      </span>
    </div>
  </motion.button>
));
NavItem.displayName = "NavItem";

// ----------------------------------------------------------------
// CarouselNav Component (wraps NavItems with a separator line)
// ----------------------------------------------------------------

interface CarouselNavProps {
  steps: StepWithData[];
  activeIndex: number;
  onNavItemClick: (index: number) => void;
  title: string;
}

const CarouselNav: React.FC<CarouselNavProps> = ({
  steps,
  activeIndex,
  onNavItemClick,
  title,
}) => (
  <div className="relative">
    {/* Separator line */}
    <div className="absolute left-[1.7rem] sm:left-[3.25rem] top-0 w-[1px] sm:w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent" />
    <nav
      className="space-y-6 sm:space-y-8 lg:space-y-10"
      aria-label={`${title} navigation`}
    >
      {steps.map((step, index) => (
        <NavItem
          key={step.id}
          step={step}
          isActive={activeIndex === index}
          onClick={() => onNavItemClick(index)}
        />
      ))}
    </nav>
  </div>
);

// ----------------------------------------------------------------
// HowSectionCarousel Component with Scroll‑Based Navigation
// ----------------------------------------------------------------

export interface HowSectionCarouselProps {
  id: string;
  title: string;
  steps: StepWithData[];
  /** Callback to trigger outer-section navigation when scrolling past the carousel */
  onExitCarousel?: (direction: "up" | "down") => void;
}

const HowSectionCarousel: React.FC<HowSectionCarouselProps> = memo(
  function HowSectionCarousel({ id, title, steps, onExitCarousel }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    // Reference to the outer scrollable container (200vh).
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset animation loaded state on slide change.
    useEffect(() => {
      setAnimationLoaded(false);
    }, [activeIndex]);

    // Fallback effect: if onDOMLoaded/onDataReady never fire, mark as loaded after 500ms.
    useEffect(() => {
      const timer = setTimeout(() => setAnimationLoaded(true), 500);
      return () => clearTimeout(timer);
    }, [activeIndex]);

    // When the carousel container enters the viewport, reset scroll and active index.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            container.scrollTo({ top: 0, behavior: "smooth" });
            setActiveIndex(0);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    // Use Framer Motion’s scroll hook to track progress in the container.
    const { scrollYProgress } = useScroll({ container: containerRef });
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      // When near the boundaries, do nothing so that the outer scroller can take over.
      if (latest < 0.05 || latest > 0.95) return;

      // Map progress to an index.
      const segment = 1 / steps.length;
      const newIndex = Math.min(steps.length - 1, Math.floor(latest / segment));
      if (newIndex !== activeIndex) {
        setDirection(newIndex > activeIndex ? 1 : -1);
        setActiveIndex(newIndex);
      }
    });

    // Handler for manual navigation clicks.
    const handleNavItemClick = (index: number) => {
      if (index === activeIndex) return;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
      if (containerRef.current) {
        // Scroll the container to the corresponding offset.
        const scrollableHeight =
          containerRef.current.scrollHeight - containerRef.current.clientHeight;
        const targetScroll = (scrollableHeight * index) / steps.length;
        containerRef.current.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    };

    // --- Wheel event handling with delta accumulation ---
    const wheelDeltaAccumulator = useRef(0);
    const wheelThreshold = 40; // Adjust threshold for touchpad sensitivity

    const handleWheel = useCallback(
      (e: WheelEvent) => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const atTop = scrollTop < 10;
        const atBottom = scrollTop > scrollHeight - clientHeight - 10;

        // If at boundaries and the user scrolls beyond, let the event bubble.
        if (activeIndex === 0 && e.deltaY < 0 && atTop) {
          if (onExitCarousel) onExitCarousel("up");
          wheelDeltaAccumulator.current = 0;
          return;
        }
        if (activeIndex === steps.length - 1 && e.deltaY > 0 && atBottom) {
          if (onExitCarousel) onExitCarousel("down");
          wheelDeltaAccumulator.current = 0;
          return;
        }

        // Accumulate the delta
        wheelDeltaAccumulator.current += e.deltaY;

        // If the accumulated delta exceeds threshold, update the slide.
        if (wheelDeltaAccumulator.current > wheelThreshold) {
          if (activeIndex < steps.length - 1) {
            setDirection(1);
            setActiveIndex((prev) => prev + 1);
          }
          wheelDeltaAccumulator.current = 0;
          e.preventDefault();
          e.stopPropagation();
          return;
        } else if (wheelDeltaAccumulator.current < -wheelThreshold) {
          if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex((prev) => prev - 1);
          }
          wheelDeltaAccumulator.current = 0;
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      },
      [activeIndex, steps.length, onExitCarousel]
    );

    // --- Touch event handling ---
    const touchStartY = useRef<number | null>(null);

    const handleTouchStart = useCallback((e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback(
      (e: TouchEvent) => {
        if (touchStartY.current === null) return;
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        const swipeThreshold = 30; // minimum swipe distance in px
        if (Math.abs(deltaY) < swipeThreshold) {
          touchStartY.current = null;
          return;
        }
        if (deltaY > 0) {
          // Swipe up
          if (activeIndex < steps.length - 1) {
            setDirection(1);
            setActiveIndex((prev) => prev + 1);
          } else if (activeIndex === steps.length - 1 && onExitCarousel) {
            onExitCarousel("down");
          }
        } else {
          // Swipe down
          if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex((prev) => prev - 1);
          } else if (activeIndex === 0 && onExitCarousel) {
            onExitCarousel("up");
          }
        }
        touchStartY.current = null;
      },
      [activeIndex, steps.length, onExitCarousel]
    );

    // Attach wheel and touch handlers to the container.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }, [handleWheel, handleTouchStart, handleTouchEnd]);

    const currentStep = steps[activeIndex] || steps[0];

    return (
      <section id={id} className="bg-black">
        {/* The scrollable container is 200vh tall */}
        <div
          ref={containerRef}
          className="relative h-[200vh] overflow-y-scroll"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Sticky container positioned 150px from the top */}
          <div className="sticky top-[150px]">
            <div
              className={`${mainConfigs.SECTION_CONTAINER_CLASS} grid grid-cols-1 lg:grid-cols-3 items-center gap-8 w-full`}
            >
              {/* Navigation */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <CarouselNav
                  title={title}
                  steps={steps}
                  activeIndex={activeIndex}
                  onNavItemClick={handleNavItemClick}
                />
              </div>
              {/* Carousel Content */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <div className="relative w-full h-[50vh] lg:h-[70vh] max-w-3xl overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStep.id}
                      className="absolute inset-0 flex items-center justify-center"
                      custom={direction}
                      variants={carouselVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {currentStep.animationData ? (
                        <div className="w-full h-full relative">
                          <div className="w-[90%] h-[90%] lg:w-[85%] lg:h-[85%] mx-auto">
                            <Lottie
                              animationData={currentStep.animationData}
                              loop
                              autoplay
                              lottieRef={lottieRef}
                              onDOMLoaded={() => setAnimationLoaded(true)}
                              onDataReady={() => setAnimationLoaded(true)}
                              className="w-full h-full"
                              renderer="svg"
                              rendererSettings={{
                                preserveAspectRatio: "xMidYMid meet",
                                progressiveLoad: true,
                              }}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          {/* Loading overlay: only shown when animation is not loaded */}
                          {!animationLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="text-white text-center"
                          aria-live="polite"
                        >
                          No animation available for this step
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default HowSectionCarousel;
