"use client";

import { memo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import VectorImage from "@/public/Vector.svg";
import { isMobileDevice } from "@/utils/deviceDetection";

// Optimized parallax hook
function useParallax(scrollProgress: MotionValue<number>, distance: number) {
  return useTransform(scrollProgress, [0, 1], [0, distance], {
    clamp: true,
  });
}

// Memoized image component
const OptimizedImage = memo(function OptimizedImage() {
  return (
    <Image
      src={VectorImage || "/placeholder.svg"}
      alt="WE'RE SAVING FOOD"
      width={480}
      height={480}
      priority
      className="w-full h-auto"
      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
    />
  );
});

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

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

function HeaderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Memoized transforms
  const parallaxY = useParallax(scrollYProgress, 150);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05], {
    clamp: true,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0], {
    clamp: true,
  });
  const blurOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.5], {
    clamp: true,
  });
  const blurScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1], {
    clamp: true,
  });

  // Device detection with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkIsMobile = () => {
      setIsMobile(isMobileDevice());
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150);
    };

    // Initial check
    checkIsMobile();

    // Add debounced event listener
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll to top on mount with RAF
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh bg-white overflow-hidden"
    >
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      {/* Content container */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
        >
          {/* Background blur effect - only render when needed */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
              style={{
                scale: blurScale,
                opacity: blurOpacity,
              }}
              aria-hidden="true"
            />
          )}

          {/* Main image container */}
          <motion.div
            variants={!isMobile ? floatingVariants : undefined}
            animate={!isMobile ? "float" : undefined}
            style={{
              y: !isMobile ? parallaxY : 0,
              scale: !isMobile ? scale : 1,
              opacity: !isMobile ? opacity : 1,
            }}
            className="relative z-10"
          >
            <OptimizedImage />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

HeaderSection.displayName = "HeaderSection";
export default memo(HeaderSection);
