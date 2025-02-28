import { useEffect, useCallback, useState, useRef, RefObject } from "react";
import { useIsMobile } from "./useIsMobile";

interface SectionScrollerOptions {
  scrollDuration?: number;
  globalLock?: boolean;
  wheelThreshold?: number; // Threshold for wheel delta before snapping (default: 40)
  swipeThreshold?: number; // Threshold for touch delta before snapping (default: 30)
}

/**
 * A custom hook for snapping smoothly between sections on both mobile and desktop.
 * This version increases the scroll duration and uses locking to prevent too-fast snaps.
 */
export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  // Increase default scroll duration to slow down snapping.
  const {
    scrollDuration = 1000,
    globalLock = false,
    wheelThreshold = 40,
    swipeThreshold = 30,
  } = options;

  const isMobile = useIsMobile();

  // Local lock to prevent repeated snap triggers.
  const [localLock, setLocalLock] = useState(false);
  // Timestamp of the last scroll snap.
  const lastScrollTimeRef = useRef(0);
  // Record the starting Y for touch swipes.
  const touchStartYRef = useRef<number | null>(null);
  // Ref to hold timeout ID for unlocking scroll.
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // RAF ref for throttling wheel events.
  const wheelRAFRef = useRef<number | null>(null);
  // Store last wheel event for processing.
  const lastWheelEventRef = useRef<WheelEvent | null>(null);

  /**
   * Smoothly scroll to a given section index, respecting lock and rate limits.
   */
  const scrollToSection = useCallback(
    (index: number) => {
      const sections = sectionsRef.current || [];
      const targetSection = sections[index];
      if (!targetSection) return;

      const now = Date.now();
      // Rate limit scroll snaps.
      if (now - lastScrollTimeRef.current < scrollDuration) return;

      targetSection.scrollIntoView({ behavior: "smooth" });
      // Lock local scrolling to prevent rapid triggers.
      setLocalLock(true);
      lastScrollTimeRef.current = now;

      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        setLocalLock(false);
      }, scrollDuration);
    },
    [sectionsRef, scrollDuration]
  );

  /**
   * Returns the index of the section closest to the vertical center of the viewport.
   */
  const getCenteredSectionIndex = useCallback(() => {
    const sections = sectionsRef.current || [];
    let centeredIndex = 0;
    let smallestDiff = Infinity;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      const sectionCenter = (rect.top + rect.bottom) / 2;
      const viewportCenter = window.innerHeight / 2;
      const diff = Math.abs(sectionCenter - viewportCenter);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        centeredIndex = i;
      }
    }

    return centeredIndex;
  }, [sectionsRef]);

  /**
   * Snap relative to the current section index in the given direction.
   */
  const snapRelative = useCallback(
    (direction: "next" | "prev") => {
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
      // Clamp the index.
      newIndex = Math.max(0, Math.min(newIndex, sections.length - 1));
      if (newIndex !== currentIndex) {
        scrollToSection(newIndex);
      }
    },
    [scrollToSection, getCenteredSectionIndex, sectionsRef]
  );

  /**
   * Process a scroll delta and determine whether to snap to a new section.
   */
  const handleDelta = useCallback(
    (delta: number) => {
      if (localLock || globalLock) return;

      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;

      const sectionId = currentSection.dataset.sectionId;

      // --- MOBILE LOGIC ---
      if (isMobile) {
        // For "robot": if the user swipes downward significantly, snap to previous (likely "home").
        if (
          sectionId === "robot" &&
          delta < -swipeThreshold &&
          currentIndex > 0
        ) {
          snapRelative("prev");
          return;
        }
        // For "home": snap on significant swipes up or down.
        if (sectionId === "home") {
          if (delta > swipeThreshold) {
            snapRelative("next");
            return;
          } else if (delta < -swipeThreshold) {
            snapRelative("prev");
            return;
          }
        }
        // Other sections on mobile: allow native scrolling.
        return;
      }

      // --- DESKTOP LOGIC ---
      // Special handling for "how": snap forward if bottom is nearly visible.
      if (sectionId === "how") {
        const bottom = currentSection.getBoundingClientRect().bottom;
        if (delta > 0 && bottom <= window.innerHeight + 40) {
          snapRelative("next");
        }
        return;
      }
      // Special handling for "work": similar logic.
      if (sectionId === "work") {
        const bottom = currentSection.getBoundingClientRect().bottom;
        if (delta > 0 && bottom <= window.innerHeight + 60) {
          snapRelative("next");
        }
        return;
      }

      // General snapping for other sections.
      if (delta > 0) snapRelative("next");
      else if (delta < 0) snapRelative("prev");
    },
    [
      localLock,
      globalLock,
      sectionsRef,
      isMobile,
      getCenteredSectionIndex,
      snapRelative,
      swipeThreshold,
    ]
  );

  /**
   * Throttled wheel event handler using requestAnimationFrame.
   */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      lastWheelEventRef.current = e;

      if (wheelRAFRef.current === null) {
        wheelRAFRef.current = requestAnimationFrame(() => {
          wheelRAFRef.current = null;
          const event = lastWheelEventRef.current;
          if (!event) return;

          // Use heuristic: if delta is small, likely a touchpad.
          const isTouchpad = Math.abs(event.deltaY) < 20;
          const sections = sectionsRef.current || [];
          const currentIndex = getCenteredSectionIndex();
          const currentSection = sections[currentIndex];
          if (!currentSection) return;

          const sectionId = currentSection.dataset.sectionId;

          // On mobile or when using a touchpad (except in "home"), let native scrolling occur.
          if ((isMobile || isTouchpad) && sectionId !== "home") {
            return;
          }

          // Special case: scrolling up from "work" to "how-carousel".
          if (event.deltaY < 0 && sectionId === "work") {
            const prevIndex = currentIndex - 1;
            if (
              prevIndex >= 0 &&
              sections[prevIndex]?.dataset.sectionId === "how-carousel"
            ) {
              event.preventDefault();
              scrollToSection(prevIndex);
              return;
            }
          }

          // Special handling for "how" and "work" to avoid partial scroll.
          if (
            (sectionId === "how" &&
              event.deltaY > 0 &&
              currentSection.getBoundingClientRect().bottom <=
                window.innerHeight + 40) ||
            (sectionId === "work" &&
              event.deltaY > 0 &&
              currentSection.getBoundingClientRect().bottom <=
                window.innerHeight + 60)
          ) {
            event.preventDefault();
            handleDelta(event.deltaY);
            return;
          }

          // For sufficiently large delta, snap to a new section.
          if (Math.abs(event.deltaY) > wheelThreshold) {
            event.preventDefault();
            handleDelta(event.deltaY);
          }
        });
      }
    },
    [
      isMobile,
      sectionsRef,
      getCenteredSectionIndex,
      scrollToSection,
      handleDelta,
      wheelThreshold,
    ]
  );

  /**
   * Record the starting Y position for touch events.
   */
  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  /**
   * Handle the end of a touch event, calculate swipe delta, and process snapping.
   */
  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      handleDelta(delta);
      touchStartYRef.current = null;
    },
    [handleDelta]
  );

  /**
   * Attach event listeners on mount and clean up on unmount.
   */
  useEffect(() => {
    const wheelOptions: AddEventListenerOptions & { passive?: boolean } = {
      passive: false,
    };

    window.addEventListener("wheel", onWheel, wheelOptions);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);

      if (wheelRAFRef.current) {
        cancelAnimationFrame(wheelRAFRef.current);
      }
    };
  }, [onWheel, onTouchStart, onTouchEnd]);

  // Clean up lock timeout on unmount.
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, []);

  return {
    scrollToSection,
  };
};
