"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { Nav } from "@/components/layout/Navs/nav";
import VectorImage from "@/public/Vector.svg";
import NextButton from "@/components/NextButton";

function useParallax(scrollProgress: MotionValue<number>, distance: number) {
  return useTransform(scrollProgress, [0, 1], [0, distance]);
}

export default function HeaderSection({
  scrollToTop,
}: {
  scrollToTop: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useParallax(scrollYProgress, 150);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blurOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.5]);
  const blurScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]);

  useEffect(() => {
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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
            initial={{ y: 0 }}
            animate={{
              y: [-10, 10],
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
              src={VectorImage || "/placeholder.svg"}
              alt="WE'RE SAVING FOOD"
              width={480}
              height={480}
              priority
              className="w-full h-auto"
            />
          </motion.div>

          {/* Decorative border ring */}
          {/* <motion.div
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
          /> */}
        </motion.div>
      </div>

      {/* NextButton at the bottom of the section */}
      <div>
        <NextButton onClick={scrollToTop} isVisible />
      </div>
    </section>
  );
}
