"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useInView,
} from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import type { StepWithData } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";
import { useIsMobile } from "@/hooks/useIsMobile";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
    </div>
  ),
});

const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  }),
};

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
          <div className="flex items-center pl-6 sm:pl-12 whitespace-nowrap">
            <div
              className={`mr-2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                activeIndex === index ? "bg-white" : ""
              }`}
            />
            <span
              className={`font-light tracking-wide transition-all duration-300 ${
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
    const [animationLoaded, setAnimationLoaded] = useState(false);
    const [touchStartY, setTouchStartY] = useState(0);
    const [isTouching, setIsTouching] = useState(false);
    const [lastScrollTime, setLastScrollTime] = useState(0);

    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const spacerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const swipeAreaRef = useRef<HTMLDivElement>(null);

    // Increase the scrollable area based on the number of steps
    const wrapperHeight = `${(steps.length + 2) * 100}vh`;

    // Use an inView threshold to trigger the fixed container earlier/later as needed
    const inView = useInView(spacerRef, { margin: "-30% 0px" });

    const { scrollYProgress } = useScroll({
      target: spacerRef,
      offset: ["start start", "end start"],
    });

    // Create a custom container opacity: fade in at the start and fade out at the end
    const containerOpacity = useTransform(scrollYProgress, (v) => {
      if (v < 0.1) return v / 0.1;
      if (v > 0.9) return (1 - v) / 0.1;
      return 1;
    });

    // Handle scroll for all devices
    const handleScroll = (newIndex: number) => {
      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < steps.length
      ) {
        setDirection(newIndex > activeIndex ? 1 : -1);
        setActiveIndex(newIndex);
      }
    };

    // Update the active index based on scroll progress
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      if (steps.length > 0) {
        // Multiply scroll progress by steps count
        const newIndex = Math.floor(latest * steps.length);
        handleScroll(newIndex);
      }
    });

    // Mobile touch and scroll handling
    useEffect(() => {
      if (inView) {
        const element = swipeAreaRef.current || containerRef.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
          setTouchStartY(e.touches[0].clientY);
          setIsTouching(true);
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (!isTouching) return;

          const touchY = e.touches[0].clientY;
          const diff = touchStartY - touchY;

          // Threshold to register a swipe
          if (Math.abs(diff) > 50) {
            // Throttle navigation to prevent rapid changes
            const now = Date.now();
            if (now - lastScrollTime > 300) {
              if (diff > 0 && activeIndex < steps.length - 1) {
                // Swipe up - go to next
                setDirection(1);
                setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
              } else if (diff < 0 && activeIndex > 0) {
                // Swipe down - go to previous
                setDirection(-1);
                setActiveIndex((prev) => Math.max(prev - 1, 0));
              }

              setLastScrollTime(now);
              setTouchStartY(touchY);
            }

            // Prevent default scroll behavior
            e.preventDefault();
          }
        };

        const handleTouchEnd = () => {
          setIsTouching(false);
        };

        // Add wheel event for mousewheel/trackpad scrolling on all devices
        const handleWheel = (e: WheelEvent) => {
          if (inView) {
            // Throttle scroll events
            const now = Date.now();
            if (now - lastScrollTime > 300) {
              if (e.deltaY > 0 && activeIndex < steps.length - 1) {
                // Scroll down - go to next
                setDirection(1);
                setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
                e.preventDefault();
              } else if (e.deltaY < 0 && activeIndex > 0) {
                // Scroll up - go to previous
                setDirection(-1);
                setActiveIndex((prev) => Math.max(prev - 1, 0));
                e.preventDefault();
              }
              setLastScrollTime(now);
            }
          }
        };

        element.addEventListener("touchstart", handleTouchStart, {
          passive: false,
        });
        element.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        element.addEventListener("touchend", handleTouchEnd);
        element.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
          element.removeEventListener("touchstart", handleTouchStart);
          element.removeEventListener("touchmove", handleTouchMove);
          element.removeEventListener("touchend", handleTouchEnd);
          element.removeEventListener("wheel", handleWheel);
        };
      }
    }, [
      inView,
      activeIndex,
      steps.length,
      lastScrollTime,
      isTouching,
      touchStartY,
    ]);

    // Reset animation state when activeIndex changes
    useEffect(() => {
      setAnimationLoaded(false);
    }, [activeIndex]);

    useEffect(() => {
      const timer = setTimeout(() => setAnimationLoaded(true), 500);
      return () => clearTimeout(timer);
    }, [activeIndex]);

    const handleNavItemClick = (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    };

    // If there are no steps, return null
    if (!steps.length) {
      return null;
    }

    const currentStep = steps[activeIndex] || steps[0];

    return (
      <section
        id={id}
        className="relative w-full bg-black text-white"
        style={{ height: wrapperHeight }}
        ref={spacerRef}
      >
        {inView && (
          <motion.div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-screen overflow-hidden"
            style={{
              opacity: containerOpacity,
              willChange: "opacity, transform",
            }}
          >
            <div
              className={`${mainConfigs.SECTION_CONTAINER_CLASS} w-full h-full flex flex-col lg:grid lg:grid-cols-3 items-center gap-8`}
            >
              {/* Swipe/scroll area overlay for all devices */}
              <div
                ref={swipeAreaRef}
                className="absolute inset-0 z-10"
                aria-hidden="true"
              />

              {/* LEFT: Carousel content */}
              <div className="order-1 w-full lg:col-span-2 flex items-center justify-center">
                <div className="relative w-full h-[50vh] lg:h-[100vh] flex items-center justify-center">
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
                                progressiveLoad: !isMobile,
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
              {/* RIGHT: Navigation */}
              <div className="order-2 w-full lg:col-span-1 flex items-center justify-center mt-6 lg:mt-0">
                <CarouselNav
                  title={title}
                  steps={steps}
                  activeIndex={activeIndex}
                  onNavItemClick={handleNavItemClick}
                />
              </div>

              {/* Navigation indicators for all devices */}
              <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
                {/* Scroll/swipe instructions (shows briefly on mobile) */}
                <motion.div
                  className="absolute bottom-3 text-xs text-white/70 text-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 3, duration: 1 }}
                >
                  {isMobile
                    ? "Swipe up/down to navigate"
                    : "Scroll to navigate"}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    );
  }
);

export default HowSectionCarousel;
