// views/Home/how-section-carousel.tsx
"use client";

import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import type { StepWithData } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";

// Dynamically load Lottie.
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

export interface HowSectionCarouselProps {
  id: string;
  title: string;
  steps: StepWithData[];
  scrollLockControls?: { lockScroll: () => void; unlockScroll: () => void };
}

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

const NavItem: React.FC<{
  step: StepWithData;
  isActive: boolean;
  onClick: () => void;
}> = memo(({ step, isActive, onClick }) => (
  <motion.button
    className="relative cursor-pointer focus:outline-none w-full text-left"
    onClick={onClick}
    initial={false}
    animate={{ opacity: isActive ? 1 : 0.5 }}
    transition={{ duration: 0.3 }}
    aria-pressed={isActive}
    aria-label={step.title}
  >
    <div className="relative pl-6 sm:pl-12">
      <motion.div
        className={`absolute left-[5px] sm:left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
          isActive ? "bg-white" : "border border-white/30"
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

const HowSectionCarousel: React.FC<HowSectionCarouselProps> = memo(
  function HowSectionCarousel({ id, title, steps, scrollLockControls }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
      if (scrollLockControls) {
        scrollLockControls.lockScroll();
      }
    }, [scrollLockControls]);

    const handleScroll = useCallback(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      const newProgress = Math.max(0, Math.min(1, -rect.top / totalScroll));
      const newIndex = Math.round(newProgress * (steps.length - 1));
      if (newIndex !== activeIndex) {
        setDirection(newIndex > activeIndex ? 1 : -1);
        setActiveIndex(newIndex);
      }
    }, [activeIndex, steps.length]);

    useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [handleScroll]);

    // Absolute centering container.
    const carouselPositionStyle: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
    };

    const currentStep = steps[activeIndex] || steps[0];

    return (
      <section
        id={id}
        ref={sectionRef}
        className="relative bg-black"
        style={{ minHeight: "300vh" }}
      >
        <div className="relative h-full">
          <div
            style={carouselPositionStyle}
            className={mainConfigs.SECTION_CONTAINER_CLASS}
          >
            <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Left Navigation */}
              <div className="relative w-full lg:w-[45%] py-6 lg:py-0">
                <div className="absolute left-2 sm:left-5 top-0 w-[1px] sm:w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent" />
                <nav
                  className="space-y-6 sm:space-y-8 lg:space-y-10"
                  aria-label={`${title} navigation`}
                >
                  {steps.map((step, index) => (
                    <NavItem
                      key={step.id}
                      step={step}
                      isActive={activeIndex === index}
                      onClick={() => {
                        if (!sectionRef.current) return;
                        const rect = sectionRef.current.getBoundingClientRect();
                        const totalScroll = rect.height - window.innerHeight;
                        const targetProgress = index / (steps.length - 1);
                        const sectionTop =
                          sectionRef.current.getBoundingClientRect().top +
                          window.pageYOffset;
                        const targetScroll =
                          sectionTop + targetProgress * totalScroll;
                        window.scrollTo({
                          top: targetScroll,
                          behavior: "smooth",
                        });
                      }}
                    />
                  ))}
                </nav>
              </div>
              {/* Carousel Content */}
              <div className="relative w-full lg:w-[55%] h-[40vh] lg:h-[60vh] xl:h-[70vh] flex items-center justify-center">
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
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full max-w-[90%] max-h-[90%] lg:max-w-[85%] lg:max-h-[85%]">
                            <Lottie
                              animationData={currentStep.animationData}
                              loop
                              autoplay
                              lottieRef={lottieRef}
                              className="w-full h-full"
                              renderer="svg"
                              rendererSettings={{
                                preserveAspectRatio: "xMidYMid meet",
                                progressiveLoad: true,
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </div>
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
      </section>
    );
  }
);

export default HowSectionCarousel;
