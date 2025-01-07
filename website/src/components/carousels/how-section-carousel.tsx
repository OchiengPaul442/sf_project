"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, AnimatePresence, useSpring } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Ship from "@/public/images/Ship.png";
import Integrity from "@/public/images/Group 2.png";
import Tight from "@/public/images/Group 3.png";
import Recipe from "@/public/images/Group 4.png";
import Fraud from "@/public/images/Group 5.png";

/* ---------------------------------- Data ---------------------------------- */
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

const placeholderImages: Record<string, StaticImageData> = {
  "smooth-onboarding": Ship,
  "data-integrity": Integrity,
  "managed-consumables": Tight,
  "recipe-adherence": Recipe,
  "fraud-eliminated": Fraud,
};

/* -------------------------------- Variants -------------------------------- */
// Vertical slide + fade
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

  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [direction, setDirection] = useState(0);

  // Prevent scroll-based updates while user is manually clicking navigation
  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // Track scroll progress relative to the pinned section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth out scroll progress for fluid animations
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  /**
   * Sync the selected step index with the scroll position
   */
  useEffect(() => {
    if (isManualScrolling) return; // Skip if user is manually navigating

    const unsubscribe = smoothScrollProgress.on("change", (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      const stepIndex = Math.floor(clamped * STEPS.length);
      const validIndex = Math.min(stepIndex, STEPS.length - 1);

      // Update step index + direction only if there's an actual change
      if (validIndex !== selectedStepIndex) {
        setDirection(validIndex > selectedStepIndex ? 1 : -1);
        setSelectedStepIndex(validIndex);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isManualScrolling, smoothScrollProgress, selectedStepIndex]);

  /**
   * Pin/unpin the content as user scrolls through the section
   */
  const checkShouldPin = useCallback(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const shouldBeFixed = rect.top <= 0 && rect.bottom >= windowHeight;

    setIsFixed(shouldBeFixed);
  }, []);

  useEffect(() => {
    checkShouldPin(); // run on mount
    window.addEventListener("scroll", checkShouldPin, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkShouldPin);
    };
  }, [checkShouldPin]);

  /**
   * Handle navigation click to jump to a specific step
   */
  const handleNavClick = (stepId: string) => {
    const index = STEPS.findIndex((s) => s.id === stepId);
    if (index === -1 || index === selectedStepIndex) return;

    // Determine direction and update
    setDirection(index > selectedStepIndex ? 1 : -1);
    setSelectedStepIndex(index);

    // Temporarily disable scroll-based updates
    setIsManualScrolling(true);

    if (sectionRef.current) {
      const fraction = index / (STEPS.length - 1);
      const sectionTop = sectionRef.current.offsetTop;
      const totalScrollHeight = window.innerHeight * 2.5; // h-[250vh]
      const targetScrollY = sectionTop + fraction * totalScrollHeight;

      window.scrollTo({ top: targetScrollY, behavior: "smooth" });

      // Re-enable scroll-based sync after a delay (adjust as needed)
      setTimeout(() => {
        setIsManualScrolling(false);
      }, 700);
    }
  };

  /**
   * Render the component
   */
  return (
    <section
      ref={sectionRef}
      className="relative h-[250vh] bg-black snap-start overflow-hidden"
      id="how-section"
    >
      {/* Pinned container */}
      <motion.div
        ref={contentRef}
        className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center absolute left-1/2 transform -translate-x-1/2"
        style={{
          position: isFixed ? "fixed" : "absolute",
          top: isFixed ? "50%" : "0",
          transform: isFixed ? "translate(-50%, -50%)" : "translate(-50%, 0)",
        }}
      >
        {/* --------- Navigation (Steps) --------- */}
        <div className="relative">
          <div
            className="absolute left-5 top-0 w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent"
            aria-hidden="true"
          />
          <nav className="space-y-12 relative" aria-label="Section Navigation">
            {STEPS.map((step, i) => {
              const isActive = selectedStepIndex === i;
              return (
                <motion.div
                  key={step.id}
                  className="relative cursor-pointer"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleNavClick(step.id)}
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
                    {/* Step Title */}
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

        {/* --------- Carousel Image --------- */}
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
              <div className="relative w-full h-full">
                <Image
                  src={placeholderImages[STEPS[selectedStepIndex].id]}
                  alt={STEPS[selectedStepIndex].title}
                  fill
                  className="object-contain filter brightness-110"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
