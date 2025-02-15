"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import Loader from "@/components/loader";
import MenuModal from "@/components/dialog/menu-modal";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAnimationData } from "@/hooks/useIntersectionObserverAndAnimationData";
import { SECTIONS, JSON_PATHS, STEPS_WITH_IDS } from "@/lib/constants";
import dynamic from "next/dynamic";

// Scroll hooks.
import { useGlobalScrollLock } from "@/hooks/useGlobalScrollLock";
import { useSectionScroller } from "@/hooks/useSectionScroller";

// Dynamic imports.
const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
});
const RobotSection = dynamic(() => import("@/views/Home/robotSection"), {
  ssr: false,
});
const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
});
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false }
);
const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});
const FooterSection = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const [pageLoaded, setPageLoaded] = useState(false);
  // Reference for each section's DOM element.
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);

  // Global scroll lock.
  const { lockScroll, unlockScroll } = useGlobalScrollLock();

  // Section scroller.
  const { scrollToSection } = useSectionScroller(sectionsRef, {
    scrollDuration: 800,
    globalLock: false,
  });

  // Track the active section index.
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      let currentActive = 0;
      sectionsRef.current.forEach((section, i) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            currentActive = i;
          }
        }
      });
      setActiveSectionIndex(currentActive);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && !hasErrors) {
      setPageLoaded(true);
    }
  }, [isLoading, hasErrors]);

  const handleMenuClose = useCallback(() => {
    dispatch(toggleMenu());
  }, [dispatch]);

  const renderSection = useCallback(
    (section: (typeof SECTIONS)[number], index: number) => {
      let content: React.ReactNode = null;
      switch (section.id) {
        case "home":
          content = (
            <HeaderSection
              {...section}
              onNextSection={() => scrollToSection(index + 1)}
            />
          );
          break;
        case "robot":
          content = (
            <RobotSection
              {...section}
              animationData={animationDataMap?.["/lottie/robot.json"]}
            />
          );
          break;
        case "how":
          content = (
            <HowSection
              {...section}
              scrollLockControls={{ lockScroll, unlockScroll }}
              onTransitionNext={() => scrollToSection(index + 1)}
              onTransitionPrev={() => scrollToSection(index - 1)}
              isActive={activeSectionIndex === index}
            />
          );
          break;
        case "how-carousel":
          content = (
            <HowSectionCarousel
              id={section.id}
              title={section.title}
              steps={STEPS_WITH_IDS.map((step, idx) => ({
                ...step,
                animationData: animationDataMap?.[JSON_PATHS[idx]] || null,
              }))}
              scrollLockControls={{ lockScroll, unlockScroll }}
            />
          );
          break;
        case "work":
          content = (
            <WorkSection
              {...section}
              animationData={animationDataMap?.["/lottie/contruction.json"]}
            />
          );
          break;
        case "footer":
          content = <FooterSection {...section} image="/logo-white.png" />;
          break;
        default:
          break;
      }
      // For "home" we avoid snap so the header can be taller.
      const snapClass = section.id === "home" ? "snap-none" : "snap-start";
      const minHeight =
        section.id === "home" ? "min-h-[120vh]" : "min-h-screen";

      return (
        <section
          key={section.id}
          ref={(el) => {
            sectionsRef.current[index] = el;
          }}
          className={`w-full ${snapClass} ${minHeight}`}
        >
          {content}
        </section>
      );
    },
    [
      animationDataMap,
      scrollToSection,
      lockScroll,
      unlockScroll,
      activeSectionIndex,
    ]
  );

  if (hasErrors) {
    return <ErrorDisplay errors={errors} />;
  }

  return (
    <div
      className="relative w-full bg-black min-h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
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
      {pageLoaded && (
        <div className="w-full">
          {SECTIONS.map((section, index) => renderSection(section, index))}
        </div>
      )}
      <MenuModal
        isOpen={Boolean(isMenuOpen)}
        onClose={handleMenuClose}
        scrollToSection={(id: string) => {
          const index = SECTIONS.findIndex((section) => section.id === id);
          if (index !== -1) scrollToSection(index);
        }}
      />
    </div>
  );
};

export default HomePage;
