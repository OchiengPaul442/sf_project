import { useEffect, type MutableRefObject } from "react";

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
            if (index !== -1) onIntersect(index);
          }
        });
      },
      { threshold }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
      observer.disconnect();
    };
  }, [sectionRefs, onIntersect, threshold]);
};
