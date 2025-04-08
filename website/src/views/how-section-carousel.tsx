"use client";

import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import type { StepWithData } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";
import { useIsMobile } from "@/hooks/useIsMobile";

// Dynamic import with loading fallback
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});

// Animation variants extracted for reuse
const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.97,
    filter: "blur(3px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 60 : -60,
    opacity: 0,
    scale: 0.97,
    filter: "blur(3px)",
  }),
};

// Reusable UI components
const LoadingIndicator = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
  </div>
);

// Constants
const SCROLL_THROTTLE_TIME = 250;
const SECTION_TRANSITION_DELAY = 300; // ms before allowing next section transition
const INSTRUCTION_HIDE_DELAY = 3000; // ms before hiding the instruction text

interface CarouselNavProps {
  steps: StepWithData[];
  activeIndex: number;
  onNavItemClick: (index: number) => void;
  title: string;
}

const CarouselNav: React.FC<CarouselNavProps> = memo(function CarouselNav({
  steps,
  activeIndex,
  onNavItemClick,
  title,
}) {
  return (
    <div className="relative">
      <div className="absolute left-[1.7rem] sm:left-[3.25rem] top-0 w-[1px] sm:w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent" />
      <nav
        className="space-y-6 sm:space-y-8 lg:space-y-10"
        aria-label={`${title} navigation`}
      >
        {steps.map((step, index) => (
          <button
            key={step.id}
            className="relative cursor-pointer focus:outline-none w-full"
            onClick={() => onNavItemClick(index)}
            aria-pressed={activeIndex === index}
            aria-label={step.title}
          >
            <div className="flex items-center pl-6 sm:pl-12 whitespace-nowrap transition-all duration-300">
              <div
                className={`mr-2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 
                  ${activeIndex === index ? "bg-white" : "bg-transparent"}`}
              />
              <span
                className={`tracking-wide transition-all duration-300 
                  ${
                    activeIndex === index
                      ? "text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                      : "text-zinc-200 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                  }`}
              >
                {step.title}
              </span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
});

interface CarouselContentProps {
  currentStep: StepWithData;
  direction: number;
  isMobile: boolean;
}

const CarouselContent: React.FC<CarouselContentProps> = memo(
  function CarouselContent({ currentStep, direction, isMobile }) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }, [currentStep.id]);

    const handleAnimationLoaded = useCallback(() => {
      setIsLoading(false);
    }, []);

    // Add resize observer to update container dimensions
    useEffect(() => {
      if (!containerRef.current) return;

      const updateSize = () => {
        if (containerRef.current) {
          const { width, height } =
            containerRef.current.getBoundingClientRect();
          setContainerSize({ width, height });
        }
      };

      // Initial size calculation
      updateSize();

      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, []);

    return (
      <motion.div
        key={currentStep.id}
        className="absolute inset-0 flex items-center justify-center"
        custom={direction}
        variants={carouselVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.45,
          ease: "easeInOut",
        }}
      >
        {currentStep.animationData ? (
          <div
            ref={containerRef}
            className="w-full h-full relative flex items-center justify-center"
          >
            {/* Improved container sizing for mobile */}
            <div
              className={`
              ${isMobile ? "w-[80%] aspect-square mx-auto" : "w-[85%] h-[85%]"}
            `}
            >
              <Lottie
                animationData={currentStep.animationData}
                loop
                autoplay
                lottieRef={lottieRef}
                onDOMLoaded={handleAnimationLoaded}
                onDataReady={handleAnimationLoaded}
                className="w-full h-full"
                renderer="svg"
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid meet",
                  progressiveLoad: true,
                }}
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                key={`${currentStep.id}-${containerSize.width}-${containerSize.height}`}
              />
            </div>
            {isLoading && <LoadingIndicator />}
          </div>
        ) : (
          <div className="text-white text-center" aria-live="polite">
            No animation available for this step
          </div>
        )}
      </motion.div>
    );
  }
);

export interface HowSectionCarouselProps {
  id: string;
  title: string;
  steps: StepWithData[];
}

