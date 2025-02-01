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
import { X } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { setContactModalOpen } from "@/redux-store/slices/uiSlice";

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
  const contactModalOpen = useSelector(
    (state) => state.ui.contactModalOpen
  ) as boolean;

  const handleCloseForm = useCallback(() => {
    dispatch(setContactModalOpen(false));
  }, [dispatch]);

  // Close modal on Escape key and manage body scroll.
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

      {/* Contact modal */}
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
            className="fixed inset-0 bg-white z-50 overflow-y-auto md:overflow-hidden"
          >
            <div className="relative h-full">
              <button
                onClick={handleCloseForm}
                className="absolute right-4 top-4 p-2 bg-gray-100 text-green-600 hover:bg-gray-200 hover:text-green-700 rounded-full transition-colors z-50"
                aria-label="Close Contact Form"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="h-full text-black">
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
