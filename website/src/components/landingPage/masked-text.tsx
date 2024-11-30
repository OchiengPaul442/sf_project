"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  animate,
  useScroll,
} from "framer-motion";
import { Nav } from "../layout/Navs/nav";
import { useWindowSize } from "@/hooks/use-window-size";

export function MaskedText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowSize();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Use useScroll hook to get scrollProgress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Create a smoothed version of scrollProgress
  const smoothScrollProgress = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      animate(smoothScrollProgress, latest, { duration: 0.3 });
      setIsInitialLoad(false);
    });
    return () => unsubscribe();
  }, [scrollYProgress, smoothScrollProgress]);

  // Define common input ranges for consistency
  const COMMON_INPUT_RANGE = [0, 0.15, 0.35, 0.36, 0.45, 0.6, 1];
  const TEXT_ANIMATION_RANGE = [0, 0.3, 1]; // Updated range

  // Define additional input ranges for size and position animations
  const SIZE_ANIMATION_RANGE = [0.6, 0.8, 1]; // New size animation range
  const POSITION_ANIMATION_RANGE = [0.6, 0.8, 1]; // New position animation range

  // Responsive scaling factor
  const responsiveScale = useMemo(() => {
    if (windowWidth < 640) return 180; // Mobile
    if (windowWidth < 1024) return 130; // Tablet
    return 46; // Desktop
  }, [windowWidth]);

  // Responsive origin for mask text
  const responsiveOrigin = useMemo(() => {
    if (windowWidth < 640) {
      return { originX: 0.61, originY: 0.48 }; // Mobile
    } else if (windowWidth < 1024) {
      return { originX: 0.61, originY: 0.49 }; // Tablet
    }
    return { originX: 0.61, originY: 0.48 }; // Desktop
  }, [windowWidth]);

  // Animation transforms
  const scale = useTransform(smoothScrollProgress, COMMON_INPUT_RANGE, [
    1,
    responsiveScale,
    responsiveScale,
    responsiveScale,
    1,
    1,
    1,
  ]);

  const xMove = useTransform(smoothScrollProgress, COMMON_INPUT_RANGE, [
    "0%",
    "30%",
    "30%",
    "30%",
    "0%",
    "0%",
    "0%",
  ]);

  const navOpacity = useTransform(smoothScrollProgress, [0, 0.15], [1, 0]);

  const whiteOverlayOpacity = useMotionValue(isInitialLoad ? 1 : 0);

  // Updated textOverlayOpacity
  const textOverlayOpacity = useTransform(
    smoothScrollProgress,
    TEXT_ANIMATION_RANGE,
    [1, 0, 0] // Fade out and stay transparent
  );

  const rectFill = useTransform(smoothScrollProgress, COMMON_INPUT_RANGE, [
    "white",
    "white",
    "white",
    "black",
    "black",
    "black",
    "black",
  ]);

  const textY = useTransform(smoothScrollProgress, COMMON_INPUT_RANGE, [
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
  ]);

  // Responsive font size for main text
  const responsiveFontSize = useMemo(() => {
    if (windowWidth < 640) return "8vw"; // Mobile
    if (windowWidth < 1024) return "9vw"; // Tablet
    return "12vw"; // Desktop
  }, [windowWidth]);

  const textFontSize = useTransform(
    smoothScrollProgress,
    COMMON_INPUT_RANGE,
    Array(7).fill(responsiveFontSize)
  );

  // Animation for "We're" text
  const weY = useTransform(
    smoothScrollProgress,
    COMMON_INPUT_RANGE,
    [0, -400, -400, -400, 0, 0, 0]
  );

  const weOpacity = useTransform(
    smoothScrollProgress,
    COMMON_INPUT_RANGE,
    [1, 0, 1, 1, 1, 1, 1]
  );

  // Responsive font size for "We're" text
  const responsiveWeFontSize = useMemo(() => {
    if (windowWidth < 640) return "1.5vw"; // Mobile
    if (windowWidth < 1024) return "1.75vw"; // Tablet
    return "2vw"; // Desktop
  }, [windowWidth]);

  const weFontSize = useTransform(
    smoothScrollProgress,
    COMMON_INPUT_RANGE,
    Array(7).fill(responsiveWeFontSize)
  );

  // Additional transforms for size and position (Separate transforms to avoid TypeScript errors)

  // "Saving Food." Text Scale Down
  const savingFoodScaleDown = useTransform(
    smoothScrollProgress,
    SIZE_ANIMATION_RANGE,
    [1, 0.8, 0.8]
  );

  // "Saving Food." Text Move Up
  const savingFoodMoveY = useTransform(
    smoothScrollProgress,
    POSITION_ANIMATION_RANGE,
    ["0%", "-10%", "-10%"]
  );

  // "We're" Text Scale Down
  const weScaleDown = useTransform(
    smoothScrollProgress,
    SIZE_ANIMATION_RANGE,
    [1, 0.8, 0.8]
  );

  // "We're" Text Move Up
  const weMoveY = useTransform(smoothScrollProgress, POSITION_ANIMATION_RANGE, [
    "0%",
    "-100%",
    "-100%",
  ]);

  // Combine scale and savingFoodScaleDown into combinedScale
  const combinedScale = useMotionValue(1);
  useEffect(() => {
    const unsubscribe1 = scale.onChange((s) => {
      combinedScale.set(savingFoodScaleDown.get() * s);
    });

    const unsubscribe2 = savingFoodScaleDown.onChange((sd) => {
      combinedScale.set(scale.get() * sd);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [scale, savingFoodScaleDown, combinedScale]);

  // Combine y and savingFoodMoveY into combinedY
  const combinedY = useMotionValue("0%");
  useEffect(() => {
    const unsubscribe1 = textY.onChange((ty) => {
      const tyNum = parseFloat(ty);
      const myNum = parseFloat(savingFoodMoveY.get());
      combinedY.set(`${tyNum + myNum}%`);
    });

    const unsubscribe2 = savingFoodMoveY.onChange((my) => {
      const tyNum = parseFloat(textY.get());
      const myNum = parseFloat(my);
      combinedY.set(`${tyNum + myNum}%`);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [textY, savingFoodMoveY, combinedY]);

  return (
    <section>
      {/* Navigation Bar */}
      <motion.div style={{ opacity: navOpacity }}>
        <Nav />
      </motion.div>

      {/* Main Container */}
      <div className="relative h-[300vh]" ref={containerRef}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {/* Video Background */}
            <video
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/video/video.webm" type="video/webm" />
              <source src="/video/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* White Overlay with Masked Text */}
            <motion.div
              className="absolute inset-0 z-10"
              style={{
                opacity: whiteOverlayOpacity,
                color: "black",
                backgroundColor: isInitialLoad ? "white" : "transparent",
                transition:
                  "background-color 0.3s ease-out, opacity 0.3s ease-out",
              }}
            >
              <svg width="100%" height="100%" className="overflow-visible">
                <defs>
                  <mask id="textMask">
                    {/* White background for mask */}
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />

                    {/* Black text for transparency */}
                    <motion.text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="black"
                      fontWeight="bold"
                      className="tracking-tight"
                      style={{
                        scale: combinedScale,
                        x: xMove,
                        y: combinedY,
                        fontSize: textFontSize,
                        originX: responsiveOrigin.originX,
                        originY: responsiveOrigin.originY,
                      }}
                    >
                      Saving Food.
                    </motion.text>
                  </mask>
                </defs>
                {/* Overlay Rectangle */}
                <motion.rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="black"
                  style={{
                    opacity: textOverlayOpacity,
                    transition: "opacity 0.3s ease-out",
                  }}
                />
                {/* White rectangle with applied mask */}
                <motion.rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  style={{
                    fill: rectFill,
                  }}
                  mask="url(#textMask)"
                />
              </svg>
            </motion.div>

            {/* "We're" Text Positioned Above "Saving Food." */}
            <motion.section
              style={{
                y: weY,
                opacity: weOpacity,
              }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30"
            >
              <motion.div
                className="font-light font-mono"
                style={{
                  marginBottom: "40px",
                  color: "#A8A8A8",
                  fontSize: weFontSize,
                  // Apply scale down and move up transforms
                  scale: weScaleDown,
                  y: weMoveY,
                }}
              >
                {"We're"}
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </section>
  );
}
