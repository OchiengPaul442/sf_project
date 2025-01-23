"use client";

import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";

export function useScreenSize() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // 768px is the breakpoint for md in Tailwind
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const gradientHeight = useTransform(
    scrollYProgress,
    [0.3, 1],
    ["0%", "100%"]
  );
  const gradientOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return {
    isLargeScreen,
    scrollYProgress,
    scale,
    opacity,
    y,
    gradientHeight,
    gradientOpacity,
  };
}
