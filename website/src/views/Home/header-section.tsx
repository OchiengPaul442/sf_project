"use client";

import type React from "react";
import { memo, useRef, useEffect, useState } from "react";
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
import { SECTION_CONTAINER_CLASS } from "@/utils/configs";

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
  />
));

OptimizedImage.displayName = "OptimizedImage";

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
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  id,
  title,
  image,
  onNextSection,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const controls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Adjusted gradient transitions to become darker faster
  const gradientLayer1 = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const bottomGradient = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkIsMobile = () => {
      setIsMobile(isMobileDevice());
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150);
    };

    checkIsMobile();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    controls.start("visible");
    return () => {
      controls.stop();
    };
  }, [controls]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-white"
      style={{
        scrollSnapAlign: "start",
        scrollMarginTop: "100vh",
      }}
    >
      {/* Main gradient overlay */}
      <motion.div
        className="absolute z-50 -bottom-5 md:bottom-0 inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"
        style={{ opacity: gradientLayer1 }}
      />

      {/* Bottom heavy gradient for seamless transition */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[150vh] bg-gradient-to-t from-black via-black to-transparent pointer-events-none"
        style={{ opacity: bottomGradient }}
      />

      <div className="absolute top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      <div
        className={`relative flex-grow flex items-center justify-center ${SECTION_CONTAINER_CLASS}`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
          style={{
            scale: imageScale,
            rotate: imageRotate,
            opacity: imageOpacity,
          }}
        >
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-black/5 backdrop-blur-md rounded-full"
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

      <motion.div
        className="flex justify-center pb-8 relative z-20"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
      >
        <NextButton onClick={onNextSection} />
      </motion.div>
    </section>
  );
};

HeaderSection.displayName = "HeaderSection";

export default memo(HeaderSection);
