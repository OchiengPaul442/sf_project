import { useEffect, useCallback, useState, useRef, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * Custom hook to smoothly scroll between sections for all except "how".
 * While in "how", we allow native scrolling for most of the section, but if the user
 * scrolls near its bottom, we snap to the next section.
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

      // Special case: if current section is "how", only snap if its bottom is near the viewport bottom.
      if (currentSection?.dataset.sectionId === "how") {
        const rect = currentSection.getBoundingClientRect();
        // If scrolling down and the bottom of "how" is close to the viewport bottom, snap to next.
        if (delta > 0 && rect.bottom <= window.innerHeight + 50) {
          scrollToSection(currentSectionIndex + 1);
        }
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

  // Listen for wheel events and accumulate the delta; adjust snapping for "how".
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

      // For "how" section, if scrolling down and nearing its bottom, prevent default and snap.
      if (currentSection?.dataset.sectionId === "how") {
        const rect = currentSection.getBoundingClientRect();
        if (e.deltaY > 0 && rect.bottom <= window.innerHeight + 50) {
          e.preventDefault();
          scrollToSection(currentSectionIndex + 1);
          return;
        }
        // Otherwise, allow native scrolling inside "how"
        return;
      }

      // For other sections, prevent default and accumulate delta.
      e.preventDefault();
      wheelDeltaRef.current += e.deltaY;
      const threshold = 50;
      if (Math.abs(wheelDeltaRef.current) >= threshold) {
        handleScroll(wheelDeltaRef.current);
        wheelDeltaRef.current = 0;
      }
    },
    [handleScroll, sectionsRef, scrollToSection]
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

      // For "how", if scrolling down and nearing the bottom, snap.
      if (currentSection?.dataset.sectionId === "how") {
        const rect = currentSection.getBoundingClientRect();
        if (delta > 50 && rect.bottom <= window.innerHeight + 50) {
          scrollToSection(currentSectionIndex + 1);
          touchStartYRef.current = null;
          return;
        }
        // Otherwise, allow native scrolling.
        touchStartYRef.current = null;
        return;
      }

      // Otherwise, if delta is significant, snap accordingly.
      if (Math.abs(delta) > 50) {
        handleScroll(delta);
      }

      touchStartYRef.current = null;
    },
    [handleScroll, sectionsRef, scrollToSection]
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
