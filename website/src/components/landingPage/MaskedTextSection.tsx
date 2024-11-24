"use client";

import React from "react";

interface MaskedTextSectionProps {
  maskId: string;
  fontSize: number;
}

const MaskedTextSection: React.FC<MaskedTextSectionProps> = ({
  maskId,
  fontSize,
}) => (
  <section className="relative w-full h-screen container mx-auto flex flex-col items-center justify-center overflow-hidden">
    {/* Top Text */}
    <div className="text-gray-300 text-xl md:text-2xl font-medium mb-4 z-10">
      We&apos;re
    </div>

    {/* Masked Video Text */}
    <div className="relative w-full max-w-5xl h-[200px] flex justify-center items-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
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

      {/* SVG for Text Mask */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-full h-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id={maskId} x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              fill="black"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
              fontSize={fontSize}
            >
              Saving Food
            </text>
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="black"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  </section>
);

export default MaskedTextSection;
