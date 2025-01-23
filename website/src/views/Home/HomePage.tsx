"use client";

import dynamic from "next/dynamic";
import { usePageSlideEffect } from "@/hooks/usePageSlideEffect";
import { AnimatePresence } from "framer-motion";
import MenuModal from "@/components/dialog/menu-modal";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { AnimatedSection } from "@/utils/AnimatedSection";

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
  {
    ssr: false,
  }
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
}

export default function HomePage() {
  const { currentPage, containerRef, isScrolling } = usePageSlideEffect();

  const sections: Section[] = [
    { Component: HeaderSection },
    { Component: RobotSection },
    { Component: HowSection },
    { Component: HowSectionCarousel },
    { Component: WorkSection },
    { Component: InvestSection },
    { Component: FooterSection },
  ];

  // Calculate total height based on the number of sections
  const totalHeight = `${100 * sections.length}vh`;

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);

  // Toggle menu
  const handleToggle = () => {
    dispatch(toggleMenu());
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: totalHeight }}
      >
        {/* All sections (Animated) */}
        <div
          className="relative"
          style={{
            marginTop: `0vh`,
            pointerEvents: isScrolling ? "none" : "auto",
          }}
        >
          <AnimatePresence initial={false} mode="wait">
            {sections.map(({ Component }, index) => {
              const absoluteIndex = index;
              return (
                <AnimatedSection
                  key={`animated-${absoluteIndex}`}
                  index={absoluteIndex}
                  isActive={absoluteIndex === currentPage}
                  total={sections.length}
                >
                  <Component />
                </AnimatedSection>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu Modal */}
      <MenuModal isOpen={isOpen as boolean} onClose={handleToggle} />
    </>
  );
}
