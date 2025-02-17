"use client";

import React, { useState, memo, useRef } from "react";
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

// ----------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------

export interface HowSectionCarouselProps {
  id: string;
  title: string;
  steps: StepWithData[];
}

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

// ----------------------------------------------------------------
// CarouselNav Component (wraps NavItems with the separator line)
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
    {/* Separator Line */}
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
          onClick={() => onNavItemClick(index)}
        />
      ))}
    </nav>
  </div>
);

// ----------------------------------------------------------------
// HowSectionCarousel Component
// ----------------------------------------------------------------

const HowSectionCarousel: React.FC<HowSectionCarouselProps> = memo(
  function HowSectionCarousel({ id, title, steps }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const handleNavItemClick = (index: number) => {
      if (index !== activeIndex) {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
      }
    };

    const currentStep = steps[activeIndex] || steps[0];

    return (
      <section
        id={id}
        className="min-h-screen bg-black flex items-center justify-center py-12"
      >
        <div
          className={`${mainConfigs.SECTION_CONTAINER_CLASS} flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl px-4`}
        >
          {/* Navigation with Separator */}
          <div className="w-full lg:w-1/3 flex items-center justify-center">
            <CarouselNav
              title={title}
              steps={steps}
              activeIndex={activeIndex}
              onNavItemClick={handleNavItemClick}
            />
          </div>

          {/* Carousel Content */}
          <div className="w-full lg:w-2/3 flex items-center justify-center">
            <div className="relative w-full h-[50vh] lg:h-[70vh]">
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
                      <div className="w-[90%] h-[90%] lg:w-[85%] lg:h-[85%]">
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
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-white text-center" aria-live="polite">
                      No animation available for this step
                    </div>
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
