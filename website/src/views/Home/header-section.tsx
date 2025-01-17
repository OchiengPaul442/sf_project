"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { useRef, useEffect, useState } from "react";

export default function HeaderSection() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(true);

  // Check for mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind is 768px
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Simplified progress range for better performance
  const progressRange = [0, 0.25, 0.5, 0.75, 1];

  // Optimized transform values with mobile check
  const textScale = useTransform(
    scrollYProgress,
    progressRange,
    isMobile ? [1, 1, 1, 1, 1] : [1, 3, 5, 7, 9]
  );

  const textOpacity = useTransform(
    scrollYProgress,
    progressRange,
    isMobile ? [1, 1, 1, 1, 1] : [1, 0.75, 0.5, 0.25, 0]
  );

  // Simplified movement transforms with mobile check
  const xMove = useTransform(
    scrollYProgress,
    progressRange,
    isMobile
      ? ["0%", "0%", "0%", "0%", "0%"]
      : ["0%", "-12.5%", "-25%", "-37.5%", "-50%"]
  );

  const yMove = useTransform(
    scrollYProgress,
    progressRange,
    isMobile
      ? ["0%", "0%", "0%", "0%", "0%"]
      : ["0%", "-6.25%", "-12.5%", "-18.75%", "-25%"]
  );

  // Enhanced nav visibility control
  const navOpacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    isMobile ? [1, 1] : [1, 0]
  );

  const navVisibility = useTransform(scrollYProgress, (value) =>
    isMobile ? "visible" : value <= 0.2 ? "visible" : "hidden"
  );

  // Other transforms with mobile check
  const introTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    isMobile ? [1, 1] : [1, 0]
  );

  const gradientProgress = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    isMobile ? [0, 0] : [0, 1]
  );

  return (
    <section
      ref={sectionRef}
      id="header-section"
      className={`relative ${
        isMobile ? "min-h-screen" : "min-h-[400vh]"
      } snap-start`}
    >
      <div className="sticky top-0 h-screen bg-white flex items-center justify-center overflow-hidden">
        {/* Navigation with enhanced hiding */}
        <motion.div
          style={{
            opacity: navOpacity,
            visibility: navVisibility,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
          initial={{ opacity: 1 }}
          className="transition-opacity duration-300"
        >
          <Nav />
        </motion.div>

        {/* Content */}
        <div className="text-center relative z-10">
          <motion.h2
            style={{ opacity: introTextOpacity }}
            className="text-gray-600 text-3xl mb-2 font-normal"
          >
            We&apos;re
          </motion.h2>
          <motion.h1
            style={{
              scale: textScale,
              opacity: textOpacity,
              x: xMove,
              y: yMove,
              fontSize: isMobile ? "8vw" : "10vh",
            }}
            className="font-bold tracking-tight text-black"
          >
            Saving Food.
          </motion.h1>
        </div>

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: gradientProgress,
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      </div>
    </section>
  );
}
