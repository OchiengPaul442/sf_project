import { useEffect, useState, useCallback } from "react";

interface AssetLoaderResult {
  isLoading: boolean;
  hasErrors: boolean;
  errors: Record<string, string>;
  animationDataMap: Record<string, any>;
}

export const useAssetLoader = (paths: readonly string[]): AssetLoaderResult => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    Object.fromEntries(paths.map((path) => [path, true]))
  );
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );

  const loadAsset = useCallback(async (path: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok)
        throw new Error(`Failed to load ${path}: ${response.statusText}`);
      const data = await response.json();
      setAnimationDataMap((prev) => ({ ...prev, [path]: data }));
      setLoadingStates((prev) => ({ ...prev, [path]: false }));
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
      setErrorStates((prev) => ({
        ...prev,
        [path]: error instanceof Error ? error.message : String(error),
      }));
      setLoadingStates((prev) => ({ ...prev, [path]: false }));
    }
  }, []);

  useEffect(() => {
    paths.forEach((path) => loadAsset(path));
  }, [paths, loadAsset]);

  const isLoading = Object.values(loadingStates).some((state) => state);
  const hasErrors = Object.keys(errorStates).length > 0;

  return { isLoading, hasErrors, errors: errorStates, animationDataMap };
};
