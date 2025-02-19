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
import { useIsMobile } from "@/hooks/useIsMobile";

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
// HowSectionCarousel Component with Enhanced Mobile Behavior
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
    const isMobile = useIsMobile();
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    // Refs for the spacer element and carousel container.
    const spacerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // We'll store the spacer's top offset and its "effective height" (spacer height minus window.innerHeight)
    // in this ref.
    const spacerMetrics = useRef({ top: 0, effectiveHeight: 0 });

    // --- DESKTOP: Use Framer Motion's useScroll on containerRef ---
    const { scrollYProgress } = useScroll({ container: containerRef });
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      if (!isMobile) {
        if (latest < 0.005 || latest > 0.995) return;
        const segment = 1 / steps.length;
        const newIndex = Math.min(
          steps.length - 1,
          Math.floor(latest / segment)
        );
        if (newIndex !== activeIndex) {
          setDirection(newIndex > activeIndex ? 1 : -1);
          setActiveIndex(newIndex);
        }
      }
    });

    // --- MOBILE: Update spacer metrics and listen to window scroll ---
    useEffect(() => {
      if (!isMobile || !spacerRef.current) return;

      const updateSpacerMetrics = () => {
        const rect = spacerRef.current!.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const height = rect.height;
        // The effective height is the region during which the carousel remains fixed.
        const effHeight = Math.max(0, height - window.innerHeight);
        spacerMetrics.current = { top, effectiveHeight: effHeight };
      };

      updateSpacerMetrics();
      window.addEventListener("resize", updateSpacerMetrics);

      const onScroll = () => {
        const { top, effectiveHeight: effHeight } = spacerMetrics.current;
        const scrollY = window.scrollY;
        // While within the carousel region, keep it fixed.
        if (scrollY >= top && scrollY < top + effHeight) {
          setIsFixed(true);
          const progress = effHeight > 0 ? (scrollY - top) / effHeight : 0;
          const newIndex = Math.min(
            steps.length - 1,
            Math.floor(progress * steps.length)
          );
          if (newIndex !== activeIndex) {
            setDirection(newIndex > activeIndex ? 1 : -1);
            setActiveIndex(newIndex);
          }
        } else {
          setIsFixed(false);
          // When scrolling above the region.
          if (scrollY < top && activeIndex === 0 && onExitCarousel) {
            onExitCarousel("up");
          }
          // When scrolling below the region.
          if (
            scrollY >= top + effHeight &&
            activeIndex === steps.length - 1 &&
            onExitCarousel
          ) {
            onExitCarousel("down");
          }
        }
      };

      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", updateSpacerMetrics);
      };
    }, [isMobile, activeIndex, steps.length, onExitCarousel]);

    // --- Animation Load State ---
    useEffect(() => {
      setAnimationLoaded(false);
    }, [activeIndex]);

    useEffect(() => {
      const timer = setTimeout(() => setAnimationLoaded(true), 500);
      return () => clearTimeout(timer);
    }, [activeIndex]);

    // --- DESKTOP Custom Wheel & Touch Handlers ---
    const wheelDeltaAccumulator = useRef(0);
    const wheelThreshold = 40;
    const handleWheel = useCallback(
      (e: WheelEvent) => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const atTop = scrollTop < 10;
        const atBottom = scrollTop > scrollHeight - clientHeight - 10;
        if (activeIndex === 0 && e.deltaY < 0 && atTop) {
          if (onExitCarousel) {
            onExitCarousel("up");
          }
          wheelDeltaAccumulator.current = 0;
          return;
        }
        if (activeIndex === steps.length - 1 && e.deltaY > 0 && atBottom) {
          if (onExitCarousel) {
            onExitCarousel("down");
          }
          wheelDeltaAccumulator.current = 0;
          return;
        }
        wheelDeltaAccumulator.current += e.deltaY;
        if (wheelDeltaAccumulator.current > wheelThreshold) {
          if (activeIndex < steps.length - 1) {
            setDirection(1);
            setActiveIndex((prev) => prev + 1);
          }
          wheelDeltaAccumulator.current = 0;
          e.preventDefault();
          e.stopPropagation();
        } else if (wheelDeltaAccumulator.current < -wheelThreshold) {
          if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex((prev) => prev - 1);
          }
          wheelDeltaAccumulator.current = 0;
          e.preventDefault();
          e.stopPropagation();
        }
      },
      [activeIndex, steps.length, onExitCarousel]
    );

    const touchStartY = useRef<number | null>(null);
    const handleTouchStart = useCallback((e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback(
      (e: TouchEvent) => {
        if (touchStartY.current === null) return;
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        const swipeThreshold = 30;
        if (Math.abs(deltaY) < swipeThreshold) {
          touchStartY.current = null;
          return;
        }
        if (deltaY < 0 && activeIndex === 0) {
          if (onExitCarousel) {
            onExitCarousel("up");
          }
          touchStartY.current = null;
          return;
        }
        if (deltaY > 0 && activeIndex === steps.length - 1) {
          if (onExitCarousel) {
            onExitCarousel("down");
          }
          touchStartY.current = null;
          return;
        }
        if (deltaY > 0 && activeIndex < steps.length - 1) {
          setDirection(1);
          setActiveIndex((prev) => prev + 1);
        } else if (deltaY < 0 && activeIndex > 0) {
          setDirection(-1);
          setActiveIndex((prev) => prev - 1);
        }
        touchStartY.current = null;
      },
      [activeIndex, steps.length, onExitCarousel]
    );

    useEffect(() => {
      if (isMobile) return;
      const container = containerRef.current;
      if (!container) return;
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }, [handleWheel, handleTouchStart, handleTouchEnd, isMobile]);

    // --- Manual Navigation via Nav Items ---
    const handleNavItemClick = (index: number) => {
      if (isMobile) {
        if (spacerRef.current) {
          const { top, effectiveHeight } = spacerMetrics.current;
          const targetScroll = top + (effectiveHeight * index) / steps.length;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      } else {
        if (!containerRef.current) return;
        if (index === activeIndex) return;
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
        const scrollableHeight =
          containerRef.current.scrollHeight - containerRef.current.clientHeight;
        const targetScroll = (scrollableHeight * index) / steps.length;
        containerRef.current.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    };

    const currentStep = steps[activeIndex] || steps[0];

    return (
      <section id={id} className="relative snap-start">
        {/* Spacer Element: Reserves vertical space for mobile */}
        <div
          ref={spacerRef}
          className="w-full"
          style={{ height: isMobile ? "200vh" : "auto" }}
        />

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className={`w-full overflow-y-auto ${
            isMobile ? "absolute inset-0" : ""
          }`}
          style={{
            scrollBehavior: "smooth",
            touchAction: isMobile ? "pan-y" : "none",
          }}
        >
          <div
            className={
              isMobile
                ? isFixed
                  ? "fixed top-0 left-0 right-0 z-50"
                  : "relative"
                : "sticky top-[150px]"
            }
          >
            <div
              className={`${mainConfigs.SECTION_CONTAINER_CLASS} flex flex-col lg:grid lg:grid-cols-3 items-center gap-8 w-full`}
            >
              {/* Carousel Content */}
              <div className="order-1 w-full lg:col-span-2 flex items-center justify-center">
                <div className="relative w-full h-[50vh] lg:h-[100vh] overflow-hidden flex items-center justify-center">
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
                        <div className="w-full h-full relative flex items-center justify-center">
                          <div className="w-[90%] h-[90%] lg:w-[85%] lg:h-[85%] mx-auto">
                            <Lottie
                              animationData={currentStep.animationData}
                              loop
                              autoplay
                              lottieRef={lottieRef}
                              onDOMLoaded={() => setAnimationLoaded(true)}
                              onDataReady={() => setAnimationLoaded(true)}
                              className="w-full h-full"
                              renderer={isMobile ? ("canvas" as any) : "svg"}
                              rendererSettings={{
                                preserveAspectRatio: "xMidYMid meet",
                                progressiveLoad: isMobile ? false : true,
                              }}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
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
              {/* Navigation */}
              <div className="order-2 w-full lg:col-span-1 flex items-center justify-center mt-6 lg:mt-0">
                <CarouselNav
                  title={title}
                  steps={steps}
                  activeIndex={activeIndex}
                  onNavItemClick={handleNavItemClick}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default HowSectionCarousel;
