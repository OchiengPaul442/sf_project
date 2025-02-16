import { useEffect, useCallback, useState, useRef, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * Custom hook to smoothly scroll between sections.
 * When the active section is flagged as non-snapping (via data-section-id, e.g. "how"),
 * the hook will let native scrolling occur.
 */
export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  const { scrollDuration = 800, globalLock = false } = options;

  const [localLock, setLocalLock] = useState<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const wheelDeltaRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);

  const scrollToSection = useCallback(
    (index: number) => {
      // Use non-null assertion since we initialize sectionsRef.current as an array.
      const sections = sectionsRef.current!;
      if (!sections[index]) return;

      // Always allow immediate scrolling when targeting section 0.
      if (index === 0) {
        sections[index]?.scrollIntoView({ behavior: "smooth" });
        lastScrollTimeRef.current = Date.now();
        setLocalLock(true);
        setTimeout(() => setLocalLock(false), scrollDuration);
        return;
      }

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDuration) return;

      sections[index]?.scrollIntoView({ behavior: "smooth" });
      lastScrollTimeRef.current = now;
      setLocalLock(true);
      setTimeout(() => setLocalLock(false), scrollDuration);
    },
    [sectionsRef, scrollDuration]
  );

  const handleScroll = useCallback(
    (delta: number) => {
      if (localLock || globalLock) return;

      const sections = sectionsRef.current!;
      // Determine which section is roughly centered.
      const currentSectionIndex = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });
      if (currentSectionIndex === -1) return;

      const currentSection = sections[currentSectionIndex];
      // If the current section is flagged as non-snapping (e.g. "how"), do nothing.
      if (currentSection?.dataset.sectionId === "how") {
        return;
      }

      if (delta > 0 && currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
      } else if (delta < 0 && currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
      }
    },
    [localLock, globalLock, sectionsRef, scrollToSection]
  );

  // Accumulate wheel delta and only prevent default if we’re not in a non-snapping section.
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const sections = sectionsRef.current!;
      // First, determine the currently centered section.
      const currentSectionIndex = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });
      const currentSection = sections[currentSectionIndex];
      // If we’re inside the "how" section, let native scrolling happen.
      if (currentSection?.dataset.sectionId === "how") {
        return;
      }
      // For other sections, prevent default and handle snapping.
      e.preventDefault();
      wheelDeltaRef.current += e.deltaY;
      const threshold = 50;
      if (Math.abs(wheelDeltaRef.current) >= threshold) {
        handleScroll(wheelDeltaRef.current);
        wheelDeltaRef.current = 0;
      }
    },
    [handleScroll, sectionsRef]
  );

  // Touch events for mobile devices.
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      const sections = sectionsRef.current!;
      const currentSectionIndex = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });
      const currentSection = sections[currentSectionIndex];
      if (currentSection?.dataset.sectionId === "how") {
        return;
      }
      if (Math.abs(delta) > 50) {
        handleScroll(delta);
      }
      touchStartYRef.current = null;
    },
    [handleScroll, sectionsRef]
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