const HowSectionCarousel: React.FC<HowSectionCarouselProps> = memo(
  function HowSectionCarousel({ id, title, steps }) {
    const isMobile = useIsMobile();
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [scrollLocked, setScrollLocked] = useState(false);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [allowSectionTransition, setAllowSectionTransition] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    // Touch state
    const touchState = useRef({
      startY: 0,
      isTouching: false,
      lastScrollTime: 0,
    });

    const spacerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const swipeAreaRef = useRef<HTMLDivElement>(null);

    // Calculate dimensions - slightly smaller for better transitions between sections
    const wrapperHeight = isMobile
      ? `${steps.length * 95}vh` // Reduced from 100vh to 95vh for better section transitions
      : `${steps.length * 95}vh`;

    // Hide instructions after delay
    useEffect(() => {
      if (!showInstructions) return;

      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, INSTRUCTION_HIDE_DELAY);

      return () => clearTimeout(timer);
    }, [showInstructions]);

    // Update edge state flags when active index changes
    useEffect(() => {
      setIsAtStart(activeIndex === 0);
      setIsAtEnd(activeIndex === steps.length - 1);

      // If we're at the end or start, allow section transition after a short delay
      if (activeIndex === 0 || activeIndex === steps.length - 1) {
        const timer = setTimeout(() => {
          setAllowSectionTransition(true);
        }, SECTION_TRANSITION_DELAY);
        return () => clearTimeout(timer);
      } else {
        setAllowSectionTransition(false);
      }
    }, [activeIndex, steps.length]);

    // InView detection with adjusted threshold for better section transitions
    const inView = useInView(spacerRef, {
      margin: "-35% 0px", // Adjusted from -40% to -35% for smoother section transitions
    });

    // Scroll progress tracking
    const { scrollYProgress } = useScroll({
      target: spacerRef,
      offset: ["start 65%", "end start"], // Adjusted offsets for better section transitions
    });

    // Handle navigation click
    const handleNavItemClick = useCallback(
      (index: number) => {
        if (scrollLocked) return;
        setScrollLocked(true);
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);

        // Release scroll lock after animation completes
        setTimeout(() => setScrollLocked(false), 500);
      },
      [activeIndex, scrollLocked]
    );

    // Update active index based on scroll position
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      if (steps.length > 0 && !scrollLocked) {
        // Handle edge cases for section transitions
        if (latest >= 0.95 && !isAtEnd) {
          // Almost at end of section - go to last item
          setDirection(1);
          setActiveIndex(steps.length - 1);
        } else if (latest <= 0.05 && !isAtStart) {
          // Almost at start of section - go to first item
          setDirection(-1);
          setActiveIndex(0);
        } else {
          // Normal scrolling within section
          const newIndex = Math.min(
            Math.floor(latest * steps.length + 0.5),
            steps.length - 1
          );
          if (newIndex !== activeIndex) {
            setDirection(newIndex > activeIndex ? 1 : -1);
            setActiveIndex(newIndex);
          }
        }
      }
    });

    // Set up touch and wheel event handlers
    useEffect(() => {
      if (!inView || !steps.length) return;

      const element = swipeAreaRef.current || containerRef.current;
      if (!element) return;

      const changeSlide = (delta: number) => {
        const now = Date.now();
        if (scrollLocked) return false;

        // If at edges and section transition is allowed, don't intercept the scroll
        if (
          (isAtEnd && delta > 0 && allowSectionTransition) ||
          (isAtStart && delta < 0 && allowSectionTransition)
        ) {
          return false; // Allow browser to handle the scroll to next/prev section
        }

        if (now - touchState.current.lastScrollTime > SCROLL_THROTTLE_TIME) {
          if (delta > 0 && activeIndex < steps.length - 1) {
            setScrollLocked(true);
            setDirection(1);
            setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
            setTimeout(() => setScrollLocked(false), 500);
            return true;
          } else if (delta < 0 && activeIndex > 0) {
            setScrollLocked(true);
            setDirection(-1);
            setActiveIndex((prev) => Math.max(prev - 1, 0));
            setTimeout(() => setScrollLocked(false), 500);
            return true;
          } else {
            return false;
          }
        }
        return false;
      };

      const handleTouchStart = (e: TouchEvent) => {
        touchState.current.startY = e.touches[0].clientY;
        touchState.current.isTouching = true;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!touchState.current.isTouching) return;

        const touchY = e.touches[0].clientY;
        const diff = touchState.current.startY - touchY;

        // Don't prevent default at section boundaries when allowed to transition
        if (
          (isAtEnd && diff > 0 && allowSectionTransition) ||
          (isAtStart && diff < 0 && allowSectionTransition)
        ) {
          return; // Allow native scroll behavior
        }

        if (Math.abs(diff) > 40) {
          const changed = changeSlide(diff);
          if (changed) {
            touchState.current.startY = touchY;
            e.preventDefault();
          }
        }
      };

      const handleTouchEnd = () => {
        touchState.current.isTouching = false;
      };

      const handleWheel = (e: WheelEvent) => {
        // Allow scroll passthrough at section boundaries
        if (
          (isAtEnd && e.deltaY > 0 && allowSectionTransition) ||
          (isAtStart && e.deltaY < 0 && allowSectionTransition)
        ) {
          return; // Let the browser handle scrolling to next/prev section
        }

        // Only handle significant wheel movements
        if (Math.abs(e.deltaY) > 20) {
          if (changeSlide(e.deltaY)) {
            e.preventDefault();
          }
        }
      };

      // Add event listeners
      element.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      element.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      element.addEventListener("touchend", handleTouchEnd);
      element.addEventListener("wheel", handleWheel, { passive: false });

      // Clean up
      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
        element.removeEventListener("wheel", handleWheel);
      };
    }, [
      inView,
      activeIndex,
      steps.length,
      scrollLocked,
      isAtEnd,
      isAtStart,
      allowSectionTransition,
    ]);

    if (!steps.length) {
      return null;
    }

    const currentStep = steps[activeIndex] || steps[0];

    // Helper function to determine adaptive heights based on device
    const getAdaptiveHeights = () => {
      if (isMobile) {
        return {
          contentHeight: "h-[60vh]",
          navHeight: "h-[25vh]",
          instructionPosition: "bottom-4",
          sectionIndicatorPosition: "top-4",
        };
      }

      // For desktop devices
      return {
        contentHeight: "h-[100vh]",
        navHeight: "",
        instructionPosition: "bottom-6",
        sectionIndicatorPosition: "top-6",
      };
    };

    const adaptiveHeights = getAdaptiveHeights();

    return (
      <section
        id={id}
        className="relative w-full text-white"
        style={{ height: wrapperHeight }}
        ref={spacerRef}
      >
        {inView && (
          <motion.div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-screen overflow-hidden"
            style={{
              opacity: 1,
              willChange: "transform",
            }}
          >
            <div
              className={`${mainConfigs.SECTION_CONTAINER_CLASS} w-full h-full flex flex-col lg:grid lg:grid-cols-3 items-center gap-8`}
            >
              {/* Swipe/scroll overlay - only active when not at section boundaries */}
              <div
                ref={swipeAreaRef}
                className="absolute inset-0 z-10"
                aria-hidden="true"
              />

              {/* Navigation indicators - positioned at top for mobile */}
              {(isAtEnd || isAtStart) && allowSectionTransition && (
                <motion.div
                  className={`fixed ${adaptiveHeights.sectionIndicatorPosition} left-0 right-0 flex justify-center z-30 pointer-events-none`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-xs bg-black/50 text-white/90 text-center px-3 py-1 rounded-full">
                    {isAtEnd
                      ? "Continue scrolling for next section"
                      : "Continue scrolling for previous section"}
                  </div>
                </motion.div>
              )}

              {/* LEFT: Carousel Content */}
              <div className="order-1 w-full lg:col-span-2 flex items-center justify-center">
                <div
                  className={`
                  relative w-full 
                  ${adaptiveHeights.contentHeight}
                  flex items-center justify-center
                `}
                >
                  <AnimatePresence mode="wait" custom={direction}>
                    <CarouselContent
                      currentStep={currentStep}
                      direction={direction}
                      isMobile={isMobile}
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT: Navigation */}
              <div
                className={`
                  order-2 w-full lg:col-span-1 
                  flex items-center justify-center 
                  ${isMobile ? "mt-0" : "mt-0"} ${adaptiveHeights.navHeight}
                `}
                style={{ pointerEvents: "auto" }}
              >
                <CarouselNav
                  title={title}
                  steps={steps}
                  activeIndex={activeIndex}
                  onNavItemClick={handleNavItemClick}
                />
              </div>

              {/* Navigation instructions - moved to bottom with adjustable positioning */}
              {showInstructions && (
                <motion.div
                  className={`fixed ${adaptiveHeights.instructionPosition} left-0 right-0 flex justify-center z-20 pointer-events-none`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                >
                  <div className="text-xs bg-black/50 text-white/90 text-center px-3 py-1 rounded-full">
                    {isMobile
                      ? "Swipe up/down to navigate"
                      : "Scroll to navigate"}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </section>
    );
  }
);

export default HowSectionCarousel;
