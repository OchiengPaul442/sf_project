"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0.3, 0.6], [1, 1.2]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Error attempting to play video:", error);
      });
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <motion.div className="w-full h-full" style={{ scale: videoScale }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/video/video.webm" type="video/webm" />
          <source src="/video/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  );
}
