"use client";

import type React from "react";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import type { RootState } from "@/redux-store";

import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";
import HowSectionCarousel from "@/components/carousels/how-section-carousel";
import FooterSection from "@/views/Home/footer-section";
import LazyComponent from "@/components/LazyComponent";

import { isMobileDevice } from "@/utils/deviceDetection";

const SCROLL_THRESHOLD = 50;
const SCROLL_LOCK_DURATION = 500;
const PRELOAD_TIMEOUT = 10000;

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
  isActive: boolean;
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
  scrollToTop?: () => void;
  onScrollComplete?: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  allowScroll?: boolean;
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

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  const scrollLockRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const preloadAssets = async () => {
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn("Asset loading timeout - forcing load completion.");
        setIsLoading(false);
      }, PRELOAD_TIMEOUT);

      try {
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

  const scrollToSection = useCallback(
    (targetIndex: number) => {
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
    scrollToSection(0);
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

  const handleScrollComplete = useCallback(() => {
    scrollToSection(currentPage + 1);
  }, [currentPage, scrollToSection]);

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

  const isMobile = isMobileDevice();

  const sections: SectionConfig[] = useMemo(
    () => [
      {
        id: "home",
        allowScroll: false,
        Component: ({ isActive }) => (
          <>
            <LazyComponent
              component="HeaderSection"
              isActive={isActive}
              scrollToTop={scrollToTop}
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <NextButton onClick={scrollToNextSection} />
            </div>
          </>
        ),
      },
      {
        id: "robot",
        allowScroll: false,
        Component: ({ isActive }) => (
          <LazyComponent component="RobotSection" isActive={isActive} />
        ),
      },
      {
        id: "solutions",
        allowScroll: true,
        Component: ({
          isActive,
          onScrollPastStart,
          onScrollPastEnd,
          onScrollComplete,
        }) => (
          <LazyComponent
            component="HowSection"
            isActive={isActive}
            onScrollProgress={(p: number) => {
              if (isMobile) {
                if (p <= 0) onScrollPastStart?.();
                if (p >= 1) onScrollComplete?.();
              } else {
                if (p <= 0) onScrollPastStart?.();
                if (p >= 1) onScrollPastEnd?.();
              }
            }}
            onScrollComplete={isMobile ? undefined : onScrollComplete}
          />
        ),
      },
      {
        id: "how-carousel",
        allowScroll: true,
        Component: ({ isActive, onScrollPastStart, onScrollPastEnd }) => (
          <HowSectionCarousel
            steps={stepsWithData}
            isActive={isActive}
            onScrollPastStart={onScrollPastStart}
            onScrollPastEnd={isMobile ? undefined : onScrollPastEnd}
            onScrollComplete={isMobile ? onScrollPastEnd : undefined}
          />
        ),
      },
      {
        id: "work",
        allowScroll: false,
        Component: ({ isActive }) => (
          <LazyComponent component="WorkSection" isActive={isActive} />
        ),
      },
      {
        id: "footer",
        allowScroll: false,
        Component: ({ isActive }) => (
          <FooterSection scrollToTop={scrollToTop} isActive={isActive} />
        ),
      },
    ],
    [scrollToTop, scrollToNextSection, stepsWithData, isMobile]
  );

  const handleGlobalScroll = useCallback(
    (deltaY: number) => {
      if (modalOpen || contactModalOpen || scrollLockRef.current) return;
      if (sections[currentPage]?.allowScroll && !isMobile) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_LOCK_DURATION) return;
      lastScrollTimeRef.current = now;

      if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
        const direction = deltaY > 0 ? 1 : -1;
        scrollToSection(currentPage + direction);
      }
    },
    [
      modalOpen,
      contactModalOpen,
      currentPage,
      sections,
      scrollToSection,
      isMobile,
    ]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!sections[currentPage]?.allowScroll || isMobile) {
        e.preventDefault();
      }
      handleGlobalScroll(e.deltaY);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [currentPage, sections, handleGlobalScroll, isMobile]);

  useEffect(() => {
    let touchMoveHandler: ((e: TouchEvent) => void) | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (!modalOpen && !contactModalOpen) {
        touchStartYRef.current = e.touches[0].clientY;

        touchMoveHandler = (moveEvent: TouchEvent) => {
          if (touchStartYRef.current === null) return;

          const currentY = moveEvent.touches[0].clientY;
          const deltaY = touchStartYRef.current - currentY;

          if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
            if (!sections[currentPage]?.allowScroll || !isMobile) {
              const direction = deltaY > 0 ? 1 : -1;
              scrollToSection(currentPage + direction);
              touchStartYRef.current = null;
              window.removeEventListener("touchmove", touchMoveHandler!);
            }
          }
        };

        window.addEventListener("touchmove", touchMoveHandler);
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      if (touchMoveHandler) {
        window.removeEventListener("touchmove", touchMoveHandler);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (touchMoveHandler) {
        window.removeEventListener("touchmove", touchMoveHandler);
      }
    };
  }, [
    currentPage,
    modalOpen,
    contactModalOpen,
    scrollToSection,
    sections,
    isMobile,
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
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
          className="relative w-full h-full"
        >
          <AnimatePresence mode="wait">
            {sections.map(({ Component, id }, index) => (
              <AnimatedSection
                key={id}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
                scrollDirection={scrollDirection}
              >
                <Component
                  isActive={index === currentPage}
                  onScrollPastStart={handleScrollPastStart}
                  onScrollPastEnd={handleScrollPastEnd}
                  onScrollComplete={
                    id === "solutions" ? handleScrollComplete : undefined
                  }
                />
              </AnimatedSection>
            ))}
          </AnimatePresence>

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
