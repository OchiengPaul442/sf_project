"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/dialog/menu-modal";
import dynamic from "next/dynamic";
import type { SectionProps, StepWithData } from "@/utils/types/section";

// Dynamically import sections
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

const JSON_PATHS = [
  "/lottie/sailing_boat_2.json",
  "/lottie/paper_flying.json",
  "/lottie/spag_json.json",
  "/lottie/mark_json.json",
  "/lottie/data.json",
  "/lottie/robot.json",
  "/lottie/contruction.json",
  "/lottie/angel.json",
] as const;

const STEPS_WITH_IDS: StepWithData[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud Eliminated" },
];

const SECTIONS: SectionProps[] = [
  { id: "home", title: "Home" },
  { id: "robot", title: "Robot" },
  { id: "how", title: "How it works" },
  { id: "work", title: "Work" },
  { id: "footer", title: "Footer" },
];

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAssetLoader(JSON_PATHS);
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasErrors) {
      setPageLoaded(true);
    }
  }, [isLoading, hasErrors]);

  useEffect(() => {
    if (animationDataMap) {
      STEPS_WITH_IDS.forEach((step, index) => {
        step.animationData = animationDataMap[JSON_PATHS[index]];
      });
    }
  }, [animationDataMap]);

  if (hasErrors) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-4">
        <h2 className="text-xl mb-4">Failed to load required assets</h2>
        <ul className="text-red-500">
          {Object.entries(errors).map(([path, error]) => (
            <li key={path}>
              {path}: {error}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-black">
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderSection id="home" title="Home" image="/Vector.svg" />
          <RobotSection
            id="robot"
            title="Robot"
            animationData={animationDataMap["/lottie/robot.json"]}
          />
          <HowSection id="how" title="How it works" />
          <HowSectionCarousel
            id="how-carousel"
            title="How It Works Carousel"
            steps={STEPS_WITH_IDS}
          />
          <WorkSection
            id="work"
            title="Work"
            animationData={animationDataMap["/lottie/contruction.json"]}
          />
          <FooterSection id="footer" title="Footer" image="/logo-white.png" />
        </motion.div>
      )}

      <MenuModal
        isOpen={!!isMenuOpen}
        onClose={() => dispatch(toggleMenu())}
        sections={SECTIONS}
        scrollToSection={scrollToSection}
      />
    </div>
  );
};

export default HomePage;
