"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskedVideoRef = useRef<HTMLVideoElement>(null); // Reference for masked video

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform values for animations
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 60]);
  const x = useTransform(scrollYProgress, [0, 0.3], ["0%", "-33.33%"]);
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.3], [1, 0]);
  const videoOpacity = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    if (maskedVideoRef.current) {
      maskedVideoRef.current.play();
    }
  }, []);

  return (
    <main ref={containerRef} className="relative h-[500vh] bg-black">
      {/* First Section with Scaling Text and Masked Video */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Container for Masked Video within Text */}
        <motion.div
          style={{
            scale,
            x,
            opacity: textOpacity,
            position: "relative",
            width: "80vw", // Adjust width as needed
            height: "20vh", // Adjust height as needed
          }}
          className="relative"
        >
          {/* SVG Mask Definition */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 1200 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="text-mask" x="0" y="0" width="100%" height="100%">
                {/* White background for mask */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {/* Black text defines the mask area */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="black"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="150" // Adjust font size as needed
                  dy=".35em"
                >
                  OCEAN
                </text>
              </mask>
            </defs>
            {/* Apply the mask to a rectangle */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="black"
              mask="url(#text-mask)"
            />
          </svg>

          {/* Masked Video */}
          <motion.div
            style={{
              opacity: videoOpacity,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            className="mask-container"
          >
            <video
              ref={maskedVideoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/video/video.webm" type="video/webm" />
              <source src="/video/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>

        {/* Full Background Video */}
        <motion.div
          style={{ opacity: videoOpacity }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video/video.webm" type="video/webm" />
            <source src="/video/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>
    </main>
  );
};

export default LandingSection;
