"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import SVGImage from "@/public/svgs/Vector.svg";
import { useRef } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";

interface AnimatedContentProps {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

export default function HeaderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    isLargeScreen,
    scrollYProgress,
    scale,
    opacity,
    y,
    gradientHeight,
    gradientOpacity,
  } = useScreenSize();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] bg-white overflow-hidden"
    >
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      {/* Center Content */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        {isLargeScreen ? (
          <AnimatedContent
            scale={scale}
            opacity={opacity}
            y={y}
            scrollYProgress={scrollYProgress}
          />
        ) : (
          <StaticContent />
        )}
      </div>

      {/* Black Gradient Overlay */}
      {isLargeScreen ? (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent"
          style={{
            height: gradientHeight,
            opacity: gradientOpacity,
          }}
        />
      ) : (
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black to-transparent" />
      )}

      {/* Scroll Indicator */}
      {isLargeScreen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ opacity: scrollYProgress }}
          className="fixed bottom-8 w-full text-sm text-black/60 z-50"
        >
          <div className="w-full flex justify-center">Scroll to explore</div>
        </motion.div>
      )}
    </section>
  );
}

function AnimatedContent({
  scale,
  opacity,
  y,
  scrollYProgress,
}: AnimatedContentProps) {
  return (
    <>
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

        {/* Main image with scroll animations and floating effect */}
        <motion.div
          initial="float"
          animate="float"
          variants={{
            float: {
              y: [-10, 10],
              transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
          style={{
            scale,
            opacity,
            y: useTransform(
              y,
              (value) => value + 10 * Math.sin(Date.now() / 2000)
            ),
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
    </>
  );
}

function StaticContent() {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]">
      <div className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full" />
      <div className="relative z-10">
        <Image
          src={SVGImage || "/placeholder.svg"}
          alt="WE'RE SAVING FOOD"
          width={480}
          height={480}
          priority
          className="w-full h-auto"
        />
      </div>
      {/* Decorative circle */}
      <div className="absolute -inset-4 border border-black/10 rounded-full" />
    </div>
  );
}
