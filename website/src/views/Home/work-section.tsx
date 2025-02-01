"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "@/redux-store/hooks";
import lottie, { type AnimationItem } from "lottie-web";
import { ArrowRight, X } from "lucide-react";
import { setContactModalOpen } from "@/redux-store/slices/uiSlice";
import { ContactForm } from "@/components/forms/contact-form";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { SectionProps } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";

const WorkSection: React.FC<SectionProps> = ({ id, animationData }) => {
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const contactModalOpen = useSelector(
    (state) => state.ui.contactModalOpen
  ) as boolean;
  const isMobile = isMobileDevice();

  const handleOpenForm = useCallback(() => {
    dispatch(setContactModalOpen(true));
  }, [dispatch]);

  const handleCloseForm = useCallback(() => {
    dispatch(setContactModalOpen(false));
  }, [dispatch]);

  useEffect(() => {
    let animation: AnimationItem | null = null;
    if (lottieContainerRef.current && animationData) {
      animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
      animation.setSpeed(1.2);
    }
    return () => {
      if (animation) animation.destroy();
    };
  }, [animationData]);

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
    <section
      id={id}
      className="w-full h-dvh md:min-h-screen overflow-y-scroll bg-[#f5f5f5] text-black relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className={`container mx-auto flex flex-col lg:flex-row items-center justify-center h-full relative ${mainConfigs.SECTION_CONTAINER_CLASS}`}
        initial={isMobile ? {} : { opacity: 0, y: 50 }}
        animate={isMobile ? {} : { opacity: 1, y: 0 }}
        transition={
          isMobile
            ? {}
            : { type: "spring", stiffness: 300, damping: 30, duration: 0.5 }
        }
      >
        <div className="text-center lg:text-left space-y-6 lg:space-y-8 max-w-3xl w-full lg:w-1/2 mb-12 lg:mb-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal">
            Work with us
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-[80px] font-extrabold leading-[1.2] md:leading-[1] tracking-normal">
            Are you an engineer who&apos;s excited about our{" "}
            <span className="block sm:inline">mission?</span>
          </h3>
          <div className="mt-8 lg:mt-12">
            <button
              onClick={handleOpenForm}
              className="group inline-flex items-center font-bold relative text-sm sm:text-base cursor-pointer"
              aria-label="Open contact form"
            >
              <span className="relative z-10 mr-2 px-6 py-3 font-semibold sm:px-8 bg-[#e6e6e6] rounded-full transition-colors group-hover:bg-[#d9d9d9] pointer-events-none">
                Reach out
              </span>
              <span className="relative z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full text-white transition-transform group-hover:translate-x-1 -ml-5 sm:-ml-7 pointer-events-none">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center">
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] relative">
            <div ref={lottieContainerRef} className="w-full h-full" />
          </div>
        </div>
      </motion.div>

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
            className="fixed inset-0 bg-white z-50 overflow-y-scroll md:overflow-hidden"
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
    </section>
  );
};

export default WorkSection;
