"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Nav } from "./nav";
import { useRef } from "react";

interface MaskedTextProps {
  scrollProgress: MotionValue<number>;
}

export function MaskedText({ scrollProgress }: MaskedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform values for animations
  const scale = useTransform(scrollProgress, [0, 0.3], [1, 46]);
  const xMove = useTransform(scrollProgress, [0, 0.3], ["0%", "30%"]);
  const navOpacity = useTransform(scrollProgress, [0, 0.15], [1, 0]);
  const whiteOverlayOpacity = useTransform(scrollProgress, [0.2, 0.3], [1, 0]);

  // Transform for "We're" text
  const weY = useTransform(scrollProgress, [0, 0.3], [0, -800]); // Moves up by 800px
  const weOpacity = useTransform(scrollProgress, [0, 0.1], [1, 0]);

  return (
    <main className="bg-white text-black">
      {/* Nav Component */}
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
              style={{ opacity: whiteOverlayOpacity }}
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
                      fontSize="12vw"
                      fontWeight="bold"
                      className="tracking-tight"
                      style={{
                        scale,
                        x: xMove,
                        originY: 0.48,
                        originX: 0.61,
                      }}
                    >
                      Saving Food.
                    </motion.text>
                  </mask>
                </defs>
                {/* White rectangle with applied mask */}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="white"
                  mask="url(#textMask)"
                />
              </svg>
            </motion.div>

            {/* "We're" Text Positioned Above "Saving Food." */}
            <motion.div
              style={{
                y: weY,
                opacity: weOpacity,
              }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-20"
            >
              <div className="text-gray-400 text-[2vw] font-light">
                {"We're"}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
