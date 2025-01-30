"use client";

import type React from "react";
import { memo, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, type Variants } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { SectionProps } from "@/utils/types/section";

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

const HeaderSection: React.FC<SectionProps> = ({ id, title, image }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const controls = useAnimation();

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
      className="relative h-dvh md:min-h-screen bg-white overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px]"
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
    </section>
  );
};

HeaderSection.displayName = "HeaderSection";

export default memo(HeaderSection);
