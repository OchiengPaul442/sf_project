"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { Nav } from "@/components/layout/Navs/nav";
import imageUrls from "@/utils/Images_Json_Urls";

/**
 * A simple parallax hook that maps scroll progress [0..1] to a distance.
 */
function useParallax(scrollProgress: MotionValue<number>, distance: number) {
  return useTransform(scrollProgress, [0, 1], [0, distance]);
}

export default function HeaderSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Read how much we've scrolled through this section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax offset (moves down 150px as we scroll).
  const parallaxY = useParallax(scrollYProgress, 150);

  // Scale up from 1 to 1.05 by halfway through the scroll. Then keep it at 1.05.
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  // Fade out from 0.8 onward (0 means top of section, 1 means bottom).
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Create smaller blur effect: from 0..0.3
  const blurOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.5]);
  const blurScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]);

  useEffect(() => {
    // Reset scroll position to the top when the page is refreshed
    window.scrollTo(0, 0);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[130vh] bg-white overflow-hidden"
    >
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      {/* Sticky center content */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} // Initial state for animation
          animate={{ opacity: 1, scale: 1 }} // Target state for animation
          transition={{ duration: 0.5 }} // Transition duration
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
        >
          {/* Background blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
            style={{
              scale: blurScale,
              opacity: blurOpacity,
            }}
          />

          {/* Main image with parallax + float effect */}
          <motion.div
            initial={{ y: 0 }} // Start at initial state for y-axis
            animate={{
              y: [-10, 10], // Floating effect
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              y: parallaxY,
              scale,
              opacity,
            }}
            className="relative z-10"
          >
            <Image
              src={imageUrls.headerSectionImage || "/placeholder.svg"}
              alt="WE'RE SAVING FOOD"
              width={480}
              height={480}
              priority
              className="w-full h-auto"
            />
          </motion.div>

          {/* Decorative border ring */}
          <motion.div
            className="absolute -inset-4 border border-black/10 rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              scale: 1.2,
              opacity: 1,
            }}
            transition={{ duration: 0.5 }}
            style={{
              scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.2]),
              opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
