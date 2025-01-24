"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// We remove the direct JSON imports and will dynamically import them.
// import BoatAnimation from "@/public/lottie/sailing_boat_2.json";
// import PaperAnimation from "@/public/lottie/paper_flying.json";
// import MarkerAnimation from "@/public/lottie/mark_json.json";
// import SpagAnimation from "@/public/lottie/spag_json.json";
// import DataAnimation from "@/public/lottie/data.json";

interface Step {
  id: string;
  title: string;
}

// Keep your steps the same:
const STEPS: Step[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud Eliminated" },
];

// You can store the loaded Lottie data in an object
// where the key = stepId, value = loaded JSON
// We’ll fetch them lazily when needed:
type LottieCache = Record<string, any>;

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

const HowSectionCarousel: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Cache for loaded Lottie data
  const [lottieCache, setLottieCache] = useState<LottieCache>({});

  // Helper to load a JSON file dynamically
  const loadLottieData = useCallback(
    async (stepId: string) => {
      if (lottieCache[stepId]) return; // already loaded
      try {
        let data: any;
        switch (stepId) {
          case "smooth-onboarding":
            data = await import("@/public/lottie/sailing_boat_2.json");
            break;
          case "data-integrity":
            data = await import("@/public/lottie/paper_flying.json");
            break;
          case "managed-consumables":
            data = await import("@/public/lottie/spag_json.json");
            break;
          case "recipe-adherence":
            data = await import("@/public/lottie/mark_json.json");
            break;
          case "fraud-eliminated":
            data = await import("@/public/lottie/data.json");
            break;
          default:
            return;
        }
        setLottieCache((prev) => ({
          ...prev,
          [stepId]: data.default || data,
        }));
      } catch (err) {
        console.error(`Error loading Lottie for ${stepId}`, err);
      }
    },
    [lottieCache]
  );

  // Load the default step's Lottie on mount
  useEffect(() => {
    loadLottieData(STEPS[0].id);
  }, [loadLottieData]);

  // Auto-rotate every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setSelectedStepIndex((prevIndex) => (prevIndex + 1) % STEPS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Each time we move to a new step, load that step's Lottie
  useEffect(() => {
    loadLottieData(STEPS[selectedStepIndex].id);
    // Optionally load next step in the background:
    const nextIndex = (selectedStepIndex + 1) % STEPS.length;
    loadLottieData(STEPS[nextIndex].id);
  }, [selectedStepIndex, loadLottieData]);

  const handleNavClick = (stepId: string) => {
    const index = STEPS.findIndex((s) => s.id === stepId);
    if (index === -1 || index === selectedStepIndex) return;
    setDirection(index > selectedStepIndex ? 1 : -1);
    setSelectedStepIndex(index);
  };

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
              {/* Show Lottie only if it's loaded. Could show a spinner otherwise. */}
              {currentAnimationData ? (
                <div className="w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[400px] sm:max-h-[400px] md:max-w-[500px] md:max-h-[500px]">
                  <Lottie
                    animationData={currentAnimationData}
                    loop
                    autoplay
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    // optionally reduce fps or use custom settings:
                    // rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
                  />
                </div>
              ) : (
                <p className="text-white text-center">Loading...</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default HowSectionCarousel;
