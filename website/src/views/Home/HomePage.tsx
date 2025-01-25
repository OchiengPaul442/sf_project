"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import AnimatedSection from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import { preloadLottieAnimations } from "@/components/carousels/how-section-carousel";
import VectorImage from "@/public/Vector.svg";
import { isMobileDevice } from "@/utils/deviceDetection";
import throttle from "lodash/throttle";
import type { RootState } from "@/redux-store";

// Define interfaces
interface SectionProps {
  scrollToTop: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  preloadPriority: number;
  useNextAction?: boolean;
}

// Higher-Order Component to inject scroll prop
const withScrollProp = (
  Component: React.ComponentType<any>
): React.ComponentType<SectionProps> => {
  const WrappedComponent = (props: SectionProps): React.JSX.Element => (
    <Component {...props} />
  );
  WrappedComponent.displayName = `WithScrollProp(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
};

// Dynamically import sections with SSR disabled
const HeaderSection = dynamic(
  () =>
    import("@/views/Home/header-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);
const RobotSection = dynamic(
  () =>
    import("@/views/Home/robotSection").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);
const HowSection = dynamic(
  () =>
    import("@/views/Home/how-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);
const HowSectionCarousel = dynamic(
  () =>
    import("@/components/carousels/how-section-carousel").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);
const WorkSection = dynamic(
  () =>
    import("@/views/Home/work-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);
const InvestSection = dynamic(
  () =>
    import("@/views/Home/invest-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);
const FooterSection = dynamic(
  () =>
    import("@/views/Home/footer-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  { ssr: false }
);

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollLockRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const modalOpen = useSelector((state: RootState) => state.ui.modalOpen); // Select modal state

  // Define sections using useMemo to prevent unnecessary recalculations
  const sections: SectionConfig[] = useMemo(
    () => [
      {
        Component: HeaderSection,
        id: "home",
        preloadPriority: 1,
        useNextAction: true,
      },
      { Component: RobotSection, id: "platform", preloadPriority: 2 },
      { Component: HowSection, id: "solutions", preloadPriority: 3 },
      { Component: HowSectionCarousel, id: "how-carousel", preloadPriority: 4 },
      { Component: WorkSection, id: "work", preloadPriority: 5 },
      { Component: InvestSection, id: "invest", preloadPriority: 6 },
      { Component: FooterSection, id: "footer", preloadPriority: 7 },
    ],
    []
  );

  // Scroll to specific section
  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length || scrollLockRef.current)
        return;

      scrollLockRef.current = true;
      setCurrentPage(index);

      const targetY = window.innerHeight * index;

      requestAnimationFrame(() => {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      });

      // Unlock scroll after the animation duration
      setTimeout(() => {
        scrollLockRef.current = false;
      }, 700); // Increased timeout for a slightly slower scroll
    },
    [sections.length]
  );

  // Preload resources
  useEffect(() => {
    const loadAllResources = async () => {
      try {
        await preloadLottieAnimations();

        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = VectorImage.src;
        });

        // Simulate minimal loading time for better UX
        await new Promise((resolve) => setTimeout(resolve, 200));

        setIsLoading(false);
      } catch (error) {
        console.error("Preload failed:", error);
        setIsLoading(false);
      }
    };

    loadAllResources();
  }, []);

  // Optimized scroll handler using throttle
  const handleScroll = useCallback(
    throttle((event: WheelEvent) => {
      // Disable scroll if modal is open or scroll is locked
      if (scrollLockRef.current || modalOpen) return;

      const delta = event.deltaY;

      if (delta > 50 && currentPage < sections.length - 1) {
        event.preventDefault();
        scrollToSection(currentPage + 1);
      } else if (delta < -50 && currentPage > 0) {
        event.preventDefault();
        scrollToSection(currentPage - 1);
      }
    }, 500), // Throttling interval
    [currentPage, scrollToSection, sections.length, modalOpen]
  );

  // Add event listeners with improved performance
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!isMobile) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (!isMobile) {
        window.removeEventListener("wheel", handleScroll);
      }
    };
  }, [handleScroll, isMobile]);

  // Render sections for mobile and desktop
  const renderSections = () => {
    if (isMobile) {
      return (
        <div className="w-full">
          {sections.map(({ Component, id }) => (
            <div key={`section-${id}`} id={id} className="w-full min-h-screen">
              <Component
                scrollToTop={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              />
            </div>
          ))}
        </div>
      );
    } else {
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
      {isLoading ? (
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
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {renderSections()}
          <MenuModal
            isOpen={isMenuOpen as boolean}
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
