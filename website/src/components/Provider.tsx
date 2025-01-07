"use client";

import React, { useState, useEffect } from "react";
import Loader from "@/views/loader";

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      // Load your images and JSON files here
      await Promise.all([
        loadImage("/images/logo.png"),
        loadImage("/images/logo-white.png"),
        loadVideo("/video/video.webm"),
        loadVideo("/video/video.mp4"),
        // loadJSON("/path/to/animation.json"),
      ]);

      setIsLoading(false);
    };

    loadAssets();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

// Helper functions to load assets
const loadImage = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });

const loadVideo = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.oncanplaythrough = () => resolve();
    video.onerror = reject;
    video.src = src;
    video.load();
  });

// const loadJSON = async (url: string): Promise<void> => {
//   const response = await fetch(url);
//   await response.json();
// };
