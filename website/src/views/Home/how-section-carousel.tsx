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
  center: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
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

    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const spacerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Outer wrapper for 5 items, ~350vh
    const wrapperHeight = isMobile ? "300vh" : "350vh";

    // Only render fixed container when in view
    const inView = useInView(spacerRef);

    const { scrollYProgress } = useScroll({
      target: spacerRef,
      offset: ["start start", "end start"],
    });

    // Fade out from 80% → 100%
    const containerOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

    // On desktop, update activeIndex based on scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      if (!isMobile) {
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
            style={{ opacity: containerOpacity }}
          >
            <div
              className={`${mainConfigs.SECTION_CONTAINER_CLASS} w-full h-full flex flex-col lg:grid lg:grid-cols-3 items-center gap-8`}
            >
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
              {/* RIGHT: Nav */}
              <div className="order-2 w-full lg:col-span-1 flex items-center justify-center mt-6 lg:mt-0">
                <CarouselNav
                  title={title}
                  steps={steps}
                  activeIndex={activeIndex}
                  onNavItemClick={handleNavItemClick}
                />
              </div>
            </div>
          </motion.div>
        )}
      </section>
    );
  }
);

export default HowSectionCarousel;
