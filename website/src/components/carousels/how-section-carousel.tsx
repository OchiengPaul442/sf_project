"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, AnimatePresence, useSpring } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Ship from "@/public/images/Ship.png";
import Integrity from "@/public/images/Group 2.png";
import Tight from "@/public/images/Group 3.png";
import Recipe from "@/public/images/Group 4.png";
import Fraud from "@/public/images/Group 5.png";

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

export const HowSectionCarousel = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedStep, setSelectedStep] = useState<string>(STEPS[0].id);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  // Framer Motion's useScroll hook to track scroll progress relative to the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress using useSpring for fluid transitions
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Map scroll progress to selected step
  useEffect(() => {
    const unsubscribe = smoothScrollProgress.on("change", (latest) => {
      // Clamp latest between 0 and 1 to prevent out-of-bounds issues
      const clampedLatest = Math.max(0, Math.min(1, latest));

      // Calculate step index based on scroll progress
      const stepIndex = Math.min(
        Math.floor(clampedLatest * STEPS.length),
        STEPS.length - 1
      );

      // Safeguard against undefined steps
      if (STEPS[stepIndex]) {
        const newStep = STEPS[stepIndex].id;
        setSelectedStep(newStep);
      } else {
        console.warn(
          `Invalid stepIndex: ${stepIndex}. Falling back to last step.`
        );
        setSelectedStep(STEPS[STEPS.length - 1].id);
      }
    });

    return () => unsubscribe();
  }, [smoothScrollProgress]);

  // Handle fixing the content position based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !contentRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Determine if the content should be fixed
      const shouldBeFixed = rect.top <= 0 && rect.bottom >= windowHeight;
      setIsFixed(shouldBeFixed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[250vh] bg-black snap-start overflow-hidden"
      id="how-section"
    >
      {/* Content Container */}
      <motion.div
        ref={contentRef}
        className="w-full container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center absolute left-1/2 transform -translate-x-1/2"
        style={{
          position: isFixed ? "fixed" : "absolute",
          top: isFixed ? "50%" : "0",
          transform: isFixed ? "translate(-50%, -50%)" : "translate(-50%, 0)",
        }}
      >
        {/* Navigation */}
        <div className="relative">
          <div
            className="absolute left-5 top-0 w-[1.2px] h-full bg-gradient-to-b from-white via-white to-transparent"
            aria-hidden="true"
          />
          <nav className="space-y-12 relative" aria-label="Section Navigation">
            {STEPS.map((step) => (
              <motion.div
                key={step.id}
                className="relative"
                initial={false}
                animate={{
                  opacity: selectedStep === step.id ? 1 : 0.5,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative pl-12">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        selectedStep === step.id ? "#fff" : "transparent",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                    animate={{
                      scale: selectedStep === step.id ? 1 : 0.8,
                      opacity: selectedStep === step.id ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <span
                    className={`font-light tracking-wide ${
                      selectedStep === step.id
                        ? "text-white text-xl md:text-3xl"
                        : "text-zinc-200 text-lg md:text-xl"
                    }`}
                    aria-current={selectedStep === step.id ? "step" : undefined}
                  >
                    {step.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Image Display */}
        <div className="relative h-80 sm:h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {STEPS.map(
              (step) =>
                selectedStep === step.id && (
                  <motion.div
                    key={step.id}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.5,
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={placeholderImages[step.id]}
                        alt={step.title}
                        fill
                        className="object-contain filter brightness-110"
                        priority={selectedStep === step.id}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};
