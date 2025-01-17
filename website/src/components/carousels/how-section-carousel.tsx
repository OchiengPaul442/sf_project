"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, AnimatePresence, useSpring } from "framer-motion";

import BoatAnimation from "../../lib/lottie/sailing_boat_2.json";
import PaperAnimation from "../../lib/lottie/paper_flying.json";
import MarkerAnimation from "../../lib/lottie/mark_json.json";
import SpagAnimation from "../../lib/lottie/spag_json.json";
import DataAnimation from "../../lib/lottie/data.json";
import Lottie from "lottie-react";

/* ---------------------------------- Data ---------------------------------- */
interface Step {
  id: string;
  title: string;
}

// List of steps displayed in the carousel
const STEPS: Step[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud Eliminated" },
];

// Maps each step to its corresponding Lottie animation
const lottieAnimations: Record<string, object> = {
  "smooth-onboarding": BoatAnimation,
  "data-integrity": PaperAnimation,
  "managed-consumables": SpagAnimation,
  "recipe-adherence": MarkerAnimation,
  "fraud-eliminated": DataAnimation,
};

/* -------------------------------- Variants -------------------------------- */
// Vertical fade/slide: from below if moving forward, from above if moving backward
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
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Active step, pinned state, and direction (forward vs. backward)
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [direction, setDirection] = useState(0);

  // Temporarily disable scroll-based updates when user manually clicks a nav item
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // Track scroll progress over this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress for smoother transitions
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  /* --------------------- Sync step index with scroll position -------------------- */
  useEffect(() => {
    if (isManualScrolling) return; // Skip updates if user manually navigates

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

  /* --------------------- Pin/unpin the container while scrolling ------------------ */
  const checkShouldPin = useCallback(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const shouldBeFixed = rect.top <= 0 && rect.bottom >= windowHeight;

    setIsFixed(shouldBeFixed);
  }, []);

  useEffect(() => {
    checkShouldPin();
    window.addEventListener("scroll", checkShouldPin, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkShouldPin);
    };
  }, [checkShouldPin]);

  /* --------------------------- Navigation clicks (manual) -------------------------- */
  const handleNavClick = (stepId: string) => {
    const index = STEPS.findIndex((s) => s.id === stepId);
    if (index === -1 || index === selectedStepIndex) return;

    // Animate direction
    setDirection(index > selectedStepIndex ? 1 : -1);
    setSelectedStepIndex(index);

    // Disable scroll-based updates for a moment
    setIsManualScrolling(true);

    if (sectionRef.current) {
      // Calculate how far to scroll within the pinned section (250vh)
      const fraction = index / (STEPS.length - 1);
      const sectionTop = sectionRef.current.offsetTop;
      const totalScrollHeight = window.innerHeight * 2.5;
      const targetScrollY = sectionTop + fraction * totalScrollHeight;

      window.scrollTo({ top: targetScrollY, behavior: "smooth" });

      // Re-enable scroll sync after the animation is likely finished
      setTimeout(() => {
        setIsManualScrolling(false);
      }, 700);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] bg-black snap-start overflow-hidden"
      id="how-section"
    >
      {/* Container that becomes pinned in the middle of the viewport */}
      <motion.div
        ref={contentRef}
        className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center absolute left-1/2 transform -translate-x-1/2"
        style={{
          position: isFixed ? "fixed" : "absolute",
          top: isFixed ? "50%" : "0",
          transform: isFixed ? "translate(-50%, -50%)" : "translate(-50%, 0)",
        }}
      >
        {/* ------ Navigation Steps ------ */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-0 w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent"
            aria-hidden="true"
          />
          <nav className="space-y-12 relative" aria-label="Section Navigation">
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
                  <div className="relative pl-12">
                    {/* Dot */}
                    <motion.div
                      className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
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
                    {/* Title */}
                    <span
                      className={`font-light tracking-wide ${
                        isActive
                          ? "text-white text-xl md:text-3xl"
                          : "text-zinc-200 text-lg md:text-xl"
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

        {/* ------ Carousel Lottie Animation ------ */}
        <div className="relative h-80 sm:h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
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
              <div className=" w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
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
