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
import { preloadLottieAnimations } from "@/components/carousels/how-section-carousel";

const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
});
const RobotSection = dynamic(() => import("@/views/Home/robotSection"), {
  ssr: false,
});
const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
});
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false }
);
const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});
const InvestSection = dynamic(() => import("@/views/Home/invest-section"), {
  ssr: false,
});
const FooterSection = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
});

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollLockRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  const sections = useMemo(
    () => [
      { Component: HeaderSection, id: "home", useNextAction: true },
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

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        await preloadLottieAnimations();
        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        console.error("Failed to preload Lottie animations:", error);
        setIsLoading(false);
      }
    };
    loadAnimations();
  }, []);

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

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  const handleToggle = () => dispatch(toggleMenu());

  const showNextButton = !isScrolling && currentPage < sections.length - 3;

  if (isLoading) return <Loader />;

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
