"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import NextButton from "@/components/NextButton";
import { AnimatedSection } from "@/utils/AnimatedSection";

// Dynamically import sections
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
const FooterSectionDynamic = dynamic(
  () => import("@/views/Home/footer-section"),
  { ssr: false }
);

interface Section {
  Component: React.ComponentType;
  id: string;
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  const sections: Section[] = [
    { Component: HeaderSection, id: "home" },
    { Component: RobotSection, id: "platform" },
    { Component: HowSection, id: "solutions" },
    { Component: HowSectionCarousel, id: "how-carousel" },
    { Component: WorkSection, id: "work" },
    { Component: InvestSection, id: "invest" },
    {
      Component: () => <FooterSectionDynamic scrollToTop={scrollToTop} />,
      id: "footer",
    },
  ];

  const totalHeight = `${100 * sections.length}vh`;

  const handleToggle = () => {
    dispatch(toggleMenu());
  };

  const scrollToTop = useCallback(() => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(0);
    setTimeout(() => setIsScrolling(false), 1000);
  }, []);

  const scrollToSection = useCallback((index: number) => {
    setIsScrolling(true);
    setCurrentPage(index);
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });
    setTimeout(() => setIsScrolling(false), 1000);
  }, []);

  const handleNextSection = useCallback(() => {
    if (currentPage < sections.length - 1) {
      scrollToSection(currentPage + 1);
    }
  }, [currentPage, sections.length, scrollToSection]);

  const handleScroll = useCallback(() => {
    if (!isScrolling && containerRef.current) {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newPage = Math.round(scrollPosition / windowHeight);
      setCurrentPage(newPage);
    }
  }, [isScrolling]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleResize = () => {
      scrollToTop();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollToTop]);

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: totalHeight }}
      >
        <div className="relative">
          <AnimatePresence initial={false} mode="wait">
            {sections.map(({ Component, id }, index) => (
              <AnimatedSection
                key={`animated-${id}`}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
              >
                <Component />
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
