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

  // Decide how each section should be rendered, including snap classes.
  const renderSection = useCallback(
    (section: (typeof SECTIONS)[number], index: number) => {
      let content;
      switch (section.id) {
        case "home":
          // Example: The home section is quite tall. We'll skip snap here.
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
          // The carousel section also skips snapping.
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

      // Determine the snap class based on the section's ID.
      let snapClass = "snap-start"; // default
      if (section.id === "home" || section.id === "how-carousel") {
        snapClass = "snap-none";
      }

      // Choose a desired min-height. For "home", maybe it's 120vh or 150vh.
      const minHeight =
        section.id === "home" ? "min-h-[120vh]" : "min-h-screen";

      return (
        <section
          key={section.id}
          ref={(el: HTMLElement | null): void => {
            sectionsRef.current[index] = el;
          }}
          className={`w-full ${snapClass} ${minHeight}`}
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
    // The snap-container
    <div
      className="relative w-full bg-black min-h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* AnimatePresence for the loader */}
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

      {/* Main content after loading */}
      {pageLoaded && (
        <div className="w-full">
          {SECTIONS.map((section, index) => renderSection(section, index))}
        </div>
      )}

      {/* Menu modal */}
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
