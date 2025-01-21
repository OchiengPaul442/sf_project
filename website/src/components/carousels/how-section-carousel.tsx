"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, AnimatePresence, useSpring } from "framer-motion";
import Lottie from "lottie-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import BoatAnimation from "@/public/lottie/sailing_boat_2.json";
import PaperAnimation from "@/public/lottie/paper_flying.json";
import MarkerAnimation from "@/public/lottie/mark_json.json";
import SpagAnimation from "@/public/lottie/spag_json.json";
import DataAnimation from "@/public/lottie/data.json";

interface Step {
  id: string;
  title: string;
}

const STEPS: Step[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud Eliminated" },
];

const lottieAnimations: Record<string, object> = {
  "smooth-onboarding": BoatAnimation,
  "data-integrity": PaperAnimation,
  "managed-consumables": SpagAnimation,
  "recipe-adherence": MarkerAnimation,
  "fraud-eliminated": DataAnimation,
};

const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
    zIndex: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 80 : -80,
    opacity: 0,
    zIndex: 0,
  }),
};

export const HowSectionCarousel = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.4,
  });
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  useEffect(() => {
    if (isManualScrolling) return;

    const unsubscribe = smoothScrollProgress.on("change", (latest) => {
      const clampedValue = Math.max(0, Math.min(1, latest));
      const stepIndex = Math.floor(clampedValue * STEPS.length);
      const validIndex = Math.min(stepIndex, STEPS.length - 1);

      if (validIndex !== selectedStepIndex) {
        setDirection(validIndex > selectedStepIndex ? 1 : -1);
        setSelectedStepIndex(validIndex);
      }
    });

    return () => unsubscribe();
  }, [isManualScrolling, selectedStepIndex, smoothScrollProgress]);

  const checkShouldPin = useCallback(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const shouldBeFixed = rect.top <= 0 && rect.bottom >= windowHeight;

    setIsFixed(shouldBeFixed);
  }, [sectionRef]);

  useEffect(() => {
    checkShouldPin();
    window.addEventListener("scroll", checkShouldPin, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkShouldPin);
    };
  }, [checkShouldPin]);

  const handleNavClick = (stepId: string) => {
    const index = STEPS.findIndex((s) => s.id === stepId);
    if (index === -1 || index === selectedStepIndex) return;

    setDirection(index > selectedStepIndex ? 1 : -1);
    setSelectedStepIndex(index);
    setIsManualScrolling(true);

    if (sectionRef.current) {
      const fraction = index / (STEPS.length - 1);
      const sectionTop = sectionRef.current.offsetTop;
      const totalScrollHeight = window.innerHeight * 2.5;
      const targetScrollY = sectionTop + fraction * totalScrollHeight;

      window.scrollTo({ top: targetScrollY, behavior: "smooth" });

      setTimeout(() => {
        setIsManualScrolling(false);
      }, 700);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative h-[200vh] bg-black overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      id="how-section"
    >
      <motion.div
        ref={contentRef}
        className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center absolute left-1/2 transform -translate-x-1/2"
        style={{
          position: isFixed ? "fixed" : "absolute",
          top: isFixed ? "50%" : "0",
          transform: isFixed ? "translate(-50%, -50%)" : "translate(-50%, 0)",
        }}
      >
        <div className="relative w-full lg:w-1/2">
          <div
            className="absolute left-2 sm:left-5 top-0 w-[1px] sm:w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent"
            aria-hidden="true"
          />
          <nav
            className="space-y-6 sm:space-y-8 lg:space-y-12 relative"
            aria-label="Section Navigation"
          >
            {STEPS.map((step, index) => {
              const isActive = selectedStepIndex === index;
              return (
                <motion.div
                  key={step.id}
                  className="relative cursor-pointer"
                  onClick={() => handleNavClick(step.id)}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative pl-6 sm:pl-12">
                    <motion.div
                      className="absolute left-1 sm:left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full"
                      style={{
                        backgroundColor: isActive ? "#fff" : "transparent",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                      animate={{
                        scale: isActive ? 1 : 0.8,
                        opacity: isActive ? 1 : 0.5,
                      }}
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
            })}
          </nav>
        </div>

        <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={STEPS[selectedStepIndex].id}
              className="absolute inset-0 flex items-center justify-center"
              custom={direction}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[400px] sm:max-h-[400px] md:max-w-[500px] md:max-h-[500px]">
                <Lottie
                  animationData={lottieAnimations[STEPS[selectedStepIndex].id]}
                  loop
                  autoplay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
