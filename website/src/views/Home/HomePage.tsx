"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import NextButton from "@/components/NextButton";
import { AnimatedSection } from "@/components/AnimatedSection";

// Dynamic imports with props type
const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop: () => void }>;

const RobotSection = dynamic(() => import("@/views/Home/robotSection"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop: () => void }>;

const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop: () => void }>;

const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  {
    ssr: false,
  }
) as React.ComponentType<{ scrollToTop: () => void }>;

const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop: () => void }>;

const InvestSection = dynamic(() => import("@/views/Home/invest-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop: () => void }>;

const FooterSection = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
}) as React.ComponentType<{ scrollToTop: () => void }>;

interface SectionConfig {
  Component: React.ComponentType<{ scrollToTop: () => void }>;
  id: string;
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollLockRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  const sections: SectionConfig[] = useMemo(
    () => [
      { Component: HeaderSection, id: "home" },
      { Component: RobotSection, id: "platform" },
      { Component: HowSection, id: "solutions" },
      { Component: HowSectionCarousel, id: "how-carousel" },
      { Component: WorkSection, id: "work" },
      { Component: InvestSection, id: "invest" },
      { Component: FooterSection, id: "footer" },
    ],
    []
  );

  const totalHeight = `${100 * sections.length}vh`;

  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length || scrollLockRef.current)
        return;

      scrollLockRef.current = true;
      setIsScrolling(true);
      setCurrentPage(index);

      window.scrollTo({
        top: window.innerHeight * index,
        behavior: "smooth",
      });

      const scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        scrollLockRef.current = false;
      }, 1000);

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
          event.preventDefault();
          scrollToSection(currentPage + 1);
        } else if (deltaY < 0 && currentPage > 0) {
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

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const deltaY = event.deltaY;
      const isScrollingDown = deltaY > 50;
      const isScrollingUp = deltaY < -50;

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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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

  return (
    <>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: totalHeight }}
      >
        <div className="relative h-full">
          <AnimatePresence initial={false} mode="wait">
            {sections.map(({ Component, id }, index) => (
              <AnimatedSection
                key={`animated-${id}`}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
                scrollDirection={currentPage > index ? "up" : "down"}
              >
                <Component scrollToTop={scrollToTop} />
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

      <NextButton
        onClick={handleNextSection}
        isVisible={!isScrolling && currentPage < sections.length - 1}
      />
    </>
  );
}
