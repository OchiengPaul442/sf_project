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
import NextButton from "@/components/NextButton";

// Dynamic imports for sections/components
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
  // NextButton will be visible only if user is near the top (10px from the top)
  const [showNextButton, setShowNextButton] = useState(true);
  // Using HTMLElement for section refs.
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);

  useEffect(() => {
    if (!isLoading && !hasErrors) {
      setPageLoaded(true);
    }
  }, [isLoading, hasErrors]);

  const handleMenuClose = useCallback(() => {
    dispatch(toggleMenu());
  }, [dispatch]);

  // Helper to scroll smoothly to a section by index.
  const scrollToSection = useCallback((index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Listen to scroll events to hide the NextButton once the user scrolls more than 10px.
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 10) {
        setShowNextButton(false);
      } else {
        setShowNextButton(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call it initially in case the page is not at the very top
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderSection = useCallback(
    (section: (typeof SECTIONS)[number], index: number) => {
      let content;
      switch (section.id) {
        case "home":
          content = (
            <HeaderSection
              {...section}
              image="/Vector.svg"
              onNextSection={() => scrollToSection(index + 1)}
              animationData={animationDataMap?.["/lottie/sailing_boat_2.json"]}
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
          content = null;
      }

      return (
        <section
          key={section.id}
          ref={(el: HTMLElement | null): void => {
            sectionsRef.current[index] = el;
          }}
          className={`w-full ${
            section.id === "home"
              ? "min-h-[150vh] snap-none"
              : section.id === "how-carousel"
              ? "snap-none"
              : "min-h-screen snap-start"
          }`}
        >
          {content}
        </section>
      );
    },
    [animationDataMap, scrollToSection]
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

      {/* NextButton fades in only if the user is at the top (< 10px scrolled) */}
      <AnimatePresence>
        {showNextButton && (
          <motion.div
            key="next-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-auto"
          >
            <NextButton onClick={() => scrollToSection(1)} />
          </motion.div>
        )}
      </AnimatePresence>

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
