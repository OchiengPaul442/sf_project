// hooks/useScrollHandler.ts
import { useState, useRef, useCallback, useEffect } from "react";
import { isMobileDevice } from "@/utils/deviceDetection";

const SCROLL_THRESHOLD = 50;
const SCROLL_LOCK_DURATION = 500;

interface SectionConfig {
  id: string;
  allowScroll?: boolean;
}

/**
 * Custom hook to manage scroll behavior across sections.
 *
 * @param sectionsLength Total number of sections.
 * @param modalOpen Whether a modal is open.
 * @param contactModalOpen Whether the contact modal is open.
 * @param sections Array of section configurations.
 */
export const useScrollHandler = (
  sectionsLength: number,
  modalOpen: boolean,
  contactModalOpen: boolean,
  sections: SectionConfig[]
) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const scrollLockRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const isMobile = isMobileDevice();

  /**
   * Programmatically scroll to another section.
   *
   * @param targetIndex Index of the target section.
   */
  const scrollToSection = useCallback(
    (targetIndex: number) => {
      if (modalOpen || contactModalOpen || scrollLockRef.current) return;
      if (targetIndex < 0 || targetIndex >= sectionsLength) return;

      const targetSection = sections[targetIndex];
      if (!targetSection) return;

      if (isMobile) {
        // On mobile, use scrollIntoView for smooth scrolling
        if (typeof window !== "undefined") {
          const element = document.getElementById(targetSection.id);
          if (element) {
            scrollLockRef.current = true;
            element.scrollIntoView({ behavior: "smooth" });

            // Optional: Update currentPage after scrolling completes
            // This requires listening to the scroll event or using a timeout
            setTimeout(() => {
              setCurrentPage(targetIndex);
              scrollLockRef.current = false;
            }, SCROLL_LOCK_DURATION);
          }
        }
      } else {
        // On desktop, use snap-scroll by updating currentPage
        scrollLockRef.current = true;
        setScrollDirection(targetIndex > currentPage ? "down" : "up");
        setCurrentPage(targetIndex);

        setTimeout(() => {
          scrollLockRef.current = false;
        }, SCROLL_LOCK_DURATION);
      }
    },
    [
      modalOpen,
      contactModalOpen,
      sectionsLength,
      sections,
      isMobile,
      currentPage,
    ]
  );

  /**
   * Handler for global (snap) scrolling – only used if the current section does NOT allow internal scrolling.
   */
  const handleGlobalScroll = useCallback(
    (deltaY: number) => {
      if (modalOpen || contactModalOpen || scrollLockRef.current) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_LOCK_DURATION) return;
      lastScrollTimeRef.current = now;

      if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
        const direction = deltaY > 0 ? 1 : -1;
        scrollToSection(currentPage + direction);
      }
    },
    [modalOpen, contactModalOpen, currentPage, scrollToSection]
  );

  /**
   * Attach/detach global wheel listener based on whether the current section allows scrolling internally.
   */
  useEffect(() => {
    if (isMobile) return; // On mobile, handle differently

    if (!sections[currentPage]?.allowScroll) {
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        handleGlobalScroll(e.deltaY);
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        window.removeEventListener("wheel", onWheel);
      };
    }
  }, [handleGlobalScroll, isMobile, currentPage, sections]);

  /**
   * Handle touch-based scrolling on mobile.
   */
  useEffect(() => {
    if (!isMobile) return; // Only handle mobile touches here

    if (!sections[currentPage]?.allowScroll) {
      let touchMoveHandler: ((e: TouchEvent) => void) | null = null;

      const onTouchStart = (e: TouchEvent) => {
        if (!modalOpen && !contactModalOpen) {
          touchStartYRef.current = e.touches[0].clientY;

          touchMoveHandler = (moveEvent: TouchEvent) => {
            if (touchStartYRef.current === null) return;

            const currentY = moveEvent.touches[0].clientY;
            const deltaY = touchStartYRef.current - currentY;

            if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
              const direction = deltaY > 0 ? 1 : -1;
              scrollToSection(currentPage + direction);
              touchStartYRef.current = null;
              window.removeEventListener("touchmove", touchMoveHandler!);
            }
          };

          window.addEventListener("touchmove", touchMoveHandler, {
            passive: false,
          });
        }
      };

      const onTouchEnd = () => {
        touchStartYRef.current = null;
        if (touchMoveHandler) {
          window.removeEventListener("touchmove", touchMoveHandler);
        }
      };

      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });

      return () => {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        if (touchMoveHandler) {
          window.removeEventListener("touchmove", touchMoveHandler);
        }
      };
    }
  }, [
    currentPage,
    modalOpen,
    contactModalOpen,
    scrollToSection,
    isMobile,
    sections,
  ]);

  return {
    currentPage,
    scrollDirection,
    scrollToSection,
  };
};
