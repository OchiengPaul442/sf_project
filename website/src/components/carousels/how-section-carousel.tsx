"use client";

import type React from "react";
import { useState, useRef, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import type { StepWithData } from "@/utils/types/section";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

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
  );
});

const HowSectionCarousel: React.FC<StepWithData> = memo(
  function HowSectionCarousel({ id, title, steps }) {
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const isVisibleRef = useRef(true);

    const currentStep = steps?.[selectedStepIndex];

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

      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        return () => observer.unobserve(element);
      }
    }, [id]);

    const handleNavClick = useCallback(
      (index: number) => {
        if (index !== selectedStepIndex) {
          setDirection(index > selectedStepIndex ? 1 : -1);
          setSelectedStepIndex(index);
        }
      },
      [selectedStepIndex]
    );

    if (!steps || steps.length === 0) {
      return null;
    }

    return (
      <section
        id={id}
        className="relative w-full h-full bg-black overflow-hidden snap-start"
        aria-label={title}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between">
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
                    isActive={selectedStepIndex === index}
                    onClick={() => handleNavClick(index)}
                  />
                ))}
              </nav>
            </div>

            <div className="relative w-full lg:w-[55%] h-[40vh] lg:h-[60vh] xl:h-[70vh]">
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
                            loop={true}
                            autoplay={true}
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
