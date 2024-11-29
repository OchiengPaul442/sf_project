"use client";

import React from "react";
import { motion } from "framer-motion";

import { PiArrowULeftUp } from "react-icons/pi";

const FooterSection = () => {
  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full min-h-[80vh] bg-black text-white flex flex-col items-center justify-between py-20">
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="flex items-center justify-center w-16 h-16 bg-white text-black rounded-full shadow-md hover:shadow-lg transition-all duration-300 mb-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <PiArrowULeftUp className="text-3xl" />
      </motion.button>

      {/* Footer Content */}
      <div className="w-full">
        <div className="flex flex-col">
          <div className="flex justify-between max-w-[1200px] mx-auto items-start w-full mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl font-mono font-light opacity-90"
            >
              We&apos;re
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl font-mono font-light opacity-90"
            >
              ©2024
            </motion.p>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[180px] xl:text-[200px] font-mono leading-none tracking-tight text-center mx-auto max-w-[90vw]"
          >
            Saving Food.
          </motion.h1>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
