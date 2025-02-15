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
  const [localLock, setLocalLock] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [lastScrollTime, setLastScrollTime] = useState<number>(0);

  const scrollToSection = useCallback(
    (index: number) => {
      const now = Date.now();
      if (now - lastScrollTime < scrollDuration) return;
      if (sectionsRef.current && sectionsRef.current[index]) {
        sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
        setLastScrollTime(now);
        setLocalLock(true);
        setTimeout(() => setLocalLock(false), scrollDuration);
      }
    },
    [sectionsRef, scrollDuration, lastScrollTime]
  );

  const handleScroll = useCallback(
    (delta: number) => {
      if (localLock || globalLock || !sectionsRef.current) return;

      const currentSection = sectionsRef.current.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });

      if (currentSection === -1) return;

      const currentElement = sectionsRef.current[currentSection];
      if (!currentElement) return;

      // Allow natural scrolling in the header section if not near its end.
      if (currentElement.id === "header-section") {
        const scrollHeight = currentElement.scrollHeight - window.innerHeight;
        const scrollTop = -currentElement.getBoundingClientRect().top;
        const progress = scrollTop / scrollHeight;
        if (progress < 0.98 || (delta < 0 && progress > 0)) {
          return;
        }
      }

      if (delta > 0 && currentSection < sectionsRef.current.length - 1) {
        scrollToSection(currentSection + 1);
      } else if (delta < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    },
    [localLock, globalLock, sectionsRef, scrollToSection]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    },
    [handleScroll]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartY === null) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        handleScroll(delta);
      }
      setTouchStartY(null);
    },
    [touchStartY, handleScroll]
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
