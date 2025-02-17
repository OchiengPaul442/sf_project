import { useEffect, useCallback, useState, useRef, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * Custom hook to smoothly scroll between sections for all except "how".
 * While in "how", we allow normal (native) scrolling so the user can see
 * the sticky scrollytelling effect.
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
      const sections = sectionsRef.current || [];
      if (!sections[index]) return;

      const now = Date.now();
      // Ensure we don’t trigger another snap too soon
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

      const sections = sectionsRef.current || [];
      // Find which section is roughly centered
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

      // If we’re inside the "how" section, allow normal scrolling (no snap).
      if (currentSection?.dataset.sectionId === "how") {
        return;
      }

      // Otherwise, snap to the next/previous section
      if (delta > 0 && currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
      } else if (delta < 0 && currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
      }
    },
    [localLock, globalLock, sectionsRef, scrollToSection]
  );

  // Listen for wheel events and accumulate the delta; skip snapping if in "how".
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const sections = sectionsRef.current || [];

      // Determine which section is roughly centered
      const currentSectionIndex = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });

      const currentSection = sections[currentSectionIndex];
      // If "how", do NOT prevent default; let normal scroll proceed
      if (currentSection?.dataset.sectionId === "how") {
        return;
      }

      // Otherwise, we do want to snap, so prevent default
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

  // Touch events for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;

      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      const sections = sectionsRef.current || [];

      const currentSectionIndex = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        );
      });
      const currentSection = sections[currentSectionIndex];

      // If "how", let normal scrolling happen
      if (currentSection?.dataset.sectionId === "how") {
        touchStartYRef.current = null;
        return;
      }

      // Otherwise, snap
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
