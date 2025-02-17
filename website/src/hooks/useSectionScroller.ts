// useSectionScroller.tsx
import { useEffect, useCallback, useState, useRef, RefObject } from "react";
import { useIsMobile } from "./useIsMobile";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
}

/**
 * A custom hook for snapping smoothly between sections.
 *
 * On mobile devices (or when a touchpad is detected on desktop), native scrolling
 * is used for most sections except the header ("home"). On desktop with a mouse wheel,
 * snapping is preserved for non-header sections (with special cases for "how" and "work").
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

  // Determine if we are on a mobile device.
  const isMobile = useIsMobile();

  // Scrolls smoothly to the section at the given index.
  const scrollToSection = useCallback(
    (index: number) => {
      const sections = sectionsRef.current || [];
      const targetSection = sections[index];
      if (!targetSection) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDuration) return;

      targetSection.scrollIntoView({ behavior: "smooth" });
      lastScrollTimeRef.current = now;
      setLocalLock(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  /**
   * Decide which section to scroll to given a scroll delta.
   *
   * On mobile (or when a touchpad is detected), only the header ("home")
   * forces snapping; other sections use native scrolling.
   *
   * On desktop with a mouse wheel, special snapping is applied for "how" and "work"
   * and general snapping is applied for non-header sections.
   */
  const handleDelta = useCallback(
    (delta: number) => {
      if (localLock || globalLock) return;
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;
      const sectionId = currentSection.dataset.sectionId;

      // For mobile or when touchpad scrolling is active, we force snapping only on the header.
      if (isMobile) {
        if (sectionId === "home") {
          if (delta > 30 && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
            return;
          }
          if (delta < -30 && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
            return;
          }
        }
        // Otherwise, let native scrolling occur.
        return;
      }

      // Desktop mouse wheel snapping for non-touchpad scrolling.
      if (sectionId === "how") {
        if (
          delta > 0 &&
          currentSection.getBoundingClientRect().bottom <=
            window.innerHeight + 40
        ) {
          scrollToSection(currentIndex + 1);
        }
        return;
      }
      if (sectionId === "work") {
        if (
          delta > 0 &&
          currentSection.getBoundingClientRect().bottom <=
            window.innerHeight + 60
        ) {
          scrollToSection(currentIndex + 1);
        }
        return;
      }
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
      isMobile,
    ]
  );

  // Handle wheel events.
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.cancelable && !e.defaultPrevented) {
        // Detect touchpad scrolling by a small deltaY (adjust threshold as needed)
        const isTouchpad = Math.abs(e.deltaY) < 20;
        const sections = sectionsRef.current || [];
        const currentIndex = getCenteredSectionIndex();
        const currentSection = sections[currentIndex];
        if (!currentSection) return;
        const sectionId = currentSection.dataset.sectionId;

        // If using touchpad (or on mobile), only snap for the header.
        if ((isMobile || isTouchpad) && sectionId !== "home") {
          // Let native scrolling occur.
          return;
        }

        // Desktop (mouse wheel) special handling:
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
        if (sectionId === "how") {
          if (
            e.deltaY > 0 &&
            currentSection.getBoundingClientRect().bottom <=
              window.innerHeight + 40
          ) {
            e.preventDefault();
            scrollToSection(currentIndex + 1);
            return;
          }
          return;
        }
        if (sectionId === "work") {
          if (
            e.deltaY > 0 &&
            currentSection.getBoundingClientRect().bottom <=
              window.innerHeight + 60
          ) {
            e.preventDefault();
            scrollToSection(currentIndex + 1);
            return;
          }
          return;
        }
        if (Math.abs(e.deltaY) > 40) {
          e.preventDefault();
          handleDelta(e.deltaY);
        }
      }
    },
    [
      getCenteredSectionIndex,
      scrollToSection,
      handleDelta,
      sectionsRef,
      isMobile,
    ]
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

      // On mobile, apply snapping only for the header.
      if (isMobile) {
        if (sectionId === "home") {
          if (delta > 30 && currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
            touchStartYRef.current = null;
            return;
          }
          if (delta < -30 && currentIndex > 0) {
            scrollToSection(currentIndex - 1);
            touchStartYRef.current = null;
            return;
          }
        }
        // Otherwise, let native scrolling occur.
        touchStartYRef.current = null;
        return;
      }

      // Desktop logic remains the same.
      if (sectionId === "how") {
        if (
          delta > 30 &&
          currentSection.getBoundingClientRect().bottom <=
            window.innerHeight + 40
        ) {
          scrollToSection(currentIndex + 1);
          touchStartYRef.current = null;
          return;
        }
        touchStartYRef.current = null;
        return;
      }
      if (sectionId === "work") {
        if (
          delta > 30 &&
          currentSection.getBoundingClientRect().bottom <=
            window.innerHeight + 60
        ) {
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
    [
      getCenteredSectionIndex,
      scrollToSection,
      handleDelta,
      sectionsRef,
      isMobile,
    ]
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
      if (animationFrameRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { scrollToSection };
};
