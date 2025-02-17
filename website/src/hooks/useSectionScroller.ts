// useSectionScroller.ts
import { useEffect, useCallback, useState, useRef, RefObject } from "react";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * A custom hook for snapping smoothly between sections.
 *
 * Enhancements:
 * - Uses a timestamp lock and timeout (cleared on unmount) to prevent too‑rapid triggering.
 * - Uses special handling for the "how", "how-carousel", and "work" sections so that when scrolling
 *   upward from "work" the "how-carousel" is always snapped to.
 * - Uses appropriate passive options for event listeners and checks event.cancelable before calling preventDefault.
 * - Cleans up all timeouts and event listeners to avoid memory leaks.
 */
export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  const { scrollDuration = 800, globalLock = false } = options;
  const [localLock, setLocalLock] = useState<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Scrolls smoothly to the section at the given index.
  const scrollToSection = useCallback(
    (index: number) => {
      const sections = sectionsRef.current || [];
      const targetSection = sections[index];
      if (!targetSection) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDuration) return;

      // Use native smooth scrolling.
      targetSection.scrollIntoView({ behavior: "smooth" });
      lastScrollTimeRef.current = now;
      setLocalLock(true);

      // Clear any pending timeout.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setLocalLock(false);
      }, scrollDuration);
    },
    [sectionsRef, scrollDuration]
  );

  // Returns the index of the section whose center is closest to the viewport center.
  const getCenteredSectionIndex = useCallback(() => {
    const sections = sectionsRef.current || [];
    let centeredIndex = 0;
    let smallestDiff = Infinity;
    sections.forEach((section, index) => {
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionCenter = (rect.top + rect.bottom) / 2;
        const viewportCenter = window.innerHeight / 2;
        const diff = Math.abs(sectionCenter - viewportCenter);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          centeredIndex = index;
        }
      }
    });
    return centeredIndex;
  }, [sectionsRef]);

  // Given a scroll delta, decide which section to snap to.
  const handleDelta = useCallback(
    (delta: number) => {
      if (localLock || globalLock) return;
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;

      const sectionId = currentSection.dataset.sectionId;
      const rect = currentSection.getBoundingClientRect();

      // Special snapping for the "how" section.
      if (sectionId === "how") {
        if (delta > 0 && rect.bottom <= window.innerHeight + 40) {
          scrollToSection(currentIndex + 1);
        }
        return;
      }
      // Special snapping for the "work" section when scrolling down.
      if (sectionId === "work") {
        if (delta > 0 && rect.bottom <= window.innerHeight + 60) {
          scrollToSection(currentIndex + 1);
        }
        return;
      }
      // For all other cases, use general snapping.
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
      // Only call preventDefault if allowed.
      if (e.cancelable && !e.defaultPrevented) {
        // Determine current section by its center.
        const sections = sectionsRef.current || [];
        const currentIndex = getCenteredSectionIndex();
        const currentSection = sections[currentIndex];
        if (!currentSection) return;

        const sectionId = currentSection.dataset.sectionId;
        const rect = currentSection.getBoundingClientRect();

        // Special case: when scrolling up from "work", always snap to "how-carousel" if it exists.
        if (e.deltaY < 0 && sectionId === "work") {
          const prevIndex = currentIndex - 1;
          if (
            prevIndex >= 0 &&
            sections[prevIndex] &&
            sections[prevIndex].dataset.sectionId === "how-carousel"
          ) {
            e.preventDefault();
            scrollToSection(prevIndex);
            return;
          }
        }

        // Special handling for the "how" section when scrolling down.
        if (sectionId === "how") {
          if (e.deltaY > 0 && rect.bottom <= window.innerHeight + 40) {
            e.preventDefault();
            scrollToSection(currentIndex + 1);
            return;
          }
          return; // Allow native scrolling otherwise.
        }
        // Special handling for the "work" section when scrolling down.
        if (sectionId === "work") {
          if (e.deltaY > 0 && rect.bottom <= window.innerHeight + 60) {
            e.preventDefault();
            scrollToSection(currentIndex + 1);
            return;
          }
          return;
        }
        // For all other sections, always prevent native scrolling and handle snapping.
        if (Math.abs(e.deltaY) > 40) {
          e.preventDefault();
          handleDelta(e.deltaY);
        }
      }
    },
    [getCenteredSectionIndex, scrollToSection, handleDelta, sectionsRef]
  );

  // Record the starting touch position.
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  // Handle touch end events.
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;

      const sectionId = currentSection.dataset.sectionId;
      const rect = currentSection.getBoundingClientRect();

      // Special case: scrolling up from "work" should snap to "how-carousel".
      if (delta < 0 && sectionId === "work") {
        const prevIndex = currentIndex - 1;
        if (
          prevIndex >= 0 &&
          sections[prevIndex] &&
          sections[prevIndex].dataset.sectionId === "how-carousel"
        ) {
          scrollToSection(prevIndex);
          touchStartYRef.current = null;
          return;
        }
      }

      // Special snapping for the "how" section.
      if (sectionId === "how") {
        if (delta > 30 && rect.bottom <= window.innerHeight + 40) {
          scrollToSection(currentIndex + 1);
          touchStartYRef.current = null;
          return;
        }
        touchStartYRef.current = null;
        return;
      }
      // Special snapping for the "work" section when scrolling down.
      if (sectionId === "work") {
        if (delta > 30 && rect.bottom <= window.innerHeight + 60) {
          scrollToSection(currentIndex + 1);
          touchStartYRef.current = null;
          return;
        }
        touchStartYRef.current = null;
        return;
      }
      // For other sections, if the gesture is significant, use our snapping logic.
      if (Math.abs(delta) > 30) {
        handleDelta(delta);
      }
      touchStartYRef.current = null;
    },
    [getCenteredSectionIndex, scrollToSection, handleDelta, sectionsRef]
  );

  // Set up event listeners and clean up on unmount.
  useEffect(() => {
    const wheelOptions: AddEventListenerOptions = { passive: false };
    window.addEventListener("wheel", handleWheel, wheelOptions);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  // Clear any pending timeout when the hook unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { scrollToSection };
};
