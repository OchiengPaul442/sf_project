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
import throttle from "lodash/throttle";

import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { RootState } from "@/redux-store";

// Components
import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import NextButton from "@/components/NextButton";
import MenuModal from "@/components/dialog/menu-modal";

// Images / JSON used across sections
import VectorImage from "@/public/Vector.svg";

/**
 * JSON animations needed in all sections:
 *  - RobotSection: /lottie/robot.json
 *  - WorkSection (construction): /lottie/contruction.json
 *  - InvestSection (angel): /lottie/angel.json
 *  - HowSectionCarousel:
 *     /lottie/sailing_boat_2.json
 *     /lottie/paper_flying.json
 *     /lottie/spag_json.json
 *     /lottie/mark_json.json
 *     /lottie/data.json
 */
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

// ---------- DYNAMIC IMPORTS ----------
// 1) Import raw component without passing any props
const HeaderSectionRaw = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
});
const RobotSectionRaw = dynamic(() => import("@/views/Home/robotSection"), {
  ssr: false,
});
const HowSectionRaw = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
});
const HowSectionCarouselRaw = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false }
);
const WorkSectionRaw = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});
const InvestSectionRaw = dynamic(() => import("@/views/Home/invest-section"), {
  ssr: false,
});
const FooterSectionRaw = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
});

// ---------- PROPS / HOC ----------
export interface SectionProps {
  scrollToTop: () => void;
}

/**
 * HOC that ensures each section can receive `scrollToTop` prop
 * without type conflicts.
 */
function withScrollProp<T extends object>(
  Component: React.ComponentType<T & SectionProps>
): React.FC<T & SectionProps> {
  const WrappedComponent: React.FC<T & SectionProps> = (props) => {
    return <Component {...props} />;
  };
  WrappedComponent.displayName = `WithScrollProp(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
}

// Wrap each dynamic component with the HOC so we can pass `scrollToTop` prop
const HeaderSection = withScrollProp(HeaderSectionRaw);
const RobotSection = withScrollProp(RobotSectionRaw);
const HowSection = withScrollProp(HowSectionRaw);
const HowSectionCarousel = withScrollProp(HowSectionCarouselRaw);
const WorkSection = withScrollProp(WorkSectionRaw);
const InvestSection = withScrollProp(InvestSectionRaw);
const FooterSection = withScrollProp(FooterSectionRaw);

// ---------- HOME PAGE ----------
interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  preloadPriority: number;
  useNextAction?: boolean;
}

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scrollLockRef = useRef(false);

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen);

  // Define your sections
  const sections: SectionConfig[] = useMemo(
    () => [
      {
        Component: ({ scrollToTop }) => (
          <>
            {/* Header section with NextButton only here */}
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
        Component: InvestSection,
        id: "invest",
        preloadPriority: 6,
      },
      {
        Component: FooterSection,
        id: "footer",
        preloadPriority: 7,
      },
    ],
    []
  );

  /**
   * Preload all Lottie JSON + Vector image
   */
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // 1. Parallel fetch all JSON
        const jsonPromises = JSON_PATHS.map((path) =>
          fetch(path).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to load ${path}`);
            }
            return res.json();
          })
        );

        // 2. Preload Vector image
        const vectorPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = VectorImage.src;
        });

        // Wait for everything
        await Promise.all([...jsonPromises, vectorPromise]);

        // Optional small delay to prevent flicker
        // await new Promise((r) => setTimeout(r, 100));

        setIsLoading(false);
      } catch (error) {
        console.error("Preload failed:", error);
        setIsLoading(false);
      }
    };

    preloadAssets();
  }, []);

  /**
   * Check mobile to decide whether to attach wheel events
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /**
   * Scroll to a specific section
   */
  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length || scrollLockRef.current) {
        return;
      }
      scrollLockRef.current = true;
      setCurrentPage(index);

      const targetY = window.innerHeight * index;
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });

      // Release scroll lock after the animation
      setTimeout(() => {
        scrollLockRef.current = false;
      }, 700);
    },
    [sections.length]
  );

  /**
   * Throttled wheel handler (desktop only)
   */
  const handleScroll = useCallback(
    throttle((event: WheelEvent) => {
      // If the modal is open or locked, do nothing
      if (modalOpen || scrollLockRef.current) return;

      const delta = event.deltaY;
      if (delta > 50 && currentPage < sections.length - 1) {
        event.preventDefault();
        scrollToSection(currentPage + 1);
      } else if (delta < -50 && currentPage > 0) {
        event.preventDefault();
        scrollToSection(currentPage - 1);
      }
    }, 200), // short throttle for faster scrolling
    [currentPage, scrollToSection, sections.length, modalOpen]
  );

  /**
   * Add or remove wheel listener on desktop
   */
  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("wheel", handleScroll, { passive: false });
      return () => window.removeEventListener("wheel", handleScroll);
    }
  }, [handleScroll, isMobile]);

  /**
   * Render sections
   */
  const renderSections = () => {
    if (false) {
      // Mobile: default vertical scrolling
      return (
        <div className="w-full">
          {sections.map(({ Component, id }, idx) => (
            <div key={`section-${id}`} id={id} className="w-full min-h-screen">
              <Component
                scrollToTop={() => {
                  // If you want the button in the first section to jump to next on mobile:
                  if (idx === 0) {
                    scrollToSection(1);
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            </div>
          ))}
        </div>
      );
    } else {
      // Desktop: full viewport transitions
      return (
        <div
          style={{ height: `${100 * sections.length}vh`, position: "relative" }}
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
      );
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {renderSections()}

          {/* Slide-in Menu Modal */}
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

HomePage.displayName = "HomePage";
export default HomePage;
