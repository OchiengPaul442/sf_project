"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamic import with loading state
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// Types and constants
interface Step {
  id: string;
  title: string;
  animationPath: string;
}

const STEPS: Step[] = [
  {
    id: "smooth-onboarding",
    title: "Smooth Onboarding",
    animationPath: "/lottie/sailing_boat_2.json",
  },
  {
    id: "data-integrity",
    title: "Data Integrity",
    animationPath: "/lottie/paper_flying.json",
  },
  {
    id: "managed-consumables",
    title: "Tightly Managed Consumables",
    animationPath: "/lottie/spag_json.json",
  },
  {
    id: "recipe-adherence",
    title: "Recipe Adherence",
    animationPath: "/lottie/mark_json.json",
  },
  {
    id: "fraud-eliminated",
    title: "Fraud Eliminated",
    animationPath: "/lottie/data.json",
  },
];

// Optimized animation variants
const carouselVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

// Memoized Navigation Item
const NavItem = memo(function NavItem({
  step,
  isActive,
  onClick,
}: {
  step: Step;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative pl-6 sm:pl-12">
        <motion.div
          className={`absolute left-1 sm:left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
            isActive ? "bg-white" : "border border-white/30"
          }`}
          animate={{ scale: isActive ? 1 : 0.8 }}
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
});

// Improved animation loader with retry mechanism
const useAnimationLoader = (path: string) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const retryCount = useRef(0);

  const loadAnimation = useCallback(async () => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load animation: ${path}`);
      const json = await response.json();
      setData(json);
      setError(null);
      retryCount.current = 0;
    } catch (err) {
      setError(err as Error);
      if (retryCount.current < 3) {
        retryCount.current += 1;
        setTimeout(loadAnimation, 1000 * retryCount.current);
      }
    }
  }, [path]);

  useEffect(() => {
    loadAnimation();
  }, [loadAnimation]);

  return { data, error };
};

// Main component
const HowSectionCarousel: React.FC<any> = memo(function HowSectionCarousel() {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const isVisibleRef = useRef(true);

  const currentStep = STEPS[selectedStepIndex];
  const { data: animationData, error } = useAnimationLoader(
    currentStep.animationPath
  );

  // Visibility observer
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

    const element = document.getElementById("how-section-carousel");
    if (element) {
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, []);

  // Auto-rotation
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (isVisibleRef.current) {
          setDirection(1);
          setSelectedStepIndex((idx) => (idx + 1) % STEPS.length);
        }
      }, 3000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  const handleNavClick = useCallback(
    (index: number) => {
      if (index !== selectedStepIndex) {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
        setDirection(index > selectedStepIndex ? 1 : -1);
        setSelectedStepIndex(index);
      }
    },
    [selectedStepIndex]
  );

  return (
    <section
      id="how-section-carousel"
      className="relative h-screen snap-start bg-black flex items-center justify-center overflow-hidden"
    >
      <motion.div className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Navigation */}
        <div className="relative w-full lg:w-1/2">
          <div className="absolute left-2 sm:left-5 top-0 w-[1px] sm:w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent" />
          <nav className="space-y-6 sm:space-y-8 lg:space-y-12">
            {STEPS.map((step, index) => (
              <NavItem
                key={step.id}
                step={step}
                isActive={selectedStepIndex === index}
                onClick={() => handleNavClick(index)}
              />
            ))}
          </nav>
        </div>

        {/* Animation */}
        <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep.id}
              className="absolute inset-0 flex items-center justify-center"
              custom={direction}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {error ? (
                <div className="text-red-500">Failed to load animation</div>
              ) : !animationData ? (
                <div className="text-white">Loading...</div>
              ) : (
                <div className="w-full h-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    lottieRef={lottieRef}
                    style={{ width: "100%", height: "100%" }}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
});

export default HowSectionCarousel;
