"use client";

import type React from "react";
import { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import type { RootState } from "@/redux-store";

import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";

// sections
import HowSectionCarousel from "@/components/carousels/how-section-carousel";
import FooterSection from "@/views/Home/footer-section";
import HeaderSection from "@/views/Home/header-section";
import RobotSection from "@/views/Home/robotSection";
import WorkSection from "@/views/Home/work-section";
import HowSection from "@/views/Home/how-section";

import { isMobileDevice } from "@/utils/deviceDetection";
import { useAssetPreloader } from "@/hooks/useAssetPreloader";
import { useScrollHandler } from "@/hooks/useScrollHandler";

const JSON_PATHS = [
  "/lottie/sailing_boat_2.json",
  "/lottie/paper_flying.json",
  "/lottie/spag_json.json",
  "/lottie/mark_json.json",
  "/lottie/data.json",
  "/lottie/robot.json",
  "/lottie/contruction.json",
  "/lottie/angel.json",
];

interface SectionProps {
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
  onScrollComplete?: () => void;
  scrollToTop?: () => void;
}

interface SectionConfig {
  id: string;
  allowScroll?: boolean;
  Component: React.ComponentType<SectionProps>;
}

interface StepWithData {
  id: string;
  title: string;
  animationData: any;
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);
  const contactModalOpen = useSelector(
    (state: RootState) => state.ui.contactModalOpen
  );

  // Preload animations
  const { isLoading, animationDataMap } = useAssetPreloader(JSON_PATHS);
  const isMobile = isMobileDevice();

  const stepsWithData: StepWithData[] = useMemo(() => {
    if (isLoading) return [];
    return [
      {
        id: "smooth-onboarding",
        title: "Smooth Onboarding",
        animationData: animationDataMap["/lottie/sailing_boat_2.json"],
      },
      {
        id: "data-integrity",
        title: "Data Integrity",
        animationData: animationDataMap["/lottie/paper_flying.json"],
      },
      {
        id: "managed-consumables",
        title: "Tightly Managed Consumables",
        animationData: animationDataMap["/lottie/spag_json.json"],
      },
      {
        id: "recipe-adherence",
        title: "Recipe Adherence",
        animationData: animationDataMap["/lottie/mark_json.json"],
      },
      {
        id: "fraud-eliminated",
        title: "Fraud Eliminated",
        animationData: animationDataMap["/lottie/data.json"],
      },
    ];
  }, [animationDataMap, isLoading]);

  /**
   * Our array of sections, each with allowScroll set to true/false.
   * "solutions" and "how-carousel" are set to true so they can handle internal scrolling.
   */
  const sections: SectionConfig[] = useMemo(
    () => [
      {
        id: "home",
        allowScroll: false,
        Component: () => (
          <div
            id="home"
            className="relative h-full flex flex-col justify-center"
          >
            <HeaderSection />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <NextButton onClick={() => scrollToSection(1)} />
            </div>
          </div>
        ),
      },
      {
        id: "robot",
        allowScroll: false,
        Component: () => <RobotSection id="robot" />,
      },
      {
        id: "solutions",
        allowScroll: true, // Let this section handle its scroll
        Component: ({
          onScrollPastStart,
          onScrollPastEnd,
          onScrollComplete,
        }: SectionProps) => (
          <HowSection
            id="solutions"
            onScrollProgress={(p: number) => {
              // This logic is called *inside* the section
              if (isMobile) {
                if (p <= 0) onScrollPastStart?.();
                if (p >= 1) onScrollComplete?.();
              } else {
                if (p <= 0) onScrollPastStart?.();
                if (p >= 1) onScrollPastEnd?.();
              }
            }}
          />
        ),
      },
      {
        id: "how-carousel",
        allowScroll: true, // Let this section handle its scroll
        Component: ({ onScrollPastStart, onScrollPastEnd }: SectionProps) => (
          <HowSectionCarousel
            id="how-carousel"
            steps={stepsWithData}
            onScrollPastStart={onScrollPastStart}
            onScrollPastEnd={isMobile ? undefined : onScrollPastEnd}
            onScrollComplete={isMobile ? onScrollPastEnd : undefined}
          />
        ),
      },
      {
        id: "work",
        allowScroll: contactModalOpen ? true : false,
        Component: () => <WorkSection id="work" />,
      },
      {
        id: "footer",
        allowScroll: false,
        Component: ({ scrollToTop }: SectionProps) => (
          <FooterSection scrollToTop={scrollToTop} />
        ),
      },
    ],
    [stepsWithData, isMobile, contactModalOpen]
  );

  // -- useScrollHandler now takes the sections array too --
  const { currentPage, scrollDirection, scrollToSection } = useScrollHandler(
    sections.length,
    !!modalOpen,
    !!contactModalOpen,
    sections
  );

  const scrollToTop = useCallback(() => {
    scrollToSection(0);
  }, [scrollToSection]);

  /**
   * These callbacks are passed to sections that have internal scroll.
   * Once the user hits the top or bottom, the section calls them to move on.
   */
  const handleScrollPastStart = useCallback(() => {
    scrollToSection(currentPage - 1);
  }, [currentPage, scrollToSection]);

  const handleScrollPastEnd = useCallback(() => {
    scrollToSection(currentPage + 1);
  }, [currentPage, scrollToSection]);

  const handleScrollComplete = useCallback(() => {
    scrollToSection(currentPage + 1);
  }, [currentPage, scrollToSection]);

  return (
    <div className="relative w-full bg-black">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          key="content"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative w-full"
        >
          <AnimatePresence mode="wait">
            {isMobile ? (
              // Mobile simply stacks sections, no snap
              <div className="flex flex-col w-full items-center">
                {sections.map(({ Component, id }) => (
                  <div key={id} className="w-full min-h-screen" id={id}>
                    <Component scrollToTop={scrollToTop} />
                  </div>
                ))}
              </div>
            ) : (
              // Desktop uses AnimatedSection + snap logic
              sections.map(({ Component, id }, index) => (
                <AnimatedSection
                  key={id}
                  index={index}
                  isActive={index === currentPage}
                  total={sections.length}
                  scrollDirection={scrollDirection}
                >
                  <Component
                    onScrollPastStart={handleScrollPastStart}
                    onScrollPastEnd={handleScrollPastEnd}
                    onScrollComplete={
                      id === "solutions" ? handleScrollComplete : undefined
                    }
                    scrollToTop={scrollToTop}
                  />
                </AnimatedSection>
              ))
            )}
          </AnimatePresence>

          {/* Menu Modal */}
          <MenuModal
            isOpen={!!isMenuOpen}
            onClose={() => dispatch(toggleMenu())}
            sections={sections}
            scrollToSection={scrollToSection}
          />
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
