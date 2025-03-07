"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import Loader from "@/components/loader";
import MenuModal from "@/components/dialog/menu-modal";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAnimationData } from "@/hooks/useIntersectionObserverAndAnimationData";
import { JSON_PATHS, STEPS_WITH_IDS } from "@/lib/constants";
import dynamic from "next/dynamic";
import { toggleMenu } from "@/redux-store/slices/menuSlice";

// Dynamically import all sections
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

  // Load animation data for Lottie
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasErrors) {
      setPageLoaded(true);
    }
  }, [isLoading, hasErrors]);

  if (hasErrors) {
    return <ErrorDisplay errors={errors} />;
  }

  // Scroll helper for MenuModal
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-black text-white">
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
        <>
          {/* Header */}
          <HeaderSection
            id="home"
            image="/Vector.svg"
            nextSectionId="robot-section"
          />

          {/* Robot */}
          <RobotSection
            id="robot-section"
            title="Robot Section"
            animationData={animationDataMap?.["/lottie/robot.json"]}
          />

          {/* How Section */}
          <HowSection id="how" />

          {/* How Carousel */}
          <HowSectionCarousel
            id="how-carousel"
            title="How It Works"
            steps={STEPS_WITH_IDS.map((step, idx) => ({
              ...step,
              animationData: animationDataMap?.[JSON_PATHS[idx]] || null,
            }))}
          />

          {/* Work Section */}
          <WorkSection
            id="work"
            title="Work Section"
            animationData={animationDataMap?.["/lottie/contruction.json"]}
          />

          {/* Footer */}
          <FooterSection
            id="footer"
            title="Footer Section"
            image="/logo-white.png"
          />
        </>
      )}

      <MenuModal
        isOpen={Boolean(isMenuOpen)}
        onClose={() => dispatch(toggleMenu())}
        scrollToSection={scrollToSection}
      />
    </div>
  );
};

export default HomePage;
