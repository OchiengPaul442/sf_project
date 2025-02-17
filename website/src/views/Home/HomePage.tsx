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
import { useSectionScroller } from "@/hooks/useSectionScroller";
import { useIsMobile } from "@/hooks/useIsMobile";

// Dynamic imports for sections
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
  () => import("@/views/Home/how-section-carousel"),
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

  // Animation data state.
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);

  const [pageLoaded, setPageLoaded] = useState(false);
  // Determine if we are on a mobile device.
  const isMobile = useIsMobile();

  // References for each section’s DOM node.
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Use our improved section scroller hook.
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

  /**
   * Render each section.
   *
   * On desktop the original logic applies:
   * - "home", "how", "work" use native scrolling (snap-none).
   * - Others use snapping (snap-start).
   *
   * On mobile, we only want snapping for the header ("home")
   * and robot sections. All other sections use native smooth scrolling.
   */
  const renderSection = useCallback(
    (section: (typeof SECTIONS)[number], index: number) => {
      let content: React.ReactNode = null;

      switch (section.id) {
        case "home":
          content = (
            <HeaderSection
              {...section}
              image="/Vector.svg"
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
          content = <HowSection id={section.id} />;
          break;
        case "how-carousel":
          content = (
            <HowSectionCarousel
              id={section.id}
              title={section.title}
              steps={STEPS_WITH_IDS.map((step, stepIdx) => ({
                ...step,
                animationData: animationDataMap?.[JSON_PATHS[stepIdx]] || null,
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

      // Determine snapping behavior.
      // On mobile, only header and robot sections snap (others use native smooth scrolling).
      // On desktop, preserve the original logic:
      //   "home", "how", and "work" have native scroll (snap-none), and others snap (snap-start).
      let snapClass = "";
      if (isMobile) {
        snapClass = ["home", "robot"].includes(section.id)
          ? "snap-start"
          : "snap-none";
      } else {
        const nativeScrollIds = ["home", "how", "work"];
        snapClass = nativeScrollIds.includes(section.id)
          ? "snap-none"
          : "snap-start";
      }

      // For sections that allow native scrolling, we might need extra height.
      const minHeight =
        !isMobile && ["home", "how", "work"].includes(section.id)
          ? "min-h-[120vh]"
          : "min-h-screen";

      return (
        <section
          key={section.id}
          ref={(el) => {
            sectionsRef.current[index] = el;
          }}
          data-section-id={section.id}
          className={`w-full ${snapClass} ${minHeight}`}
        >
          {content}
        </section>
      );
    },
    [scrollToSection, animationDataMap, isMobile]
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
