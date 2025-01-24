"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import NextButton from "@/components/NextButton";
import { AnimatedSection } from "@/components/AnimatedSection";
import Loader from "@/components/loader";

// Dynamic imports with 'scrollToTop' as optional
const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop?: () => void }>;

const RobotSection = dynamic(() => import("@/views/Home/robotSection"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop?: () => void }>;

const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop?: () => void }>;

const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  {
    ssr: false,
  }
) as React.ComponentType<{ scrollToTop?: () => void }>;

const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop?: () => void }>;

const InvestSection = dynamic(() => import("@/views/Home/invest-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop?: () => void }>;

const FooterSection = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop?: () => void }>;

// Updated SectionConfig interface with a flag to determine the scroll behavior
interface SectionConfig {
  Component: React.ComponentType<{ scrollToTop?: () => void }>;
  id: string;
  useNextAction?: boolean; // Indicates if the section should use 'handleNextSection'
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollLockRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  // Define all sections in an array with 'useNextAction' flag
  const sections: SectionConfig[] = useMemo(
    () => [
      { Component: HeaderSection, id: "home", useNextAction: true }, // Use handleNextSection
      { Component: RobotSection, id: "platform", useNextAction: false },
      { Component: HowSection, id: "solutions", useNextAction: false },
      {
        Component: HowSectionCarousel,
        id: "how-carousel",
        useNextAction: false,
      },
      { Component: WorkSection, id: "work", useNextAction: false },
      { Component: InvestSection, id: "invest", useNextAction: false },
      { Component: FooterSection, id: "footer", useNextAction: false },
    ],
    []
  );

  const totalHeight = `${100 * sections.length}vh`;

  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length || scrollLockRef.current)
        return;

      // Lock scroll to prevent multiple triggers
      scrollLockRef.current = true;
      setIsScrolling(true);
      setCurrentPage(index);

      window.scrollTo({
        top: window.innerHeight * index,
        behavior: "smooth",
      });

      // Release scroll lock after ~600ms
      const scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        scrollLockRef.current = false;
      }, 600);

      return () => clearTimeout(scrollTimer);
    },
    [sections.length]
  );

  const scrollToTop = useCallback(() => {
    scrollToSection(0);
  }, [scrollToSection]);

  const handleNextSection = useCallback(() => {
    if (currentPage < sections.length - 1) {
      scrollToSection(currentPage + 1);
    }
  }, [currentPage, scrollToSection, sections.length]);

  // Mobile touch scroll handling
  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartRef.current = event.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!touchStartRef.current) return;

      const currentY = event.touches[0].clientY;
      const deltaY = touchStartRef.current - currentY;
      const threshold = 50; // Adjust sensitivity as needed

      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && currentPage < sections.length - 1) {
          // Swipe up -> next section
          event.preventDefault();
          scrollToSection(currentPage + 1);
        } else if (deltaY < 0 && currentPage > 0) {
          // Swipe down -> previous section
          event.preventDefault();
          scrollToSection(currentPage - 1);
        }
        touchStartRef.current = null;
      }
    },
    [currentPage, scrollToSection, sections.length]
  );

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Mouse wheel event
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (scrollLockRef.current) return;

      const { deltaY } = event;
      const isScrollingDown = deltaY > 40;
      const isScrollingUp = deltaY < -40;

      if (isScrollingDown && currentPage < sections.length - 1) {
        event.preventDefault();
        scrollToSection(currentPage + 1);
      } else if (isScrollingUp && currentPage > 0) {
        event.preventDefault();
        scrollToSection(currentPage - 1);
      }
    },
    [currentPage, scrollToSection, sections.length]
  );

  // Keyboard arrow up/down events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (scrollLockRef.current) return;

      switch (event.key) {
        case "ArrowDown":
          if (currentPage < sections.length - 1) {
            event.preventDefault();
            scrollToSection(currentPage + 1);
          }
          break;
        case "ArrowUp":
          if (currentPage > 0) {
            event.preventDefault();
            scrollToSection(currentPage - 1);
          }
          break;
      }
    },
    [currentPage, scrollToSection, sections.length]
  );

  // Set currentPage based on current scroll position on mount
  useEffect(() => {
    const handleInitialScroll = () => {
      const scrollPosition = window.scrollY;
      const pageIndex = Math.round(scrollPosition / window.innerHeight);
      setCurrentPage(pageIndex);
    };

    handleInitialScroll();

    // Optional: update currentPage on window resize
    window.addEventListener("resize", handleInitialScroll);

    return () => {
      window.removeEventListener("resize", handleInitialScroll);
    };
  }, []);

  useEffect(() => {
    const wheelOptions = { passive: false };
    const touchOptions = { passive: false };

    window.addEventListener("wheel", handleWheel, wheelOptions);
    window.addEventListener("keydown", handleKeyDown);

    // Mobile touch events
    window.addEventListener("touchstart", handleTouchStart, touchOptions);
    window.addEventListener("touchmove", handleTouchMove, touchOptions);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    handleWheel,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const handleToggle = () => dispatch(toggleMenu());

  // Hide NextButton on the last three sections
  const showNextButton = !isScrolling && currentPage < sections.length - 3;

  return (
    <>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: totalHeight }}
      >
        <div className="relative h-full">
          <AnimatePresence initial={false} mode="wait">
            {sections.map(({ Component, id, useNextAction }, index) => (
              <AnimatedSection
                key={`animated-${id}`}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
                // If you scroll from a lower index to a higher index, direction is "down"
                // If you're at a higher index and go to a lower index, direction is "up"
                scrollDirection={currentPage > index ? "up" : "down"}
              >
                <Suspense fallback={<Loader />}>
                  <Component
                    scrollToTop={
                      useNextAction ? handleNextSection : scrollToTop
                    }
                  />
                </Suspense>
              </AnimatedSection>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <MenuModal
        isOpen={isOpen as boolean}
        onClose={handleToggle}
        sections={sections}
        scrollToSection={scrollToSection}
      />

      <NextButton onClick={handleNextSection} isVisible={showNextButton} />
    </>
  );
}
