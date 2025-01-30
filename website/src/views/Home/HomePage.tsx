"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader";
import RobotSection from "@/views/Home/robotSection";
import FooterSection from "./footer-section";
import dynamic from "next/dynamic";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import MenuModal from "@/components/dialog/menu-modal";

// Dynamically import sections with no SSR
const HowSectionCarousel = dynamic(
  () => import("@/components/carousels/how-section-carousel"),
  { ssr: false }
);

const HeaderSection = dynamic(() => import("@/views/Home/header-section"), {
  ssr: false,
});

const WorkSection = dynamic(() => import("@/views/Home/work-section"), {
  ssr: false,
});

const HowSection = dynamic(() => import("@/views/Home/how-section"), {
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

const STEPS_WITH_IDS: any[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud Eliminated" },
];

const SECTIONS = [
  { id: "home", title: "Home" },
  { id: "robot", title: "Robot" },
  { id: "how", title: "How it works" },
  { id: "work", title: "Work" },
  { id: "footer", title: "Footer" },
];

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  // Use the new asset loader
  const { isLoading, hasErrors, errors } = useAssetLoader(JSON_PATHS);
  const isMenuOpen = useSelector((state) => state.menu.isOpen);

  // Show error state if any assets failed to load
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
    return;
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

      {!isLoading && (
        <>
          <HeaderSection />
          <RobotSection />
          <HowSection />
          <HowSectionCarousel steps={STEPS_WITH_IDS} />
          <WorkSection />
          <FooterSection />
        </>
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
