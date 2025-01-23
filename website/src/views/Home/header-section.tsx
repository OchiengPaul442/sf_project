"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import SVGImage from "@/public/svgs/Vector.svg";
import { useRef } from "react";

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [0, distance]);
}

export default function HeaderSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Create multiple transform effects
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useParallax(scrollYProgress, 200);

  // Gradient animation
  const gradientHeight = useTransform(
    scrollYProgress,
    [0.3, 1],
    ["0%", "100%"]
  );
  const gradientOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  // Create a floating animation
  const floating = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] bg-white overflow-hidden"
    >
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 p-6 z-50 bg-white/80 backdrop-blur-sm">
        <Nav />
      </div>

      {/* Center Content */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
        >
          {/* Background blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
            style={{
              scale: useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]),
              opacity: useTransform(scrollYProgress, [0, 0.3], [0, 0.5]),
            }}
          />

          {/* Main image with scroll animations */}
          <motion.div
            animate={floating}
            style={{
              scale,
              opacity,
              y,
            }}
            className="relative z-10"
          >
            <Image
              src={SVGImage || "/placeholder.svg"}
              alt="WE'RE SAVING FOOD"
              width={480}
              height={480}
              priority
              className="w-full h-auto"
            />
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -inset-4 border border-black/10 rounded-full"
            style={{
              scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.3]),
              opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
            }}
          />
        </motion.div>
      </div>

      {/* Black Gradient Overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent"
        style={{
          height: gradientHeight,
          opacity: gradientOpacity,
        }}
      />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm text-black/60 z-50"
      >
        Scroll to explore
      </motion.div>
    </section>
  );
}
