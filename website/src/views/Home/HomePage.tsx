// pages/index.tsx
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

// Import scroll hooks.
import { useGlobalScrollLock } from "@/hooks/useGlobalScrollLock";
import { useSectionScroller } from "@/hooks/useSectionScroller";

// Dynamic imports for sections/components.
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false }
);
const RobotSection = dynamic(() => import("@/views/Home/robotSection"), {
  ssr: false,
});
const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
});
const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});
const HowSection = dynamic(() => import("@/views/Home/how-section"), {
  ssr: false,
});
const FooterSection = dynamic(() => import("@/views/Home/footer-section"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const [pageLoaded, setPageLoaded] = useState(false);
  // Ref to store each section’s element.
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);

  // Global scroll lock.
  const { lockScroll, unlockScroll } = useGlobalScrollLock();

  // Section scroller hook.
  const { scrollToSection } = useSectionScroller(sectionsRef, {
    scrollDuration: 800,
    globalLock: false,
  });

  useEffect(() => {
    if (!isLoading && !hasErrors) {
      setPageLoaded(true);
    }
  }, [isLoading, hasErrors]);

  const handleMenuClose = useCallback(() => {
    dispatch(toggleMenu());
  }, [dispatch]);

  // Render each section.
  const renderSection = useCallback(
    (section: (typeof SECTIONS)[number], index: number) => {
      let content = null;
      switch (section.id) {
        case "home":
          content = (
            <HeaderSection
              {...section}
              image="/Vector.svg"
              onNextSection={() => scrollToSection(index + 1)}
              animationData={animationDataMap?.["/lottie/sailing_boat_2.json"]}
              scrollLockControls={{ lockScroll, unlockScroll }}
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
              animationData={animationDataMap?.["/lottie/how.json"]}
              scrollLockControls={{ lockScroll, unlockScroll }}
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
      }
      // Use scroll-snap classes (preserving your original design).
      const snapClass = section.id === "home" ? "snap-none" : "snap-start";
      const minHeight =
        section.id === "home" ? "min-h-[120vh]" : "min-h-screen";

      return (
        <section
          key={section.id}
          ref={(el) => {
            if (sectionsRef.current) {
              sectionsRef.current[index] = el;
            }
          }}
          className={`w-full ${snapClass} ${minHeight}`}
        >
          {content}
        </section>
      );
    },
    [animationDataMap, scrollToSection, lockScroll, unlockScroll]
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
        <div className="w-full">{SECTIONS.map(renderSection)}</div>
      )}
      <MenuModal
        isOpen={Boolean(isMenuOpen)}
        onClose={handleMenuClose}
        scrollToSection={(id) => {
          const index = SECTIONS.findIndex((section) => section.id === id);
          if (index !== -1) scrollToSection(index);
        }}
      />
    </div>
  );
};

export default HomePage;
