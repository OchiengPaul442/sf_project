"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Code2, Store, Wallet } from "lucide-react";
import { EngineerForm } from "./engineer-form";
import { RestaurantForm } from "./restaurant-form";
import { InvestorForm } from "./investor-form";
import AngelAnimation from "@/public/lottie/angel.json";

type FormType = "engineer" | "restaurant" | "investor";

const formOptions = [
  {
    type: "engineer",
    title: "I'm an Engineer",
    description:
      "Join our team and help build the future of restaurant management",
    icon: Code2,
  },
  {
    type: "restaurant",
    title: "I'm a Restaurant Owner",
    description:
      "Transform your restaurant operations with our innovative solutions",
    icon: Store,
  },
  {
    type: "investor",
    title: "I'm an Investor",
    description: "Partner with us in revolutionizing the restaurant industry",
    icon: Wallet,
  },
];

const pageTransition = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const ContactForm = memo(function ContactForm() {
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const angelContainerRef = useRef<HTMLDivElement>(null);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  useEffect(() => {
    let animation: any = null;
    if (
      selectedForm === "investor" &&
      angelContainerRef.current &&
      typeof window !== "undefined"
    ) {
      // Dynamically import lottie-web and cast to any before calling loadAnimation
      import("lottie-web").then((lottie) => {
        animation = (lottie as any).loadAnimation({
          container: angelContainerRef.current,
          renderer: "canvas",
          loop: true,
          autoplay: true,
          animationData: AngelAnimation,
        });
        animation.addEventListener("DOMLoaded", () => {
          setIsAnimationReady(true);
        });
      });
    } else {
      setIsAnimationReady(false);
    }

    return () => {
      if (animation) {
        animation.destroy();
        setIsAnimationReady(false);
      }
    };
  }, [selectedForm]);

  const isInvestorSelected = selectedForm === "investor";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4"
      style={{ transform: "translateZ(0)" }}
    >
      <motion.div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-2rem)] md:max-h-[800px]">
          {/* Left Panel */}
          <motion.div
            className={`md:w-1/3 relative transition-all duration-500 ease-in-out ${
              isInvestorSelected ? "bg-white" : "bg-black text-white"
            }`}
            layout
          >
            {/* Animation Container (only shown for investor) */}
            <AnimatePresence mode="wait">
              {isInvestorSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isAnimationReady ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 md:flex hidden items-center justify-center"
                >
                  <div
                    ref={angelContainerRef}
                    className="w-full h-full max-w-[280px] mx-auto"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left Panel Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
              <AnimatePresence mode="wait">
                {!isInvestorSelected && (
                  <motion.div
                    key="default-content"
                    className="space-y-4"
                    variants={pageTransition}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold">
                      How can we help?
                    </h2>
                    <p className="text-gray-400">
                      Choose your path and let us guide you through the next
                      steps
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="relative"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!selectedForm ? (
                  <p
                    className={
                      isInvestorSelected ? "text-gray-600" : "text-gray-400"
                    }
                  >
                    Select an option to get started
                  </p>
                ) : (
                  <motion.button
                    onClick={() => setSelectedForm(null)}
                    className={`text-sm font-medium inline-flex items-center transition-all px-4 py-2 rounded-lg ${
                      isInvestorSelected
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to options
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            className={`md:w-2/3 transition-all duration-500 ease-in-out ${
              isInvestorSelected ? "md:bg-black" : "bg-white"
            }`}
            layout
          >
            <div
              className="h-full overflow-y-auto custom-scrollbar"
              style={{
                WebkitOverflowScrolling: "touch",
                transform: "translateZ(0)",
              }}
            >
              <AnimatePresence mode="wait">
                {!selectedForm ? (
                  <motion.div
                    key="form-selection"
                    variants={pageTransition}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 p-6 md:p-8"
                  >
                    <div className="grid gap-4 md:gap-6">
                      {formOptions.map((option) => (
                        <motion.button
                          key={option.type}
                          onClick={() =>
                            setSelectedForm(option.type as FormType)
                          }
                          className="w-full group relative p-6 text-left rounded-xl border-2 border-gray-200 hover:border-green-600 bg-white transition-all duration-300 overflow-visible"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative z-10 space-y-4">
                            <option.icon className="w-8 h-8 text-green-600" />
                            <div>
                              <h3 className="text-xl font-semibold mb-2">
                                {option.title}
                              </h3>
                              <p className="text-gray-600">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedForm}
                    variants={pageTransition}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar"
                    style={{
                      WebkitOverflowScrolling: "touch",
                      transform: "translateZ(0)",
                    }}
                  >
                    {selectedForm === "engineer" && <EngineerForm />}
                    {selectedForm === "restaurant" && <RestaurantForm />}
                    {selectedForm === "investor" && <InvestorForm />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});

export default ContactForm;
