"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import type { RootState } from "@/redux-store";
import VectorImage from "@/public/Vector.svg";

// Components
import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";
import HowSectionCarousel from "@/components/carousels/how-section-carousel";
import FooterSection from "@/views/Home/footer-section";
import LazyComponent from "@/components/LazyComponent";

// ----- Constants -----
const SCROLL_THRESHOLD = 25;
const SCROLL_LOCK_DURATION = 200;
const PRELOAD_TIMEOUT = 10000;

// Section indices
const HOME_SECTION_INDEX = 0;
const HOW_SECTION_INDEX = 2;
const HOW_CAROUSEL_SECTION_INDEX = 3;

// JSON paths for preloading
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

// ----- Types -----
interface SectionProps {
  isActive: boolean;
  scrollToTop?: () => void;
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
}

interface StepWithData {
  id: string;
  title: string;
  animationData: any;
}

// ----- HomePage Component -----
const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  // --- Global State ---
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);
  const contactModalOpen = useSelector(
    (state: RootState) => state.ui.contactModalOpen
  );

  // --- Local State ---
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  // --- Refs ---
  const scrollLockRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // ----- Handlers -----
  const scrollToSection = useCallback(
    (targetIndex: number) => {
      // Avoid scrolling if modals are open or if we're locked
      if (modalOpen || contactModalOpen || scrollLockRef.current) return;
      if (targetIndex < 0 || targetIndex >= sections.length) return;

      scrollLockRef.current = true;
      setScrollDirection(targetIndex > currentPage ? "down" : "up");
      setCurrentPage(targetIndex);

      setTimeout(() => {
        scrollLockRef.current = false;
      }, SCROLL_LOCK_DURATION);
    },
    [modalOpen, contactModalOpen, currentPage]
  );

  const scrollToTop = useCallback(() => {
    scrollToSection(HOME_SECTION_INDEX);
  }, [scrollToSection]);

  const scrollToNextSection = useCallback(() => {
    scrollToSection(currentPage + 1);
  }, [currentPage, scrollToSection]);

  const handleScrollPastStart = useCallback(() => {
    scrollToSection(currentPage - 1);
  }, [currentPage, scrollToSection]);

  const handleScrollPastEnd = useCallback(() => {
    scrollToSection(currentPage + 1);
  }, [currentPage, scrollToSection]);

  // Steps for the "HowSectionCarousel"
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

  // When HowSection completes scrolling (reaches top or bottom)
  const handleHowSectionComplete = useCallback(
    (direction: "up" | "down") => {
      if (direction === "up" && currentPage === HOW_SECTION_INDEX) {
        scrollToSection(currentPage - 1);
      } else if (direction === "down" && currentPage === HOW_SECTION_INDEX) {
        scrollToSection(currentPage + 1);
      }
    },
    [currentPage, scrollToSection]
  );

  // ----- Sections Array -----
  const sections: SectionConfig[] = useMemo(() => {
    return [
      {
        id: "home",
        Component: ({ isActive }: SectionProps) => (
          <>
            <LazyComponent
              component="HeaderSection"
              scrollToTop={scrollToTop}
              isActive={isActive}
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <NextButton onClick={scrollToNextSection} />
            </div>
          </>
        ),
      },
      {
        id: "platform",
        Component: ({ isActive }: SectionProps) => (
          <LazyComponent component="RobotSection" isActive={isActive} />
        ),
      },
      {
        id: "solutions",
        Component: ({ isActive }: SectionProps) => (
          <LazyComponent
            component="HowSection"
            isActive={isActive}
            onScrollProgress={(progress: number) => {
              // If near top, scroll to previous; if near bottom, scroll to next.
              if (progress <= 0) handleHowSectionComplete("up");
              if (progress >= 1) handleHowSectionComplete("down");
            }}
          />
        ),
      },
      {
        id: "how-carousel",
        Component: ({ isActive }: SectionProps) => (
          <HowSectionCarousel
            onScrollPastStart={handleScrollPastStart}
            onScrollPastEnd={handleScrollPastEnd}
            steps={stepsWithData}
            isActive={isActive}
          />
        ),
      },
      {
        id: "work",
        Component: ({ isActive }: SectionProps) => (
          <LazyComponent component="WorkSection" isActive={isActive} />
        ),
      },
      {
        id: "footer",
        Component: ({ isActive }: SectionProps) => (
          <FooterSection scrollToTop={scrollToTop} isActive={isActive} />
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stepsWithData,
    handleScrollPastStart,
    handleScrollPastEnd,
    scrollToTop,
    scrollToNextSection,
    handleHowSectionComplete,
  ]);

  // ----- Preload Lottie + Vector Assets -----
  useEffect(() => {
    const preloadAssets = async () => {
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn("Asset loading timeout - forcing load completion.");
        setIsLoading(false);
      }, PRELOAD_TIMEOUT);

      try {
        // Preload JSON
        const fetchedData = await Promise.all(
          JSON_PATHS.map(async (path) => {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`Failed to load ${path}`);
            const json = await res.json();
            return { path, data: json };
          })
        );

        const dataMap: Record<string, any> = {};
        fetchedData.forEach(({ path, data }) => {
          dataMap[path] = data;
        });

        // Preload Vector
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Vector image load failed."));
          img.src = VectorImage.src;
        });

        setAnimationDataMap(dataMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Asset preload error:", error);
        setIsLoading(false);
      } finally {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      }
    };

    preloadAssets();
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // ----- Wheel & Touch Scroll Logic -----
  const handleGlobalScroll = useCallback(
    (deltaY: number) => {
      if (modalOpen || contactModalOpen || scrollLockRef.current) return;

      // If we are in the HowSection or the HowCarousel, do not snap scroll
      // (they handle their own scrolling).
      if (
        currentPage === HOW_SECTION_INDEX ||
        currentPage === HOW_CAROUSEL_SECTION_INDEX
      ) {
        return;
      }

      const now = Date.now();
      // Prevent multiple triggers within the lock duration
      if (now - lastScrollTimeRef.current < SCROLL_LOCK_DURATION) return;
      lastScrollTimeRef.current = now;

      // Snap logic
      if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
        const direction = deltaY > 0 ? 1 : -1;
        scrollToSection(currentPage + direction);
      }
    },
    [currentPage, scrollToSection, modalOpen, contactModalOpen]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // If in the how section, allow normal scroll
      if (currentPage !== HOW_SECTION_INDEX) {
        e.preventDefault();
      }
      handleGlobalScroll(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!modalOpen && !contactModalOpen) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (
        modalOpen ||
        contactModalOpen ||
        scrollLockRef.current ||
        touchStartY.current === null
      )
        return;

      // If not in the how section or carousel, do snap scrolling
      if (
        currentPage !== HOW_SECTION_INDEX &&
        currentPage !== HOW_CAROUSEL_SECTION_INDEX
      ) {
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        handleGlobalScroll(deltaY);
      }
      touchStartY.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentPage, handleGlobalScroll, modalOpen, contactModalOpen]);

  // ----- Render -----
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loader */}
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

      {/* Main Content */}
      {!isLoading && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full"
        >
          <div className="relative w-full h-full">
            {sections.map(({ Component, id }, index) => (
              <AnimatedSection
                key={id}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
                scrollDirection={scrollDirection}
              >
                <Component isActive={index === currentPage} />
              </AnimatedSection>
            ))}
          </div>

          {/* Menu Modal */}
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
