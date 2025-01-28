"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamically import Lottie for animations
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

// Step interface with preloaded animationData
interface StepWithData {
  id: string;
  title: string;
  animationData: any; // Replace 'any' with the appropriate type if available
}

// Props for HowSectionCarousel to receive callbacks and preloaded steps
interface HowSectionCarouselProps {
  steps: StepWithData[];
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
}

// Animation variants for carousel transitions
const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

// Navigation Item Component
const NavItem = memo(function NavItem({
  step,
  isActive,
  onClick,
}: {
  step: StepWithData;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative pl-6 sm:pl-12">
        <motion.div
          className={`absolute left-1 sm:left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
            isActive ? "bg-white" : "border border-white/30"
          }`}
          animate={{ scale: isActive ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        />
        <span
          className={`font-light tracking-wide ${
            isActive
              ? "text-white text-base sm:text-xl md:text-2xl lg:text-3xl"
              : "text-zinc-200 text-sm sm:text-base md:text-lg lg:text-xl"
          }`}
        >
          {step.title}
        </span>
      </div>
    </motion.div>
  );
});

// Debounce hook to manage scroll events
const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFunction;
};

const HowSectionCarousel: React.FC<HowSectionCarouselProps> = memo(
  function HowSectionCarousel({ steps, onScrollPastStart, onScrollPastEnd }) {
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const isVisibleRef = useRef(true);

    const currentStep = steps[selectedStepIndex];

    // Intersection Observer to pause/play the animation when not visible
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          if (lottieRef.current?.animationItem) {
            if (entry.isIntersecting) {
              lottieRef.current.animationItem.play();
            } else {
              lottieRef.current.animationItem.pause();
            }
          }
        },
        { threshold: 0.1 }
      );

      const element = document.getElementById("how-section-carousel");
      if (element) {
        observer.observe(element);
        return () => observer.unobserve(element);
      }
    }, []);

    // Handle wheel scrolling inside the carousel with debouncing
    const debouncedHandleWheel = useDebouncedCallback(
      (e: WheelEvent) => {
        const threshold = 30;
        if (Math.abs(e.deltaY) < threshold) return; // Ignore small scrolls

        // Scroll Down
        if (e.deltaY > 0) {
          if (selectedStepIndex < steps.length - 1) {
            // Move to next step
            e.preventDefault(); // Prevent parent from snapping
            setDirection(1);
            setSelectedStepIndex((prev) => prev + 1);
          } else {
            // Last step: allow parent to handle scrolling to next section
            if (onScrollPastEnd) {
              onScrollPastEnd();
            }
          }
        } else {
          // Scroll Up
          if (selectedStepIndex > 0) {
            // Move to previous step
            e.preventDefault(); // Prevent parent from snapping
            setDirection(-1);
            setSelectedStepIndex((prev) => prev - 1);
          } else {
            // First step: allow parent to handle scrolling to previous section
            if (onScrollPastStart) {
              onScrollPastStart();
            }
          }
        }
      },
      100 // Debounce delay in ms
    );

    // Attach wheel event listener with debouncing
    useEffect(() => {
      const carouselElement = document.getElementById("how-section-carousel");
      if (!carouselElement) return;

      const handleWheel = (e: WheelEvent) => {
        debouncedHandleWheel(e);
      };

      carouselElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        carouselElement.removeEventListener("wheel", handleWheel);
      };
    }, [debouncedHandleWheel]);

    // Navigation click handler
    const handleNavClick = useCallback(
      (index: number) => {
        if (index !== selectedStepIndex) {
          setDirection(index > selectedStepIndex ? 1 : -1);
          setSelectedStepIndex(index);
        }
      },
      [selectedStepIndex]
    );

    return (
      <section
        id="how-section-carousel"
        className="relative w-full h-full bg-black overflow-hidden snap-start"
      >
        {/* Centered container for the carousel content */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Navigation */}
            <div className="relative w-full lg:w-1/2">
              <div className="absolute left-2 sm:left-5 top-0 w-[1px] sm:w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent" />
              <nav className="space-y-6 sm:space-y-8 lg:space-y-12">
                {steps.map((step, index) => (
                  <NavItem
                    key={step.id}
                    step={step}
                    isActive={selectedStepIndex === index}
                    onClick={() => handleNavClick(index)}
                  />
                ))}
              </nav>
            </div>

            {/* Animation Container */}
            <div className="relative w-full lg:w-1/2 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
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
                    <div className="w-full h-full flex items-center justify-center">
                      <Lottie
                        animationData={currentStep.animationData}
                        loop={true}
                        autoplay={true}
                        lottieRef={lottieRef}
                        className="w-full h-full"
                        rendererSettings={{
                          preserveAspectRatio: "xMidYMid meet",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-red-500">Failed to load animation</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

export default HowSectionCarousel;
