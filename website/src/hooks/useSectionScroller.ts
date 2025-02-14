// hooks/useSectionScroller.ts
import { useEffect, useCallback, useState, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  const { scrollDuration = 800, globalLock = false } = options;
  const [localLock, setLocalLock] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const scrollToSection = useCallback(
    (index: number) => {
      if (sectionsRef.current?.[index]) {
        sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
        setLocalLock(true);
        setTimeout(() => setLocalLock(false), scrollDuration);
      }
    },
    [sectionsRef, scrollDuration]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (localLock || globalLock) {
        e.preventDefault();
        return;
      }
      const sections = sectionsRef.current ?? [];
      let currentIndex = sections.findIndex(
        (el) => el && el.getBoundingClientRect().top >= 0
      );
      if (currentIndex === -1) currentIndex = 0;
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        e.preventDefault();
        scrollToSection(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        e.preventDefault();
        scrollToSection(currentIndex - 1);
      }
    },
    [localLock, globalLock, sectionsRef, scrollToSection]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (localLock || globalLock || touchStartY === null) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        const sections = sectionsRef.current ?? [];
        let currentIndex = sections.findIndex(
          (el) => el && el.getBoundingClientRect().top >= 0
        );
        if (currentIndex === -1) currentIndex = 0;
        if (diff > 0 && currentIndex < sections.length - 1) {
          scrollToSection(currentIndex + 1);
        } else if (diff < 0 && currentIndex > 0) {
          scrollToSection(currentIndex - 1);
        }
      }
      setTouchStartY(null);
    },
    [localLock, globalLock, touchStartY, sectionsRef, scrollToSection]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  return { scrollToSection };
};
