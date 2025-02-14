import { useEffect, useCallback, useState, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * Adjust this constant to control how complete the header scroll must be before snapping.
 */
const HEADER_PROGRESS_THRESHOLD = 0.99;

export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  const { scrollDuration = 800, globalLock = false } = options;
  const [localLock, setLocalLock] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const scrollToSection = useCallback(
    (index: number) => {
      if (sectionsRef.current && sectionsRef.current[index]) {
        sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
        setLocalLock(true);
        setTimeout(() => setLocalLock(false), scrollDuration);
      }
    },
    [sectionsRef, scrollDuration]
  );

  const getCurrentSectionIndex = useCallback(() => {
    if (!sectionsRef.current) return 0;
    const midpoint = window.innerHeight / 2;
    const sections = sectionsRef.current;
    const currentIndex = sections.findIndex((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= midpoint && rect.bottom >= midpoint;
    });
    return currentIndex === -1 ? 0 : currentIndex;
  }, [sectionsRef]);

  const getHeaderProgress = (el: HTMLElement): number => {
    const totalScrollable = el.offsetHeight - window.innerHeight;
    const progress = -el.getBoundingClientRect().top / totalScrollable;
    return Math.min(1, Math.max(0, progress));
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (localLock || globalLock || !sectionsRef.current) return;

      const currentIndex = getCurrentSectionIndex();
      const currentEl = sectionsRef.current[currentIndex];

      if (currentEl?.id === "header-section") {
        const progress = getHeaderProgress(currentEl);
        // Allow natural scrolling until the header is almost completely scrolled.
        if (
          (e.deltaY > 0 && progress < HEADER_PROGRESS_THRESHOLD) ||
          (e.deltaY < 0 && progress > 0)
        ) {
          return;
        }
      }

      e.preventDefault();
      if (e.deltaY > 0 && currentIndex < sectionsRef.current.length - 1) {
        scrollToSection(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        scrollToSection(currentIndex - 1);
      }
    },
    [
      localLock,
      globalLock,
      sectionsRef,
      getCurrentSectionIndex,
      scrollToSection,
    ]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (
        localLock ||
        globalLock ||
        touchStartY === null ||
        !sectionsRef.current
      )
        return;

      const diff = touchStartY - e.changedTouches[0].clientY;
      const currentIndex = getCurrentSectionIndex();
      const currentEl = sectionsRef.current[currentIndex];

      if (currentEl?.id === "header-section") {
        const progress = getHeaderProgress(currentEl);
        if (
          (diff > 0 && progress < HEADER_PROGRESS_THRESHOLD) ||
          (diff < 0 && progress > 0)
        ) {
          setTouchStartY(null);
          return;
        }
      }

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < sectionsRef.current.length - 1) {
          scrollToSection(currentIndex + 1);
        } else if (diff < 0 && currentIndex > 0) {
          scrollToSection(currentIndex - 1);
        }
      }
      setTouchStartY(null);
    },
    [
      localLock,
      globalLock,
      touchStartY,
      sectionsRef,
      getCurrentSectionIndex,
      scrollToSection,
    ]
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
