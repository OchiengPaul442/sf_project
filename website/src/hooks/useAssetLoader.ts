"use client";

import { useState, useEffect } from "react";

export const useAssetLoader = (paths: readonly string[]) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    paths.reduce((acc, path) => ({ ...acc, [path]: true }), {})
  );
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const loadAsset = async (path: string) => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to load ${path}: ${response.statusText}`);
        }
        const data = await response.json();
        setAnimationDataMap((prev) => ({ ...prev, [path]: data }));
        setLoadingStates((prev) => ({ ...prev, [path]: false }));
      } catch (error) {
        console.error(`Error loading ${path}:`, error);
        setErrorStates((prev) => ({
          ...prev,
          [path]: (error as Error).message,
        }));
        setLoadingStates((prev) => ({ ...prev, [path]: false }));
      }
    };

    paths.forEach((path) => {
      loadAsset(path);
    });
  }, [paths]);

  const isLoading = Object.values(loadingStates).some((state) => state);
  const hasErrors = Object.keys(errorStates).length > 0;

  return {
    isLoading,
    hasErrors,
    errors: errorStates,
    animationDataMap,
  };
};
