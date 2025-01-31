"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import Loader from "@/components/loader";
import MenuModal from "@/components/dialog/menu-modal";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAnimationData } from "@/hooks/useIntersectionObserver";
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
  // Section refs for smooth scrolling between sections
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
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

  const renderSection = useCallback(
    (section: (typeof SECTIONS)[number], index: number) => {
      const sectionContent = () => {
        switch (section.id) {
          case "home":
            return (
              <HeaderSection
                {...section}
                image="/Vector.svg"
                onNextSection={() => {
                  sectionsRef.current[index + 1]?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                animationData={
                  animationDataMap?.["/lottie/sailing_boat_2.json"]
                }
              />
            );
          case "robot":
            return (
              <RobotSection
                {...section}
                animationData={animationDataMap?.["/lottie/robot.json"]}
              />
            );
          case "how":
            return (
              <HowSection
                {...section}
                animationData={animationDataMap?.["/lottie/how.json"]}
              />
            );
          case "how-carousel":
            return (
              <HowSectionCarousel
                id={section.id}
                title={section.title}
                steps={STEPS_WITH_IDS.map((step, idx) => ({
                  ...step,
                  animationData: animationDataMap?.[JSON_PATHS[idx]] || null,
                }))}
              />
            );
          case "work":
            return (
              <WorkSection
                {...section}
                animationData={animationDataMap?.["/lottie/contruction.json"]}
              />
            );
          case "footer":
            return <FooterSection {...section} image="/logo-white.png" />;
          default:
            return null;
        }
      };

      return (
        <section
          key={section.id}
          ref={(el) => {
            sectionsRef.current[index] = el as HTMLDivElement | null;
          }}
          className={`w-full min-h-screen ${
            section.id === "how-carousel" ? "snap-none" : "snap-start"
          }`}
        >
          {sectionContent()}
        </section>
      );
    },
    [animationDataMap]
  );

  if (hasErrors) {
    return <ErrorDisplay errors={errors} />;
  }

  return (
    <div className="relative w-full bg-black min-h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
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
        scrollToSection={(id) => {
          const index = SECTIONS.findIndex((section) => section.id === id);
          if (index !== -1)
            sectionsRef.current[index]?.scrollIntoView({
              behavior: "smooth",
            });
        }}
      />
    </div>
  );
};

export default HomePage;
