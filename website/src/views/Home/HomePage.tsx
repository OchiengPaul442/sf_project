"use client";

import type React from "react";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import type { RootState } from "@/redux-store";
import VectorImage from "@/public/Vector.svg";

// Components
import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";

// Our refactored HowSectionCarousel
import HowSectionCarousel from "@/components/carousels/how-section-carousel";

// Constants
const SCROLL_THRESHOLD = 50;
const SCROLL_LOCK_DURATION = 400;
const PRELOAD_TIMEOUT = 5000;

// Index of the carousel section
const CAROUSEL_SECTION_INDEX = 3;

// Preload Lottie JSONs
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

// Enhanced dynamic imports with loading states
const withLoadingIndicator = (importFn: () => Promise<any>) =>
  dynamic(importFn, {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-full w-full" />,
  });

const HeaderSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/header-section")
);
const RobotSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/robotSection")
);
const HowSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/how-section")
);
const WorkSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/work-section")
);
const FooterSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/footer-section")
);

// Types
export interface SectionProps {
  scrollToTop?: () => void;
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  preloadPriority: number;
  useNextAction?: boolean;
}

/**
 * HOC to ensure consistent prop typing across sections
 */
const withScrollProp = <T extends object>(
  Component: React.ComponentType<T & SectionProps>
): React.FC<T & SectionProps> => {
  const WrappedComponent: React.FC<T & SectionProps> = (props) => (
    <Component {...props} />
  );
  WrappedComponent.displayName = `WithScroll(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
};

// Wrap components with scroll prop
const HeaderSection = withScrollProp(HeaderSectionRaw as any);
const RobotSection = withScrollProp(RobotSectionRaw as any);
const HowSection = withScrollProp(HowSectionRaw as any);
const WorkSection = withScrollProp(WorkSectionRaw as any);
const FooterSection = withScrollProp(FooterSectionRaw as any);

// Step interface with animationData
interface StepWithData {
  id: string;
  title: string;
  animationData: any; // Replace 'any' with the appropriate type if available
}

// Debounce hook to manage scroll events
const useDebouncedCallback = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFunction;
};

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );
  const scrollLockRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const sectionsRef = useRef<SectionConfig[]>([]); // Ref to store sections

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);

  // Scroll to a specific section
  const scrollToSection = useCallback(
    (targetIndex: number) => {
      if (modalOpen || scrollLockRef.current) return;
      if (targetIndex < 0 || targetIndex >= sectionsRef.current.length) return;

      // Standard "snap" to the desired section
      scrollLockRef.current = true;
      setCurrentPage(targetIndex);
      window.scrollTo({
        top: window.innerHeight * targetIndex,
        behavior: "smooth",
      });

      setTimeout(() => {
        scrollLockRef.current = false;
      }, SCROLL_LOCK_DURATION);
    },
    [modalOpen]
  );

  // Scroll callbacks from carousel
  const handleScrollPastStart = useCallback(() => {
    scrollToSection(currentPage - 1);
  }, [currentPage, scrollToSection]);

  const handleScrollPastEnd = useCallback(() => {
    scrollToSection(currentPage + 1);
  }, [currentPage, scrollToSection]);

  // Define steps with preloaded animationData
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

  // Section definitions
  const sections: SectionConfig[] = useMemo(() => {
    const sectionsArray: SectionConfig[] = [
      {
        Component: ({ scrollToTop }) => (
          <>
            <HeaderSection scrollToTop={scrollToTop} />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <NextButton onClick={scrollToTop} />
            </div>
          </>
        ),
        id: "home",
        preloadPriority: 1,
        useNextAction: true,
      },
      {
        Component: RobotSection,
        id: "platform",
        preloadPriority: 2,
      },
      {
        Component: HowSection,
        id: "solutions",
        preloadPriority: 3,
      },
      {
        // Carousel at index = 3
        Component: () => (
          <HowSectionCarousel
            onScrollPastStart={handleScrollPastStart}
            onScrollPastEnd={handleScrollPastEnd}
            steps={stepsWithData}
          />
        ),
        id: "how-carousel",
        preloadPriority: 4,
      },
      {
        Component: WorkSection,
        id: "work",
        preloadPriority: 5,
      },
      {
        Component: FooterSection,
        id: "footer",
        preloadPriority: 7,
      },
    ];

    sectionsRef.current = sectionsArray;

    return sectionsArray;
  }, [
    handleScrollPastEnd,
    handleScrollPastStart,
    stepsWithData,
    scrollToSection,
  ]);

  // Asset preloading
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        loadingTimeoutRef.current = setTimeout(() => {
          console.warn("Asset loading timeout - forcing load completion");
          setIsLoading(false);
        }, PRELOAD_TIMEOUT);

        const fetchedData = await Promise.all(
          JSON_PATHS.map(async (path) => {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`Failed to load ${path}`);
            const json = await res.json();
            return { path, data: json };
          })
        );

        const animationDataMap: Record<string, any> = {};
        fetchedData.forEach(({ path, data }) => {
          animationDataMap[path] = data;
        });

        // Preload Vector.svg
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Vector image load failed"));
          img.src = VectorImage.src;
        });

        setAnimationDataMap(animationDataMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Asset preload error:", error);
        setIsLoading(false);
      } finally {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      }
    };

    preloadAssets();

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Handle wheel scrolling with debouncing
  const debouncedHandleWheel = useDebouncedCallback(
    (event: WheelEvent) => {
      if (modalOpen || scrollLockRef.current) return;

      // If we are in the carousel section, do not handle here
      if (currentPage === CAROUSEL_SECTION_INDEX) {
        return;
      }

      const delta = event.deltaY;
      if (Math.abs(delta) > SCROLL_THRESHOLD) {
        event.preventDefault();
        const direction = delta > 0 ? 1 : -1;
        scrollToSection(currentPage + direction);
      }
    },
    100 // Debounce delay in ms
  );

  // Touch event handlers for mobile with debouncing
  const debouncedHandleTouchEnd = useDebouncedCallback(
    (event: TouchEvent) => {
      if (modalOpen || scrollLockRef.current || touchStartY.current === null) {
        return;
      }

      // If we are in carousel section, do not handle here
      if (currentPage === CAROUSEL_SECTION_INDEX) {
        touchStartY.current = null;
        return;
      }

      const deltaY = touchStartY.current - event.changedTouches[0].clientY;
      if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
        event.preventDefault();
        const direction = deltaY > 0 ? 1 : -1;
        scrollToSection(currentPage + direction);
      }

      touchStartY.current = null;
    },
    100 // Debounce delay in ms
  );

  // Attach/detach event listeners with debouncing
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      debouncedHandleWheel(e);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!modalOpen) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      debouncedHandleTouchEnd(e);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [debouncedHandleWheel, debouncedHandleTouchEnd, modalOpen]);

  return (
    <div
      className="relative w-full overflow-hidden snap-y snap-mandatory"
      style={{ scrollBehavior: "smooth" }}
    >
      <AnimatePresence>
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
          transition={{ duration: 0.2 }}
          className="relative w-full h-full"
        >
          <div
            style={{
              height: `${100 * sections.length}vh`,
              position: "relative",
            }}
          >
            {sections.map(({ Component, id, useNextAction }, index) => (
              <AnimatedSection
                key={`section-${id}`}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
                scrollDirection={currentPage > index ? "up" : "down"}
              >
                <div className="w-full h-full snap-start">
                  <Component
                    scrollToTop={() =>
                      useNextAction
                        ? scrollToSection(currentPage + 1)
                        : scrollToSection(0)
                    }
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>

          <MenuModal
            isOpen={isMenuOpen as any}
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
