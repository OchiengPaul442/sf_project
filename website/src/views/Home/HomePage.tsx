"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import type { RootState } from "@/redux-store";

import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";

import { isMobileDevice } from "@/utils/deviceDetection";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import FooterSection from "@/views/Home/footer-section";
import RobotSection from "@/views/Home/robotSection";
import dynamic from "next/dynamic";

// Dynamically import sections with no SSR
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false }
);

const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
});

const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});

const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
});

const JSON_PATHS = [
  "/lottie/sailing_boat_2.json",
  "/lottie/paper_flying.json",
  "/lottie/spag_json.json",
  "/lottie/mark_json.json",
  "/lottie/data.json",
  "/lottie/robot.json",
  "/lottie/contruction.json",
  "/lottie/angel.json",
] as const;

interface SectionProps {
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
  onScrollComplete?: () => void;
  scrollToTop?: () => void;
  animationData?: any; // Added to pass animation data to sections
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

// New asset loading hook with better error handling and loading states
const useAssetLoader = (paths: readonly string[]) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    paths.reduce((acc, path) => ({ ...acc, [path]: true }), {})
  );
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const loadAsset = async (path: string) => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to load ${path}: ${response.statusText}`);
        }
        const data = await response.json();
        setAnimationDataMap((prev) => ({ ...prev, [path]: data }));
        setLoadingStates((prev) => ({ ...prev, [path]: false }));
      } catch (error) {
        console.error(`Error loading ${path}:`, error);
        setErrorStates((prev) => ({
          ...prev,
          [path]: (error as Error).message,
        }));
        setLoadingStates((prev) => ({ ...prev, [path]: false }));
      }
    };

    paths.forEach((path) => {
      loadAsset(path);
    });
  }, [paths]);

  const isLoading = Object.values(loadingStates).some((state) => state);
  const hasErrors = Object.keys(errorStates).length > 0;

  return {
    isLoading,
    hasErrors,
    errors: errorStates,
    animationDataMap,
  };
};

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);
  const contactModalOpen = useSelector(
    (state: RootState) => state.ui.contactModalOpen
  );

  // Use the new asset loader
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAssetLoader(JSON_PATHS);
  const isMobile = isMobileDevice();

  const stepsWithData: StepWithData[] = useMemo(() => {
    if (isLoading || hasErrors) return [];
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
  }, [animationDataMap, isLoading, hasErrors]);

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
        Component: (props: SectionProps) => (
          <RobotSection
            id="robot"
            animationData={animationDataMap["/lottie/robot.json"]}
            {...props}
          />
        ),
      },
      {
        id: "solutions",
        allowScroll: true,
        Component: ({
          onScrollPastStart,
          onScrollPastEnd,
          onScrollComplete,
        }: SectionProps) => (
          <HowSection
            id="solutions"
            onScrollProgress={(p: number) => {
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
        allowScroll: true,
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
        // Ensure allowScroll is explicitly a boolean
        allowScroll: Boolean(contactModalOpen),
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
    [stepsWithData, isMobile, contactModalOpen, animationDataMap]
  );

  const { currentPage, scrollDirection, scrollToSection } = useScrollHandler(
    sections.length,
    !!modalOpen,
    !!contactModalOpen,
    sections
  );

  const scrollToTop = useCallback(() => {
    scrollToSection(0);
  }, [scrollToSection]);

  const handleScrollPastStart = useCallback(() => {
    if (currentPage > 0) {
      scrollToSection(currentPage - 1);
    }
  }, [currentPage, scrollToSection]);

  const handleScrollPastEnd = useCallback(() => {
    if (currentPage < sections.length - 1) {
      scrollToSection(currentPage + 1);
    }
  }, [currentPage, scrollToSection, sections.length]);

  const handleScrollComplete = useCallback(() => {
    if (currentPage < sections.length - 1) {
      scrollToSection(currentPage + 1);
    }
  }, [currentPage, scrollToSection, sections.length]);

  // Show error state if any assets failed to load
  if (hasErrors) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-4">
        <h2 className="text-xl mb-4">Failed to load required assets</h2>
        <ul className="text-red-500">
          {Object.entries(errors).map(([path, error]) => (
            <li key={path}>
              {path}: {error}
            </li>
          ))}
        </ul>
      </div>
    );
  }

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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
