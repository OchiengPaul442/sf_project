"use client";

import React from "react";

const VideoSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Video Background */}
    <video
      className="absolute inset-0 w-full h-screen object-cover"
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
    {/* Optional: Add overlay or content here */}
  </section>
);

export default VideoSection;
