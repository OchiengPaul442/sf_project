"use client";

import React, { memo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import NextButton from "@/components/NextButton";
import { mainConfigs } from "@/utils/configs";

export interface HeaderSectionProps {
  id: string;
  image: string;
  title?: string;
  nextSectionId?: string;
}

const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt || ""}
    width={600}
    height={600}
    priority
    className="w-full h-auto"
    sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, (max-width: 1024px) 600px, 600px"
    loading="eager"
  />
));
OptimizedImage.displayName = "OptimizedImage";

// Floating effect (optional)
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

const HeaderSection: React.FC<HeaderSectionProps> = ({
  id,
  image,
  title,
  nextSectionId,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();

  // Extend scroll height to 350vh
  const sectionHeight = "350vh";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scale image from 1 to 3.5
  const scaleRange = [0, 0.2, 1];
  const scaleValues = [1, 2, 3.5];
  const imageScale: MotionValue<number> = useTransform(
    scrollYProgress,
    scaleRange,
    scaleValues
  );

  // Slight upward movement
  const yMove = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Fade out container from ~90% to 100%
  const containerOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  // Gradient overlay from 70% to 90%
  const gradientOverlayOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.9],
    [0, 1]
  );

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const handleNext = () => {
    if (nextSectionId) {
      const nextElem = document.getElementById(nextSectionId);
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full bg-white text-black z-50 overflow-hidden"
      style={{ height: sectionHeight }}
    >
      {/* Fixed inner container */}
      <motion.div
        className={`fixed top-0 left-0 w-full h-screen ${mainConfigs.SECTION_CONTAINER_CLASS}`}
        style={{ opacity: containerOpacity }}
      >
        {/* Nav */}
        <div className="absolute top-4 right-4 z-40">
          <Nav />
        </div>

        {/* Next Button */}
        <motion.div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40">
          <NextButton onClick={handleNext} />
        </motion.div>

        {/* Gradient overlay: from white to black near the bottom */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            opacity: gradientOverlayOpacity,
            background: "linear-gradient(to bottom, rgba(255,255,255,0), #000)",
          }}
        />

        {/* Centered image that scales & floats */}
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <motion.div
            className="max-w-[600px]"
            style={{ scale: imageScale, y: yMove }}
            variants={floatingVariants}
            animate="float"
          >
            <OptimizedImage src={image} alt={title || "Header Image"} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
