"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LottieRefCurrentProps } from "lottie-react";

// Lazy import for better code splitting
const Lottie = lazy(() => import("lottie-react"));

/** Carousel Steps */
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

// Mapping step IDs to Lottie JSON paths (already preloaded in HomePage)
const STEP_ANIMATION_PATHS: Record<string, string> = {
  "smooth-onboarding": "/lottie/sailing_boat_2.json",
  "data-integrity": "/lottie/paper_flying.json",
  "managed-consumables": "/lottie/spag_json.json",
  "recipe-adherence": "/lottie/mark_json.json",
  "fraud-eliminated": "/lottie/data.json",
};

// Basic framer-motion variants
const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
    zIndex: 0,
  }),
  center: { y: 0, opacity: 1, zIndex: 1 },
  exit: (direction: number) => ({
    y: direction < 0 ? 80 : -80,
    opacity: 0,
    zIndex: 0,
  }),
};

const HowSectionCarousel: React.FC<any> = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lottieData, setLottieData] = useState<Record<string, any>>({});
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  // Lazy load each JSON from preloaded paths
  const loadAnimation = useCallback(async (stepId: string) => {
    if (!STEP_ANIMATION_PATHS[stepId]) return null;

    try {
      // Already fetched in HomePage, but let's fetch from local cache:
      const response = await fetch(STEP_ANIMATION_PATHS[stepId]);
      if (!response.ok) throw new Error(`Failed to load ${stepId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  // Preload all step animations
  useEffect(() => {
    const preloadAll = async () => {
      const data: Record<string, any> = {};
      for (const step of STEPS) {
        const animation = await loadAnimation(step.id);
        if (animation) {
          data[step.id] = animation;
        }
      }
      setLottieData(data);
    };
    preloadAll();
  }, [loadAnimation]);

  // Auto-rotate every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setSelectedStepIndex((idx) => (idx + 1) % STEPS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Adjust speed
  useEffect(() => {
    if (lottieRef.current?.animationItem) {
      lottieRef.current.animationItem.setSpeed(1.2);
    }
  }, [selectedStepIndex, lottieData]);

  // Handle manual nav click
  const handleNavClick = (stepId: string) => {
    const newIndex = STEPS.findIndex((s) => s.id === stepId);
    if (newIndex !== -1 && newIndex !== selectedStepIndex) {
      setDirection(newIndex > selectedStepIndex ? 1 : -1);
      setSelectedStepIndex(newIndex);
    }
  };

  const currentStepId = STEPS[selectedStepIndex].id;
  const currentAnimationData = lottieData[currentStepId];

  return (
    <section
      className="relative h-screen snap-start bg-black flex items-center justify-center overflow-hidden"
      id="how-section-carousel"
    >
      <motion.div className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left Side (Navigation) */}
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

        {/* Right Side (Animation) */}
        <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStepId}
              className="absolute inset-0 flex items-center justify-center"
              custom={direction}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Suspense
                fallback={<p className="text-white text-center">Loading...</p>}
              >
                {currentAnimationData ? (
                  <div className="w-full h-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
                    <Lottie
                      animationData={currentAnimationData}
                      loop
                      autoplay
                      lottieRef={lottieRef}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                ) : (
                  <p className="text-white text-center">Loading...</p>
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

HowSectionCarousel.displayName = "HowSectionCarousel";
export default HowSectionCarousel;
