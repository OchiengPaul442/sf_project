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

const WorkSection: React.FC = () => {
  const isMobile = isMobileDevice();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (lottieContainerRef.current && !isMobile) {
      const animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: ConstructionAnimation,
      });

      animation.setSpeed(1.2);

      return () => {
        animation.destroy();
      };
    }
  }, [isMobile]);

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
      className="min-h-screen bg-[#f5f5f5] text-black relative md:overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="container mx-auto flex flex-col lg:flex-row items-center justify-between h-full relative"
        animate={{
          x: isFormOpen ? "-5%" : "0%",
          scale: isFormOpen ? 0.98 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="text-center lg:text-left space-y-6 lg:space-y-8 max-w-3xl mx-auto lg:mx-0 mb-12 lg:mb-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal">
            Work with us
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] leading-[1.1]">
            Are you an engineer who&apos;s excited about our{" "}
            <span className="block sm:inline">mission?</span>
          </h3>
          <div className="mt-8 lg:mt-12">
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
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center">
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] relative animate-float">
            {isMobile ? (
              <Image
                src={BuildSvgImage || "/placeholder.svg"}
                alt="Build"
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <div ref={lottieContainerRef} className="w-full h-full" />
            )}
          </div>
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
                className="absolute right-4 top-4 p-2 bg-gray-100 text-green-600 hover:bg-gray-200 hover:text-green-700 rounded-full transition-colors z-50"
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

export default WorkSection;
