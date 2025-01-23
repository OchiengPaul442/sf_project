"use client";

import { useEffect, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import NextButton from "@/components/NextButton";
import { AnimatedSection } from "@/components/AnimatedSection";
import { isMobile } from "@/utils/isMobile";
import { useRef, type RefObject } from "react";

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

interface Section {
  Component: React.ComponentType;
  id: string;
  ref: RefObject<HTMLDivElement>;
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections: Section[] = [
    { Component: HeaderSection, id: "home", ref: useRef<HTMLDivElement>(null) },
    {
      Component: RobotSection,
      id: "platform",
      ref: useRef<HTMLDivElement>(null),
    },
    {
      Component: HowSection,
      id: "solutions",
      ref: useRef<HTMLDivElement>(null),
    },
    {
      Component: HowSectionCarousel,
      id: "how-carousel",
      ref: useRef<HTMLDivElement>(null),
    },
    { Component: WorkSection, id: "work", ref: useRef<HTMLDivElement>(null) },
    {
      Component: InvestSection,
      id: "invest",
      ref: useRef<HTMLDivElement>(null),
    },
    {
      Component: () => <FooterSection scrollToTop={scrollToTop} />,
      id: "footer",
      ref: useRef<HTMLDivElement>(null),
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

  const scrollToSection = useCallback(
    (index: number) => {
      setIsScrolling(true);
      setCurrentPage(index);

      const targetSection = sections[index];
      if (targetSection && targetSection.ref.current) {
        const offset = isMobileDevice ? 0 : window.innerHeight * index;
        const elementPosition =
          targetSection.ref.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }

      setTimeout(() => setIsScrolling(false), 1000);
    },
    [sections, isMobileDevice]
  );

  const handleNextSection = useCallback(() => {
    if (currentPage < sections.length - 1) {
      scrollToSection(currentPage + 1);
    }
  }, [currentPage, sections.length, scrollToSection]);

  const handleScroll = useCallback(() => {
    if (isMobileDevice) return; // Skip the custom scrolling logic for mobile devices

    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollThreshold = windowHeight / 3; // 33% of the viewport height

    if (currentScrollY < lastScrollY.current) {
      setScrollDirection("up");
    } else if (currentScrollY > lastScrollY.current) {
      setScrollDirection("down");
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (!isScrolling) {
        const currentSection = Math.floor(currentScrollY / windowHeight);
        const scrollOffset = currentScrollY % windowHeight;

        let targetSection = currentSection;

        if (scrollDirection === "down" && scrollOffset > scrollThreshold) {
          targetSection = Math.min(currentSection + 1, sections.length - 1);
        } else if (
          scrollDirection === "up" &&
          scrollOffset < windowHeight - scrollThreshold
        ) {
          targetSection = Math.max(currentSection - 1, 0);
        }

        if (targetSection !== currentPage) {
          scrollToSection(targetSection);
        } else {
          // Snap to the current section if no change
          window.scrollTo({
            top: targetSection * windowHeight,
            behavior: "smooth",
          });
        }
      }
    }, 100);

    lastScrollY.current = currentScrollY;
  }, [
    currentPage,
    isScrolling,
    scrollDirection,
    scrollToSection,
    sections.length,
    isMobileDevice,
  ]);

  useEffect(() => {
    setIsMobileDevice(isMobile());
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      {isMobileDevice ? (
        <div className="w-full">
          {sections.map(({ Component, id, ref }) => (
            <div key={`section-${id}`} className="min-h-screen" ref={ref}>
              <Component />
            </div>
          ))}
        </div>
      ) : (
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
                  scrollDirection={scrollDirection}
                >
                  <Component />
                </AnimatedSection>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

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
