"use client";
import { useEffect } from "react";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValue,
  animate,
} from "framer-motion";
import { Nav } from "./nav";
import { useRef } from "react";

interface MaskedTextProps {
  scrollProgress: MotionValue<number>;
}

export function MaskedText({ scrollProgress }: MaskedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a smoothed version of scrollProgress
  const smoothScrollProgress = useMotionValue(scrollProgress.get());

  useEffect(() => {
    const unsubscribe = scrollProgress.onChange((latest) => {
      animate(smoothScrollProgress, latest, { duration: 0.3 });
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  // Common input range for animations
  const commonInputRange = [0, 0.15, 0.35, 0.36, 0.45, 1];

  // Transform values for animations
  const scale = useTransform(
    smoothScrollProgress,
    commonInputRange,
    [1, 46, 46, 46, 1, 1]
  );

  const xMove = useTransform(smoothScrollProgress, commonInputRange, [
    "0%",
    "30%",
    "30%",
    "30%",
    "0%",
    "0%",
  ]);

  const navOpacity = useTransform(smoothScrollProgress, [0, 0.15], [1, 0]);

  const whiteOverlayOpacity = useTransform(
    smoothScrollProgress,
    commonInputRange,
    [1, 1, 1, 1, 1, 1]
  );

  const textOverlayOpacity = useTransform(
    smoothScrollProgress,
    [0, 0.3, 0.5, 0.6, 0.8],
    [1, 0, 0, 1, 1]
  );

  const rectFill = useTransform(smoothScrollProgress, commonInputRange, [
    "white",
    "white",
    "white",
    "black",
    "black",
    "black",
  ]);

  const textY = useTransform(smoothScrollProgress, commonInputRange, [
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
    "0%",
  ]);

  const textFontSize = useTransform(smoothScrollProgress, commonInputRange, [
    "12vw",
    "12vw",
    "12vw",
    "12vw",
    "12vw",
    "12vw",
  ]);

  const weY = useTransform(
    smoothScrollProgress,
    commonInputRange,
    [0, -800, -800, -800, 0, 0]
  );

  const weOpacity = useTransform(
    smoothScrollProgress,
    commonInputRange,
    [1, 0, 1, 1, 1, 1]
  );

  const weFontSize = useTransform(smoothScrollProgress, commonInputRange, [
    "2vw",
    "2vw",
    "2vw",
    "2vw",
    "2vw",
    "2vw",
  ]);

  return (
    <main>
      {/* Navigation Bar */}
      <motion.div
        style={{ opacity: navOpacity }}
        className="fixed top-0 w-full z-50"
      >
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
              style={{ opacity: whiteOverlayOpacity, color: "black" }}
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
                        scale,
                        x: xMove,
                        y: textY,
                        fontSize: textFontSize,
                        originY: 0.48,
                        originX: 0.61,
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
                className="font-light"
                style={{
                  marginBottom: "40px",
                  color: "#A8A8A8",
                  fontSize: weFontSize,
                }}
              >
                {"We're"}
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}
