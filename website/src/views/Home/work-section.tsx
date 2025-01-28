"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import lottie from "lottie-web";
import { useDispatch } from "react-redux";
import { setModalOpen } from "@/redux-store/slices/uiSlice";
import Image from "next/image";
import BuildSvgImage from "@/public/build.svg";
import ConstructionAnimation from "@/public/lottie/contruction.json";
import { ContactForm } from "@/components/forms/contact-form";
import { isMobileDevice } from "@/utils/deviceDetection";

const WorkSection: React.FC<any> = () => {
  const isMobile = isMobileDevice();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (lottieContainerRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: ConstructionAnimation,
      });

      // Set animation speed
      animation.setSpeed(1.2);

      return () => {
        animation.destroy();
      };
    }
  }, []);

  useEffect(() => {
    dispatch(setModalOpen(isFormOpen));
    document.body.style.overflow = isFormOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
      dispatch(setModalOpen(false));
    };
  }, [isFormOpen, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFormOpen) {
        setIsFormOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

  return (
    <section
      id="contact"
      className="h-screen bg-[#f5f5f5] text-black relative overflow-hidden flex items-center justify-center"
    >
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full relative"
        animate={{
          x: isFormOpen ? "-15%" : "0%",
          scale: isFormOpen ? 0.95 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="text-center space-y-6 lg:space-y-8 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal">
            Work with us
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-[-0.02em] leading-[1.1]">
            Are you an engineer who&apos;s excited about our{" "}
            <span className="block sm:inline">mission?</span>
          </h3>
        </div>

        <div className="mt-12 lg:mt-16">
          <button
            onClick={() => setIsFormOpen(true)}
            className="group inline-flex items-center font-bold relative text-sm sm:text-base"
          >
            <span className="relative z-10 mr-2 px-6 font-semibold sm:px-8 py-3 bg-[#e6e6e6] rounded-full transition-colors group-hover:bg-[#d9d9d9]">
              Reach out
            </span>
            <span className="relative z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full text-white transition-transform group-hover:translate-x-1 -ml-5 sm:-ml-7">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          </button>
        </div>

        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-4 sm:right-8 md:right-12 lg:right-16 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] xl:w-[300px] xl:h-[300px] pointer-events-none animate-float">
          {isMobile ? (
            <Image src={BuildSvgImage} alt="Build" />
          ) : (
            <div
              ref={lottieContainerRef}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className="fixed inset-0 bg-white z-50 overflow-hidden"
          >
            <div className="relative h-full">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute right-4 top-4 p-2 bg-gray-100 text-green-600 md:hover:bg-gray-100 md:hover:text-green-600 rounded-full transition-colors z-50"
                aria-label="Close Contact Form"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="h-full overflow-y-auto">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

WorkSection.displayName = "WorkSection";
export default WorkSection;
