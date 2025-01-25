"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import NextButton from "@/components/NextButton";
import { HyperOptimizedAnimatedSection } from "@/components/AnimatedSection";
import Loader from "@/components/loader";
import { preloadLottieAnimations } from "@/components/carousels/how-section-carousel";

// Consistent interface for all section components
interface SectionProps {
  scrollToTop: () => void;
}

interface SectionConfig {
  Component: React.ComponentType<SectionProps>;
  id: string;
  preloadPriority: number;
  useNextAction?: boolean;
}

// Wrapper function to ensure type compatibility
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

// Dynamic imports with proper Next.js dynamic configuration
const HeaderSection = dynamic(
  () =>
    import("@/views/Home/header-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const RobotSection = dynamic(
  () =>
    import("@/views/Home/robotSection").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const HowSection = dynamic(
  () =>
    import("@/views/Home/how-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const HowSectionCarousel = dynamic(
  () =>
    import("@/components/carousels/how-section-carousel").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const WorkSection = dynamic(
  () =>
    import("@/views/Home/work-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const InvestSection = dynamic(
  () =>
    import("@/views/Home/invest-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const FooterSection = dynamic(
  () =>
    import("@/views/Home/footer-section").then((mod) =>
      withScrollProp(mod.default)
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
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
      setIsScrolling(true);
      setCurrentPage(index);

      const scrollHandler = () => {
        window.scrollTo({
          top: window.innerHeight * index,
          behavior: "smooth",
        });

        setTimeout(() => {
          scrollLockRef.current = false;
          setIsScrolling(false);
        }, 300);
      };

      requestAnimationFrame(scrollHandler);
    },
    [sections.length]
  );

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        await preloadLottieAnimations();
        setTimeout(() => setIsLoading(false), 400);
      } catch (error) {
        console.error("Preload failed:", error);
        setIsLoading(false);
      }
    };

    loadAnimations();
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

  if (isLoading) return <Loader />;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `${100 * sections.length}vh` }}
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
            <Suspense fallback={<Loader />}>
              <Component
                scrollToTop={() =>
                  useNextAction
                    ? scrollToSection(currentPage + 1)
                    : scrollToSection(0)
                }
              />
            </Suspense>
          </HyperOptimizedAnimatedSection>
        ))}
      </AnimatePresence>

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => dispatch(toggleMenu())}
        sections={sections}
        scrollToSection={scrollToSection}
      />

      {!isScrolling && currentPage < sections.length - 3 && (
        <NextButton
          onClick={() => scrollToSection(currentPage + 1)}
          isVisible
        />
      )}
    </div>
  );
}
