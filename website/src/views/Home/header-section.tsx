"use client";

import React, { memo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { SectionProps } from "@/utils/types/section";
import NextButton from "@/components/NextButton";
import { mainConfigs } from "@/utils/configs";

interface HeaderSectionProps extends SectionProps {
  onNextSection: () => void;
}

const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src || "/placeholder.svg"}
    alt={alt}
    width={480}
    height={480}
    priority
    className="w-full h-auto"
    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
    loading="eager"
  />
));
OptimizedImage.displayName = "OptimizedImage";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 700, // Increased stiffness
      damping: 35, // Adjusted damping
      duration: 0.3, // Reduced duration
    },
  },
};

const floatingVariants: Variants = {
  float: {
    y: [-6, 6], // Reduced movement range
    transition: {
      duration: 1.5, // Slightly faster
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = memo(
  ({ id, title, image, onNextSection }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile] = useState(() => isMobileDevice());
    const controls = useAnimation();

    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start start", "end start"],
    });

    // Optimized transform calculations
    const imageScale = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [1, 2.3, 2], // Slightly reduced scale values
      { clamp: true }
    );

    const imageTranslateY = useTransform(
      scrollYProgress,
      [0, 1],
      [0, -120], // Reduced translation
      { clamp: true }
    );

    const imageRotate = useTransform(
      scrollYProgress,
      [0, 1],
      [0, 5], // Reduced rotation
      { clamp: true }
    );

    const imageOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0], {
      clamp: true,
    });

    const gradientLayer1 = useTransform(scrollYProgress, [0, 0.35], [0, 1], {
      clamp: true,
    });

    const bottomGradient = useTransform(scrollYProgress, [0.25, 0.75], [0, 1], {
      clamp: true,
    });

    useEffect(() => {
      controls.start("visible");
      return () => controls.stop();
    }, [controls]);

    return (
      <section
        ref={sectionRef}
        id={id}
        className="relative min-h-[150vh] w-full overflow-hidden flex flex-col justify-start bg-white will-change-transform"
        style={{ perspective: "1000px" }} // Reduced perspective for smoother rendering
      >
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent will-change-opacity"
          style={{ opacity: gradientLayer1 }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[150vh] z-20 pointer-events-none bg-gradient-to-t from-black via-black to-transparent will-change-opacity"
          style={{ opacity: bottomGradient }}
        />

        <div className="absolute top-0 left-0 right-0 z-40">
          <Nav />
        </div>

        <div
          className={`relative flex-grow flex items-center justify-center ${mainConfigs.SECTION_CONTAINER_CLASS}`}
          style={{ transform: "translateY(-10%)" }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] flex items-center justify-center will-change-transform"
            style={{
              scale: imageScale,
              translateY: imageTranslateY,
              rotate: imageRotate,
              opacity: imageOpacity,
              transformStyle: "preserve-3d",
            }}
          >
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-full"
                aria-hidden="true"
              />
            )}

            <motion.div
              variants={!isMobile ? floatingVariants : undefined}
              animate={!isMobile ? "float" : undefined}
              className="relative z-10"
            >
              <OptimizedImage
                src={image || "/placeholder.svg"}
                alt={title || ""}
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-auto">
          <NextButton onClick={onNextSection} />
        </div>
      </section>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
