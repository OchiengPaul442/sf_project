import { useEffect, type MutableRefObject } from "react";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import type { StepWithData } from "@/utils/types/section";
import { JSON_PATHS } from "@/lib/constants";

interface UseAnimationDataReturn {
  isLoading: boolean;
  hasErrors: boolean;
  errors: Record<string, string>;
  animationDataMap: Record<string, any> | null;
}

export const useIntersectionObserver = (
  sectionRefs: MutableRefObject<(HTMLElement | null)[]>,
  onIntersect: (index: number) => void,
  threshold = 0.5
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              onIntersect(index);
            }
          }
        });
      },
      { threshold }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [sectionRefs, onIntersect, threshold]);
};

export const useAnimationData = (
  steps: StepWithData[]
): UseAnimationDataReturn => {
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAssetLoader(JSON_PATHS);

  useEffect(() => {
    if (animationDataMap) {
      // (Optional) Mutate the steps with their respective animation data.
      steps.forEach((step, index) => {
        step.animationData = animationDataMap[JSON_PATHS[index]];
      });
    }
  }, [animationDataMap, steps]);

  return { isLoading, hasErrors, errors, animationDataMap };
};
