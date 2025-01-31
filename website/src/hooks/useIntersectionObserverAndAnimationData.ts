import { useEffect } from "react";
import { useAssetLoader } from "./useAssetLoader";
import type { StepWithData } from "@/utils/types/section";
import { JSON_PATHS } from "@/lib/constants";

export const useAnimationData = (steps: StepWithData[]) => {
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAssetLoader(JSON_PATHS);

  useEffect(() => {
    if (animationDataMap) {
      steps.forEach((step, index) => {
        step.animationData = animationDataMap[JSON_PATHS[index]];
      });
    }
  }, [animationDataMap, steps]);

  return { isLoading, hasErrors, errors, animationDataMap };
};
