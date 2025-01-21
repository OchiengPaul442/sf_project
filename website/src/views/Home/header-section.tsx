"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Nav } from "@/components/layout/Navs/nav";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HeaderSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const progressRange = [0, 0.25, 0.5, 0.75, 1];

  const getAnimationValues = (mobileValues: any, desktopValues: any) =>
    isMobile ? mobileValues : desktopValues;

  const textScale = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues([1, 1.2, 1.4, 1.6, 1.8], [1, 3, 5, 7, 9])
  );

  const textOpacity = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues([1, 0.8, 0.6, 0.4, 0.2], [1, 0.75, 0.5, 0.25, 0])
  );

  const xMove = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues(
      ["0%", "-5%", "-10%", "-15%", "-20%"],
      ["0%", "-12.5%", "-25%", "-37.5%", "-50%"]
    )
  );

  const yMove = useTransform(
    scrollYProgress,
    progressRange,
    getAnimationValues(
      ["0%", "-2%", "-4%", "-6%", "-8%"],
      ["0%", "-6.25%", "-12.5%", "-18.75%", "-25%"]
    )
  );

  const navOpacity = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.1 : 0.2],
    [1, 0]
  );

  const navVisibility = useTransform(scrollYProgress, (value) =>
    value <= (isMobile ? 0.1 : 0.2) ? "visible" : "hidden"
  );

  const introTextOpacity = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.05 : 0.1],
    [1, 0]
  );

  const gradientProgress = useTransform(
    scrollYProgress,
    [isMobile ? 0.05 : 0.1, isMobile ? 0.7 : 0.9],
    [0, 1]
  );

  return (
    <section
      ref={sectionRef}
      id="header-section"
      className={`relative min-h-dvh md:min-h-[400vh] md:snap-none transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="sticky top-0 h-screen bg-white flex items-center justify-center overflow-hidden">
        <motion.div
          style={{
            opacity: navOpacity,
            visibility: navVisibility,
            position: "relative",
            zIndex: 20,
          }}
          className="transition-opacity duration-300"
        >
          <Nav />
        </motion.div>

        <div className="text-center relative z-10">
          <motion.h2
            style={{ opacity: introTextOpacity }}
            className="text-gray-600 text-2xl md:text-4xl font-normal"
          >
            We&apos;re
          </motion.h2>
          <motion.h1
            style={{
              scale: textScale,
              opacity: textOpacity,
              x: xMove,
              y: yMove,
            }}
            className="font-bold tracking-tight text-black text-[8vw] md:text-[10vh]"
          >
            Saving Food.
          </motion.h1>
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: gradientProgress,
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      </div>
    </section>
  );
}
