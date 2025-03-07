"use client";

import type React from "react";
import { memo, useRef, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import NextButton from "@/components/NextButton";

export interface HeaderSectionProps {
  id: string;
  image: string;
  nextSectionId?: string;
}

const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt || ""}
    width={400}
    height={300}
    priority
    className="w-full h-auto"
    sizes="(max-width: 768px) 80vw, 400px"
    loading="eager"
  />
));
OptimizedImage.displayName = "OptimizedImage";

const floatingVariants: Variants = {
  float: {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  id,
  image,
  nextSectionId,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 20,
    damping: 30,
    restDelta: 0.0001,
  });

  const imageScale = useTransform(smoothProgress, [0, 0.5], [1, 4]);
  const yMove = useTransform(smoothProgress, [0, 0.5], [0, -50]);
  const contentOpacity = useTransform(smoothProgress, [0.3, 0.6], [1, 0]);

  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.8],
    ["rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 1)"]
  );

  const handleNext = useCallback(() => {
    if (nextSectionId) {
      const nextElem = document.getElementById(nextSectionId);
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [nextSectionId]);

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className="relative w-full z-50"
      style={{
        height: "250vh",
        backgroundColor,
      }}
    >
      <motion.div
        className="fixed inset-0 w-full h-screen flex items-center justify-center"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          className="w-[400px] mx-auto"
          style={{
            scale: imageScale,
            y: yMove,
          }}
          variants={floatingVariants}
          animate="float"
        >
          <OptimizedImage src={image} alt="Header Image" />
        </motion.div>

        {/* Nav with improved fade out */}
        <motion.div
          className="absolute top-4 right-4"
          style={{
            opacity: useTransform(smoothProgress, [0.3, 0.5], [1, 0]),
          }}
        >
          <Nav />
        </motion.div>

        {/* Next Button with improved visibility */}
        <motion.div
          className="fixed bottom-12 left-1/2 -translate-x-1/2"
          style={{
            opacity: useTransform(smoothProgress, [0.3, 0.5], [1, 0]),
          }}
        >
          <NextButton onClick={handleNext} />
        </motion.div>
      </motion.div>

      {/* Smooth transition to next section without visible lines */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[150vh] bg-gradient-to-b from-transparent via-black to-black"
        style={{
          opacity: useTransform(smoothProgress, [0.5, 0.8], [0, 1]),
        }}
      />
    </motion.section>
  );
};

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
