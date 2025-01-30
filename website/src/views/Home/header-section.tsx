"use client";

import React, { memo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, Variants } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import VectorImage from "@/public/Vector.svg";
import { isMobileDevice } from "@/utils/deviceDetection";

// Memoized Image Component for Performance Optimization
const OptimizedImage = memo(() => (
  <Image
    src={VectorImage || "/placeholder.svg"}
    alt="We're Saving Food"
    width={480}
    height={480}
    priority
    className="w-full h-auto"
    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
  />
));

OptimizedImage.displayName = "OptimizedImage";

// Animation Variants for Container
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Animation Variants for Floating Effect
const floatingVariants: Variants = {
  float: {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Animation Controls
  const controls = useAnimation();

  // Device Detection with Debouncing to Optimize Resize Events
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkIsMobile = () => {
      setIsMobile(isMobileDevice());
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150);
    };

    // Initial Check
    checkIsMobile();

    // Add Debounced Resize Event Listener
    window.addEventListener("resize", handleResize, { passive: true });

    // Cleanup on Unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Trigger container animation when component mounts
  useEffect(() => {
    controls.start("visible");
    return () => {
      controls.stop();
    };
  }, [controls]);

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh md:min-h-screen bg-white overflow-hidden"
    >
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      {/* Content Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
        >
          {/* Background Blur Effect - Render Only on Desktop */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
              aria-hidden="true"
            />
          )}

          {/* Main Image Container with Floating Animation */}
          <motion.div
            variants={!isMobile ? floatingVariants : undefined}
            animate={!isMobile ? "float" : undefined}
            className="relative z-10"
          >
            <OptimizedImage />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Assign Display Name for Better Debugging
HeaderSection.displayName = "HeaderSection";

// Export Memoized Component to Prevent Unnecessary Re-renders
export default memo(HeaderSection);
