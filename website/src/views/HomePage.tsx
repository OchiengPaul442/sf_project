"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
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

// Dynamic imports with loading state
const HeaderSection = dynamic(() => import("@/views/header-section"), {
  loading: () => <div className="h-screen bg-black" />,
  ssr: false,
});

const RobotSection = dynamic(() => import("@/views/robot-section"), {
  loading: () => <div className="h-screen bg-black" />,
  ssr: false,
});

const HowSection = dynamic(() => import("@/views/how-section"), {
  loading: () => <div className="h-screen bg-black" />,
  ssr: false,
});

const HowSectionCarousel = dynamic(
  () => import("@/views/how-section-carousel"),
  {
    loading: () => <div className="h-screen bg-black" />,
    ssr: false,
  }
);

const WorkSection = dynamic(() => import("@/views/work-section"), {
  loading: () => <div className="h-screen bg-black" />,
  ssr: false,
});

const FooterSection = dynamic(() => import("@/views/footer-section"), {
  loading: () => <div className="h-screen bg-black" />,
  ssr: false,
});

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const contactModalOpen = useSelector(
    (state) => state.ui.contactModalOpen
  ) as boolean;

  const [animationInitializing, setAnimationInitializing] = useState(true);
  const { isLoading, hasErrors, errors, animationDataMap } =
    useAnimationData(STEPS_WITH_IDS);

  // Improved loader state management
  useEffect(() => {
    if (!isLoading && !hasErrors) {
      // Give a slight delay for smoother transition
      const timer = setTimeout(() => {
        setAnimationInitializing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasErrors]);

  const handleCloseForm = useCallback(() => {
    dispatch(setContactModalOpen(false));
  }, [dispatch]);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (target) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  // Handle keyboard events and body overflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && contactModalOpen) {
        handleCloseForm();
      }
    };

    // Toggle body scroll lock
    document.body.style.overflow =
      contactModalOpen || animationInitializing ? "hidden" : "auto";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contactModalOpen, handleCloseForm, animationInitializing]);

  // Show error screen if there are any errors
  if (hasErrors) {
    return <ErrorDisplay errors={errors} />;
  }

  return (
    <div className="relative bg-black text-white">
      <AnimatePresence mode="wait">
        {(isLoading || animationInitializing) && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!animationInitializing && (
        <Suspense
          fallback={
            <div className="h-screen bg-black flex items-center justify-center">
              <Loader />
            </div>
          }
        >
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
        </Suspense>
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
            className="fixed inset-0 bg-white text-black z-50 overflow-y-auto md:overflow-hidden"
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
    </div>
  );
};

export default HomePage;
