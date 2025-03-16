"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAnimationData } from "@/hooks/useIntersectionObserverAndAnimationData";
import { JSON_PATHS, STEPS_WITH_IDS } from "@/lib/constants";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { setContactModalOpen } from "@/redux-store/slices/uiSlice";
import { toggleMenu } from "@/redux-store/slices/menuSlice";
import MenuModal from "@/components/features/dialog/menu-modal";
import ContactForm from "@/components/features/dialog/contact-form";
import Loader from "@/components/features/loader";

// Dynamic imports
const HeaderSection = dynamic(() => import("@/views/header-section"), {
  ssr: false,
});
const RobotSection = dynamic(() => import("@/views/robot-section"), {
  ssr: false,
});
const HowSection = dynamic(() => import("@/views/how-section"), {
  ssr: false,
});
const HowSectionCarousel = dynamic(
  () => import("@/views/how-section-carousel"),
  { ssr: false }
);
const WorkSection = dynamic(() => import("@/views/work-section"), {
  ssr: false,
});
const FooterSection = dynamic(() => import("@/views/footer-section"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const contactModalOpen = useSelector(
    (state) => state.ui.contactModalOpen
  ) as boolean;
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Always call hooks unconditionally.
  useEffect(() => {
    if (!isLoading && !hasErrors) {
      setPageLoaded(true);
    }
  }, [isLoading, hasErrors]);

  const handleCloseForm = useCallback(() => {
    dispatch(setContactModalOpen(false));
  }, [dispatch]);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && contactModalOpen) {
        handleCloseForm();
      }
    };
    document.body.style.overflow = contactModalOpen ? "hidden" : "unset";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contactModalOpen, handleCloseForm]);

  return (
    <div className="relative bg-black text-white">
      {hasErrors ? (
        <ErrorDisplay errors={errors} />
      ) : (
        <>
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
              <HeaderSection
                id="home"
                image="/Vector.svg"
                nextSectionId="robot-section"
              />

              <RobotSection
                id="robot-section"
                title="Robot Section"
                animationData={animationDataMap?.["/lottie/robot.json"]}
              />

              <HowSection id="how" />

              <HowSectionCarousel
                id="how-carousel"
                title="How It Works"
                steps={STEPS_WITH_IDS.map((step, idx) => ({
                  ...step,
                  animationData: animationDataMap?.[JSON_PATHS[idx]] || null,
                }))}
              />

              <WorkSection
                id="work"
                title="Work Section"
                animationData={animationDataMap?.["/lottie/contruction.json"]}
              />

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

          <AnimatePresence>
            {contactModalOpen && (
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: "0%" }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                className="fixed inset-0 bg-white text-black z-50 overflow-y-scroll md:overflow-hidden"
              >
                <div className="relative h-full">
                  <button
                    onClick={handleCloseForm}
                    className="absolute right-4 top-4 p-2 bg-gray-100 text-green-600 hover:bg-gray-200 hover:text-green-700 rounded-full transition-colors z-50"
                    aria-label="Close Contact Form"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="h-full">
                    <ContactForm />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default HomePage;
