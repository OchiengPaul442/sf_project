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

import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";
import HowSectionCarousel from "@/components/carousels/how-section-carousel";
import FooterSection from "@/views/Home/footer-section";

// Constants
const SCROLL_THRESHOLD = 50;
const SCROLL_LOCK_DURATION = 50;
const PRELOAD_TIMEOUT = 10000;
const CAROUSEL_SECTION_INDEX = 3;

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

// Lazy load components
const LazyComponent = React.lazy(() => import("@/components/LazyComponent"));

// Types
interface SectionProps {
  scrollToTop?: () => void;
  onScrollPastStart?: () => void;
  onScrollPastEnd?: () => void;
  onLoad?: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  preloadPriority: number;
  useNextAction?: boolean;
}

interface StepWithData {
  id: string;
  title: string;
  animationData: any;
}

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, any>>(
    {}
  );
  const scrollLockRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const sectionsRef = useRef<SectionConfig[]>([]);

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);

  const scrollToSection = useCallback(
    (targetIndex: number) => {
      if (modalOpen || scrollLockRef.current) return;
      if (targetIndex < 0 || targetIndex >= sectionsRef.current.length) return;

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

  const sections: SectionConfig[] = useMemo(() => {
    const sectionsArray: SectionConfig[] = [
      {
        Component: () => (
          <>
            <LazyComponent
              component="HeaderSection"
              scrollToTop={scrollToTop}
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <NextButton onClick={scrollToNextSection} />
            </div>
          </>
        ),
        id: "home",
        preloadPriority: 1,
      },
      {
        Component: () => <LazyComponent component="RobotSection" />,
        id: "platform",
        preloadPriority: 2,
      },
      {
        Component: () => <LazyComponent component="HowSection" />,
        id: "solutions",
        preloadPriority: 3,
      },
      {
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
        Component: () => <LazyComponent component="WorkSection" />,
        id: "work",
        preloadPriority: 5,
      },
      {
        Component: () => <FooterSection scrollToTop={scrollToTop} />,
        id: "footer",
        preloadPriority: 7,
      },
    ];

    sectionsRef.current = sectionsArray;
    return sectionsArray;
  }, [
    scrollToTop,
    scrollToNextSection,
    handleScrollPastEnd,
    handleScrollPastStart,
    stepsWithData,
  ]);

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

  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThrottle = 200; // ms

    const handleScroll = (delta: number) => {
      if (modalOpen) return; // Prevent scrolling when modal is open
      const now = Date.now();
      if (now - lastScrollTime < scrollThrottle) return;

      lastScrollTime = now;
      if (Math.abs(delta) > SCROLL_THRESHOLD) {
        const direction = delta > 0 ? 1 : -1;
        scrollToSection(currentPage + direction);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (modalOpen || scrollLockRef.current) return;
      if (currentPage === CAROUSEL_SECTION_INDEX) return;
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!modalOpen) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (modalOpen || scrollLockRef.current || touchStartY.current === null)
        return;
      if (currentPage === CAROUSEL_SECTION_INDEX) {
        touchStartY.current = null;
        return;
      }

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      handleScroll(deltaY);
      touchStartY.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, modalOpen, scrollToSection]);

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
            {sections.map(({ Component, id }, index) => (
              <AnimatedSection
                key={`section-${id}`}
                index={index}
                isActive={index === currentPage}
                total={sections.length}
                scrollDirection={currentPage > index ? "up" : "down"}
              >
                <div className="w-full h-full snap-start">
                  <Component />
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
