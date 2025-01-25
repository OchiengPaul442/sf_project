"use client";

import type React from "react";
import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import { HyperOptimizedAnimatedSection } from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import { preloadLottieAnimations } from "@/components/carousels/how-section-carousel";
import VectorImage from "@/public/Vector.svg";

interface SectionProps {
  scrollToTop: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  preloadPriority: number;
  useNextAction?: boolean;
}

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

const HeaderSection = dynamic(
  () =>
    import("@/views/Home/header-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    ssr: false,
  }
);

const RobotSection = dynamic(
  () =>
    import("@/views/Home/robotSection").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    ssr: false,
  }
);

const HowSection = dynamic(
  () =>
    import("@/views/Home/how-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    ssr: false,
  }
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
  {
    ssr: false,
  }
);

const InvestSection = dynamic(
  () =>
    import("@/views/Home/invest-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    ssr: false,
  }
);

const FooterSection = dynamic(
  () =>
    import("@/views/Home/footer-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    ssr: false,
  }
);

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollLockRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isOpen) as boolean;

  const sections: SectionConfig[] = useMemo(
    () => [
      {
        Component: HeaderSection,
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

  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length || scrollLockRef.current)
        return;

      scrollLockRef.current = true;
      setCurrentPage(index);

      const scrollHandler = () => {
        window.scrollTo({
          top: window.innerHeight * index,
          behavior: "smooth",
        });

        setTimeout(() => {
          scrollLockRef.current = false;
        }, 300);
      };

      requestAnimationFrame(scrollHandler);
    },
    [sections.length]
  );

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

        await new Promise((resolve) => setTimeout(resolve, 400));

        setIsLoading(false);
      } catch (error) {
        console.error("Preload failed:", error);
        setIsLoading(false);
      }
    };

    loadAllResources();
  }, []);

  const handleScroll = useCallback(
    (event: WheelEvent | TouchEvent) => {
      if (scrollLockRef.current) return;

      const isWheelEvent = event instanceof WheelEvent;
      const delta = isWheelEvent
        ? (event as WheelEvent).deltaY
        : (event as TouchEvent).touches[0].clientY;

      const isScrollingDown = isWheelEvent
        ? delta > 40
        : delta < window.innerHeight * 0.25;

      const isScrollingUp = isWheelEvent
        ? delta < -40
        : delta > window.innerHeight * 0.75;

      if (isScrollingDown && currentPage < sections.length - 1) {
        event.preventDefault();
        scrollToSection(currentPage + 1);
      } else if (isScrollingUp && currentPage > 0) {
        event.preventDefault();
        scrollToSection(currentPage - 1);
      }
    },
    [currentPage, scrollToSection, sections.length]
  );

  useEffect(() => {
    const options = { passive: false };
    window.addEventListener("wheel", handleScroll, options);
    window.addEventListener("touchmove", handleScroll, options);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `${100 * sections.length}vh` }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
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
            <AnimatePresence initial={false} mode="wait">
              {sections.map(({ Component, id, useNextAction }, index) => (
                <HyperOptimizedAnimatedSection
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
                </HyperOptimizedAnimatedSection>
              ))}
            </AnimatePresence>

            <MenuModal
              isOpen={isMenuOpen}
              onClose={() => dispatch(toggleMenu())}
              sections={sections}
              scrollToSection={scrollToSection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
