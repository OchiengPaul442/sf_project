"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
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

// Constants
const SCROLL_THRESHOLD = 30;
const SCROLL_LOCK_DURATION = 400; // Reduced for faster response
const SCROLL_DEBOUNCE = 50; // Reduced for faster response
const PRELOAD_TIMEOUT = 5000;

const JSON_PATHS = [
  "/lottie/robot.json",
  "/lottie/contruction.json",
  "/lottie/angel.json",
  "/lottie/sailing_boat_2.json",
  "/lottie/paper_flying.json",
  "/lottie/spag_json.json",
  "/lottie/mark_json.json",
  "/lottie/data.json",
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
const HowSectionCarouselRaw = withLoadingIndicator(
  () => import("@/components/carousels/how-section-carousel")
);
const WorkSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/work-section")
);
const FooterSectionRaw = withLoadingIndicator(
  () => import("@/views/Home/footer-section")
);

// Types
export interface SectionProps {
  scrollToTop: () => void;
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
const HowSectionCarousel = withScrollProp(HowSectionCarouselRaw as any);
const WorkSection = withScrollProp(WorkSectionRaw as any);
const FooterSection = withScrollProp(FooterSectionRaw as any);

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollLockRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(Date.now());
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);

  // Section definitions
  const sections: SectionConfig[] = useMemo(
    () => [
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
        Component: HowSectionCarousel,
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
    ],
    []
  );

  // Asset preloading
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Set up timeout for asset loading
        loadingTimeoutRef.current = setTimeout(() => {
          console.warn("Asset loading timeout - forcing load completion");
          setIsLoading(false);
        }, PRELOAD_TIMEOUT);

        // Parallel fetch all JSON files
        const jsonPromises = JSON_PATHS.map(async (path) => {
          const res = await fetch(path);
          if (!res.ok) throw new Error(`Failed to load ${path}`);
          return res.json();
        });

        // Preload vector image
        const vectorPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Vector image load failed"));
          img.src = VectorImage.src;
        });

        await Promise.all([...jsonPromises, vectorPromise]);
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

  // Scroll handling
  const scrollToSection = useCallback(
    (targetIndex: number) => {
      const now = Date.now();
      if (
        targetIndex < 0 ||
        targetIndex >= sections.length ||
        scrollLockRef.current ||
        now - lastScrollTime.current < SCROLL_DEBOUNCE ||
        modalOpen
      ) {
        return;
      }

      scrollLockRef.current = true;
      lastScrollTime.current = now;

      setCurrentPage(targetIndex);
      window.scrollTo({
        top: window.innerHeight * targetIndex,
        behavior: "smooth",
      });

      setTimeout(() => {
        scrollLockRef.current = false;
      }, SCROLL_LOCK_DURATION);
    },
    [sections.length, modalOpen]
  );

  // Wheel event handler
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (modalOpen || scrollLockRef.current) return;

      const delta = event.deltaY;
      if (Math.abs(delta) > SCROLL_THRESHOLD) {
        event.preventDefault();
        scrollToSection(currentPage + (delta > 0 ? 1 : -1));
      }
    },
    [currentPage, modalOpen, scrollToSection]
  );

  // Touch event handlers
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!modalOpen) {
        touchStartY.current = event.touches[0].clientY;
      }
    },
    [modalOpen]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (modalOpen || scrollLockRef.current || touchStartY.current === null) {
        return;
      }

      const deltaY = touchStartY.current - event.changedTouches[0].clientY;
      if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
        scrollToSection(currentPage + (deltaY > 0 ? 1 : -1));
      }

      touchStartY.current = null;
    },
    [currentPage, modalOpen, scrollToSection]
  );

  // Event listeners
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  return (
    <div className="relative w-full overflow-hidden">
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
                <Component
                  scrollToTop={() =>
                    useNextAction
                      ? scrollToSection(currentPage + 1)
                      : scrollToSection(0)
                  }
                />
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
