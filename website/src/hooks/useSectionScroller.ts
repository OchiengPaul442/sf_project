import { useEffect, useCallback, useState, useRef, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * Custom hook to smoothly scroll between sections.
 * - For the "how" section, native scrolling is allowed until its bottom nears the viewport.
 * - For the "work" section, native scrolling is allowed—but when its bottom nears the viewport (using a higher threshold), a snap to the footer occurs.
 * - For other sections, a snapping effect is applied.
 *
 * This version uses centered-section detection and refined thresholds for improved smoothness.
 */
export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  const { scrollDuration = 800, globalLock = false } = options;
  const [localLock, setLocalLock] = useState<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);

  // Smoothly scroll to a given section index.
  const scrollToSection = useCallback(
    (index: number) => {
      const sections = sectionsRef.current || [];
      if (!sections[index]) return;
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDuration) return;
      sections[index]?.scrollIntoView({ behavior: "smooth" });
      lastScrollTimeRef.current = now;
      setLocalLock(true);
      setTimeout(() => setLocalLock(false), scrollDuration);
    },
    [sectionsRef, scrollDuration]
  );

  // Get the index of the section whose center is closest to the viewport center.
  const getCenteredSectionIndex = useCallback(() => {
    const sections = sectionsRef.current || [];
    let centeredIndex = 0;
    let smallestDiff = Infinity;
    sections.forEach((section, index) => {
      if (section) {
        const rect = section.getBoundingClientRect();
        const center = (rect.top + rect.bottom) / 2;
        const diff = Math.abs(center - window.innerHeight / 2);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          centeredIndex = index;
        }
      }
    });
    return centeredIndex;
  }, [sectionsRef]);

  // Handle a scroll delta by snapping to the next/previous section.
  const handleDelta = useCallback(
    (delta: number) => {
      if (localLock || globalLock) return;
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;

      // For "how": if scrolling down and the bottom is nearly reached, snap.
      if (currentSection.dataset.sectionId === "how") {
        const rect = currentSection.getBoundingClientRect();
        if (delta > 0 && rect.bottom <= window.innerHeight + 40) {
          scrollToSection(currentIndex + 1);
        }
        return;
      }
      // For "work": allow native scrolling but if its bottom nears the viewport, use a higher threshold.
      if (currentSection.dataset.sectionId === "work") {
        const rect = currentSection.getBoundingClientRect();
        if (delta > 0 && rect.bottom <= window.innerHeight + 60) {
          scrollToSection(currentIndex + 1);
        }
        return;
      }
      // For all other sections, snap up or down.
      if (delta > 0 && currentIndex < sections.length - 1) {
        scrollToSection(currentIndex + 1);
      } else if (delta < 0 && currentIndex > 0) {
        scrollToSection(currentIndex - 1);
      }
    },
    [
      localLock,
      globalLock,
      getCenteredSectionIndex,
      scrollToSection,
      sectionsRef,
    ]
  );

  // Handle wheel events.
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;

      // For "how": if scrolling down and near its bottom, prevent default and snap.
      if (currentSection.dataset.sectionId === "how") {
        const rect = currentSection.getBoundingClientRect();
        if (e.deltaY > 0 && rect.bottom <= window.innerHeight + 40) {
          e.preventDefault();
          scrollToSection(currentIndex + 1);
          return;
        }
        return; // Otherwise, allow native scrolling.
      }
      // For "work": if scrolling down and near its bottom (using higher threshold), snap.
      if (currentSection.dataset.sectionId === "work") {
        const rect = currentSection.getBoundingClientRect();
        if (e.deltaY > 0 && rect.bottom <= window.innerHeight + 60) {
          e.preventDefault();
          scrollToSection(currentIndex + 1);
          return;
        }
        return;
      }
      // For other sections, prevent default and use our snapping.
      e.preventDefault();
      if (Math.abs(e.deltaY) > 40) {
        handleDelta(e.deltaY);
      }
    },
    [getCenteredSectionIndex, scrollToSection, handleDelta, sectionsRef]
  );

  // Handle touch events.
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;
      // For "how": if scrolling down and near its bottom, snap.
      if (currentSection.dataset.sectionId === "how") {
        const rect = currentSection.getBoundingClientRect();
        if (delta > 30 && rect.bottom <= window.innerHeight + 40) {
          scrollToSection(currentIndex + 1);
          touchStartYRef.current = null;
          return;
        }
        touchStartYRef.current = null;
        return;
      }
      // For "work": if scrolling down and near its bottom (with higher threshold), snap.
      if (currentSection.dataset.sectionId === "work") {
        const rect = currentSection.getBoundingClientRect();
        if (delta > 30 && rect.bottom <= window.innerHeight + 60) {
          scrollToSection(currentIndex + 1);
          touchStartYRef.current = null;
          return;
        }
        touchStartYRef.current = null;
        return;
      }
      if (Math.abs(delta) > 30) {
        handleDelta(delta);
      }
      touchStartYRef.current = null;
    },
    [getCenteredSectionIndex, scrollToSection, handleDelta, sectionsRef]
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
