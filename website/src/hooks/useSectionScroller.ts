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
 *
 * - Mobile:
 *   - Mostly uses native scrolling except for special handling of `home` and `robot` sections.
 *   - "robot" snaps back to "home" if user swipes down significantly.
 *   - "home" snaps on significant swipes up/down.
 *
 * - Desktop:
 *   - If a touchpad is detected (small wheel deltas), allow native scrolling unless in `home`.
 *   - If a mouse wheel is detected (large deltas), snap on scroll for all sections,
 *     with extra special-casing for "how" and "work" sections.
 */
export const useSectionScroller = (
  sectionsRef: RefObject<(HTMLElement | null)[]>,
  options: SectionScrollerOptions = {}
) => {
  const {
    scrollDuration = 800,
    globalLock = false,
    wheelThreshold = 40,
    swipeThreshold = 30,
  } = options;

  const isMobile = useIsMobile();

  /** Local lock that prevents repeated snap triggers */
  const [localLock, setLocalLock] = useState(false);

  /** Last snap time to rate-limit consecutive scrolls */
  const lastScrollTimeRef = useRef(0);

  /** Store touch start Y to compute swipe distance */
  const touchStartYRef = useRef<number | null>(null);

  /** Used to clear lock timeout after scroll animation */
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Anim frame ID for throttling wheel events */
  const wheelRAFRef = useRef<number | null>(null);
  /** Store the last wheel event so we can process it in a single rAF callback */
  const lastWheelEventRef = useRef<WheelEvent | null>(null);

  /**
   * Scroll smoothly to a given section index, respecting the lock and rate limits.
   */
  const scrollToSection = useCallback(
    (index: number) => {
      const sections = sectionsRef.current || [];
      const targetSection = sections[index];
      if (!targetSection) return;

      const now = Date.now();

      // Rate-limiting: ensure we don’t trigger new snaps too quickly
      if (now - lastScrollTimeRef.current < scrollDuration) return;

      // Perform the smooth scroll
      targetSection.scrollIntoView({ behavior: "smooth" });

      // Lock local scrolling
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
   * A utility to safely snap to the "next" or "previous" section from the current one.
   */
  const snapRelative = useCallback(
    (direction: "next" | "prev") => {
      const sections = sectionsRef.current || [];
      const currentIndex = getCenteredSectionIndex();
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

      // Clamp indices
      newIndex = Math.max(0, Math.min(newIndex, sections.length - 1));
      if (newIndex !== currentIndex) {
        scrollToSection(newIndex);
      }
    },
    [scrollToSection, getCenteredSectionIndex, sectionsRef]
  );

  /**
   * Core logic that decides how to respond to a "delta" scroll (positive or negative).
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
        // "robot": if user swipes downward, snap to previous (likely "home")
        if (
          sectionId === "robot" &&
          delta < -swipeThreshold &&
          currentIndex > 0
        ) {
          snapRelative("prev");
          return;
        }

        // "home": snap on big swipes
        if (sectionId === "home") {
          if (delta > swipeThreshold) {
            snapRelative("next");
            return;
          } else if (delta < -swipeThreshold) {
            snapRelative("prev");
            return;
          }
        }

        // Other sections: let native scrolling occur
        return;
      }

      // --- DESKTOP LOGIC ---
      // "how": only snap forward if bottom is within a small offset
      if (sectionId === "how") {
        const bottom = currentSection.getBoundingClientRect().bottom;
        if (delta > 0 && bottom <= window.innerHeight + 40) {
          snapRelative("next");
        }
        return;
      }

      // "work": similarly handle forward snap
      if (sectionId === "work") {
        const bottom = currentSection.getBoundingClientRect().bottom;
        if (delta > 0 && bottom <= window.innerHeight + 60) {
          snapRelative("next");
        }
        return;
      }

      // Otherwise, general snapping (if threshold is reached)
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
   * Throttled wheel handler that uses requestAnimationFrame for best performance.
   * We store the last wheel event and process it once per frame.
   */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      // We only want to store the event if we intend to handle it.
      lastWheelEventRef.current = e;

      if (wheelRAFRef.current === null) {
        wheelRAFRef.current = requestAnimationFrame(() => {
          wheelRAFRef.current = null;
          const event = lastWheelEventRef.current;
          if (!event) return;

          // Because we’re preventing default on large deltas, mark the event if needed:
          if (event.cancelable && !event.defaultPrevented) {
            // Heuristic: small delta => touchpad
            const isTouchpad = Math.abs(event.deltaY) < 20;

            const sections = sectionsRef.current || [];
            const currentIndex = getCenteredSectionIndex();
            const currentSection = sections[currentIndex];
            if (!currentSection) return;

            const sectionId = currentSection.dataset.sectionId;

            // On mobile or if touchpad scrolling, allow native scroll except in home
            if ((isMobile || isTouchpad) && sectionId !== "home") {
              // Let the event pass
              return;
            }

            // Special case: scrolling up from "work" to "how-carousel"
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

            // Additional special handling for "how" and "work" to avoid partial scroll
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

            // For a large enough delta, snap
            if (Math.abs(event.deltaY) > wheelThreshold) {
              event.preventDefault();
              handleDelta(event.deltaY);
            }
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
   * Touch start: record the starting Y.
   */
  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  /**
   * Touch end: calculate the delta and run snapping logic if needed.
   */
  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;

      // Let the main delta logic handle everything
      handleDelta(delta);
      touchStartYRef.current = null;
    },
    [handleDelta]
  );

  /**
   * Attach the global event listeners on mount, and clean up on unmount.
   * Use passive:false where we might call preventDefault.
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

  /**
   * Clean up lock timeout on unmount.
   */
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, []);

  return {
    scrollToSection,
  };
};
