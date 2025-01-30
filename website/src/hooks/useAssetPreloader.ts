import { useState, useEffect, useRef } from "react";

const PRELOAD_TIMEOUT = 10000;

export const useAssetPreloader = (jsonPaths: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const preloadAssets = async () => {
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn("Asset loading timeout - forcing load completion.");
        setIsLoading(false);
      }, PRELOAD_TIMEOUT);

      try {
        const fetchedData = await Promise.all(
          jsonPaths.map(async (path) => {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`Failed to load ${path}`);
            const json = await res.json();
            return { path, data: json };
          })
        );

        const dataMap: Record<string, any> = {};
        fetchedData.forEach(({ path, data }) => {
          dataMap[path] = data;
        });

        setAnimationDataMap(dataMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Asset preload error:", error);
        setIsLoading(false);
      } finally {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      }
    };

    preloadAssets();
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [jsonPaths]);

  return { isLoading, animationDataMap };
};
