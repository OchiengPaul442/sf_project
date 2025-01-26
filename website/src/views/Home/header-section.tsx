"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Nav } from "@/components/layout/Navs/nav";
import VectorImage from "@/public/Vector.svg";
import { isMobileDevice } from "@/utils/deviceDetection";
import NextButton from "@/components/NextButton";

function useParallax(scrollProgress: MotionValue<number>, distance: number) {
  return useTransform(scrollProgress, [0, 1], [0, distance]);
}

const HeaderSection: React.FC<any> = ({ scrollToTop }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax and animation effects
  const parallaxY = useParallax(scrollYProgress, 150);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blurOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.5]);
  const blurScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]);

  // Detect if the device is mobile
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(isMobileDevice());
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    // Ensure the section scrolls to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-dvh bg-white overflow-hidden"
      >
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Nav />
        </div>

        {/* Sticky center content */}
        <div className="sticky top-0 h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
          >
            {/* Background blur effect */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
                style={{
                  scale: blurScale,
                  opacity: blurOpacity,
                }}
              />
            )}

            {/* Main image with parallax + float effect */}
            <motion.div
              initial={{ y: 0 }}
              animate={
                !isMobile
                  ? {
                      y: [-10, 10],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                y: !isMobile ? parallaxY : 0,
                scale: !isMobile ? scale : 1,
                opacity: !isMobile ? opacity : 1,
              }}
              className="relative z-10"
            >
              <Image
                src={VectorImage || "/placeholder.svg"}
                alt="WE'RE SAVING FOOD"
                width={480}
                height={480}
                priority
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <NextButton onClick={scrollToTop} />
      </div>
    </>
  );
};

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
