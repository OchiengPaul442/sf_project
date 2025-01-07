"use client";

import React, { useState, useEffect, useCallback } from "react";
import Loader from "@/views/loader";

/**
 * Provider component that preloads images/videos (and optionally JSON)
 * before rendering the entire application.
 */
export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads all required assets (images, videos, JSON files) in parallel.
   * Errors are caught and logged, but the application will still render.
   */
  const loadAllAssets = useCallback(async () => {
    try {
      // Extend this array with any assets you need to preload
      await Promise.all([
        loadImage("/images/logo.png"),
        loadImage("/images/logo-white.png"),
        loadVideo("/video/video.webm"),
        loadVideo("/video/video.mp4"),
        loadJSON("/lib/lottie/angel.json"),
        loadJSON("/lib/lottie/boat.json"),
        loadJSON("/lib/lottie/maker.json"),
        loadJSON("/lib/lottie/spaghetti.json"),
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading assets:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Preload all assets
    loadAllAssets();
  }, [loadAllAssets]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

/* -------------------------------------------------------------------------- */
/*                            Helper Functions                                */
/* -------------------------------------------------------------------------- */

/**
 * Loads an image from a given src, returning a Promise<void>.
 */
const loadImage = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
    img.src = src;
  });

/**
 * Loads a video from a given src, returning a Promise<void>.
 */
const loadVideo = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.oncanplaythrough = () => resolve();
    video.onerror = (err) => reject(err);
    video.src = src;
    video.load();
  });

/**
 * Fetches and validates a JSON file, returning a Promise<void>.
 */
const loadJSON = async (url: string): Promise<void> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON at ${url}`);
  }
  await response.json();
};
