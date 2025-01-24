"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamically import the Lottie component
const Lottie = lazy(() => import("lottie-react"));

// Define the Step interface
interface Step {
  id: string;
  title: string;
}

// Steps array (constant)
const STEPS: Step[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud Eliminated" },
];

// Mapping of step IDs to their respective Lottie animation paths
const STEP_ANIMATION_PATHS: Record<string, string> = {
  "smooth-onboarding": "/lottie/sailing_boat_2.json",
  "data-integrity": "/lottie/paper_flying.json",
  "managed-consumables": "/lottie/spag_json.json",
  "recipe-adherence": "/lottie/mark_json.json",
  "fraud-eliminated": "/lottie/data.json",
};

// Animation variants for Framer Motion
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

// Preload function to be called on initial page load
export function preloadLottieAnimations() {
  if (typeof window !== "undefined") {
    STEPS.forEach((step) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.href = STEP_ANIMATION_PATHS[step.id];
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }
}

// Memoized loading function to prevent duplicate fetches
const loadLottieAnimation = (() => {
  const cache: Record<string, Promise<any>> = {};

  return (stepId: string) => {
    if (!cache[stepId]) {
      cache[stepId] = fetch(STEP_ANIMATION_PATHS[stepId])
        .then((response) => response.json())
        .catch((error) => {
          console.error(`Failed to load animation for ${stepId}:`, error);
          return null;
        });
    }
    return cache[stepId];
  };
})();

const HowSectionCarousel: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lottieCache, setLottieCache] = useState<Record<string, any>>({});
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  /**
   * Preload animations when component mounts
   */
  useEffect(() => {
    const preloadAnimations = async () => {
      const loadedAnimations: Record<string, any> = {};

      for (const step of STEPS) {
        try {
          const animationData = await loadLottieAnimation(step.id);
          if (animationData) {
            loadedAnimations[step.id] = animationData;
          }
        } catch (error) {
          console.error(`Error loading animation for ${step.id}:`, error);
        }
      }

      setLottieCache(loadedAnimations);
    };

    preloadAnimations();
  }, []);

  /**
   * Auto-rotate carousel every 3 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setSelectedStepIndex((prevIndex) => (prevIndex + 1) % STEPS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Adjust animation speed when loaded
   */
  useEffect(() => {
    if (lottieRef.current?.animationItem) {
      lottieRef.current.animationItem.setSpeed(1.2);
    }
  }, [selectedStepIndex, lottieCache]);

  /**
   * Handle navigation clicks
   */
  const handleNavClick = useCallback(
    (stepId: string) => {
      const index = STEPS.findIndex((s) => s.id === stepId);
      if (index === -1 || index === selectedStepIndex) return;
      setDirection(index > selectedStepIndex ? 1 : -1);
      setSelectedStepIndex(index);
    },
    [selectedStepIndex]
  );

  const currentStepId = STEPS[selectedStepIndex].id;
  const currentAnimationData = lottieCache[currentStepId];

  return (
    <section
      className="relative h-screen snap-start bg-black flex items-center justify-center overflow-hidden"
      id="how-section"
    >
      <motion.div className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left Side Navigation */}
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

        {/* Right Side Animation */}
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
                  <div className="w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[400px] sm:max-h-[400px] md:max-w-[500px] md:max-h-[500px]">
                    <Lottie
                      animationData={currentAnimationData}
                      loop
                      autoplay
                      lottieRef={lottieRef}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
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

// Optionally, call preload on initial page load
if (typeof window !== "undefined") {
  preloadLottieAnimations();
}

export default HowSectionCarousel;
