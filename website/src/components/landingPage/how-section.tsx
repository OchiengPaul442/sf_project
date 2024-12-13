"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { GradientSeparator } from "@/components/ui/separator";

const useScrollProgress = (
  ref: React.RefObject<HTMLElement>,
  offset: any = ["start end", "end start"]
): MotionValue<number> => {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
};

export default function HowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const firstParagraphRef = useRef<HTMLDivElement>(null);
  const secondParagraphRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const scrollProgress = useScrollProgress(sectionRef);
  const firstParagraphProgress = useScrollProgress(firstParagraphRef, [
    "start end",
    "start center",
  ]);
  const secondParagraphProgress = useScrollProgress(secondParagraphRef, [
    "start end",
    "start center",
  ]);

  const titleScale = useTransform(scrollProgress, [0, 0.3], [1, 0.4]);
  const titleFontSize = useTransform(
    scrollProgress,
    [0, 0.3],
    ["25vw", "10vw"]
  );
  const firstParagraphY = useTransform(firstParagraphProgress, [0, 1], [50, 0]);
  const secondParagraphY = useTransform(
    secondParagraphProgress,
    [0, 1],
    [50, 0]
  );

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add("animate-gradient");
          } else {
            sectionRef.current?.classList.remove("animate-gradient");
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black min-h-screen overflow-hidden transition-colors duration-1000 ease-in-out"
    >
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="space-y-24">
          <div className="relative">
            <motion.div
              className="absolute -top-12 right-0 text-white/5 pointer-events-none"
              style={{
                opacity: useTransform(scrollProgress, [0, 0.3], [0.05, 0]),
              }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-64 h-64 md:w-96 md:h-96"
                stroke="currentColor"
                strokeWidth="0.5"
              >
                <path
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            <div className="relative z-10">
              <motion.h2
                className="text-white font-mono mb-12 origin-left"
                style={{
                  scale: prefersReducedMotion ? 1 : titleScale,
                  fontSize: prefersReducedMotion ? "10vw" : titleFontSize,
                }}
              >
                How?
              </motion.h2>

              <motion.div
                ref={firstParagraphRef}
                variants={fadeInUpVariants}
                initial="hidden"
                animate={prefersReducedMotion ? "visible" : undefined}
                whileInView={prefersReducedMotion ? undefined : "visible"}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
                style={{
                  opacity: prefersReducedMotion ? 1 : firstParagraphProgress,
                  y: prefersReducedMotion ? 0 : firstParagraphY,
                }}
              >
                <p className="text-3xl md:text-4xl lg:text-5xl font-mono tracking-tight leading-relaxed max-w-4xl">
                  <span className="text-white">
                    By building a platform that empowers
                  </span>{" "}
                  <span className="text-zinc-500">
                    restaurants to cut food waste, protect their bottom line,
                    and have a meaningful, cumulative impact on global
                    sustainability.
                  </span>
                </p>
              </motion.div>
            </div>
          </div>

          <div className="transform origin-center transition-transform duration-1000 ease-in-out">
            <GradientSeparator />
          </div>

          <motion.div
            ref={secondParagraphRef}
            variants={fadeInUpVariants}
            initial="hidden"
            animate={prefersReducedMotion ? "visible" : undefined}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
            style={{
              opacity: prefersReducedMotion ? 1 : secondParagraphProgress,
              y: prefersReducedMotion ? 0 : secondParagraphY,
            }}
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-end font-mono leading-relaxed max-w-4xl ml-auto">
              <span className="text-white">
                Our team blends more than a decade of Food and AI
              </span>{" "}
              <span className="text-zinc-500">
                experience, in a packaged solution that lets you focus on
                creating while we handle the rest
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
