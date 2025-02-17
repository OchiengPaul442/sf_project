"use client";

import React from "react";
import Image from "next/image";
import { PiArrowULeftUp } from "react-icons/pi";
import { motion } from "framer-motion";
import type { SectionProps } from "@/utils/types/section";
import { mainConfigs } from "@/utils/configs";

const FooterSection: React.FC<SectionProps> = ({ id, title, image }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id={id}
      className="snap-start w-full bg-transparent flex flex-col justify-end relative p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen"
    >
      <div className={`${mainConfigs.SECTION_CONTAINER_CLASS}`}>
        <motion.button
          onClick={scrollToTop}
          className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          style={{ top: "clamp(20%, 40%, 60%)" }}
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <PiArrowULeftUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600 font-bold" />
        </motion.button>

        <div className="flex flex-row justify-between items-end w-full h-full gap-4 sm:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] h-auto"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={title || "Footer Image"}
              width={400}
              height={400}
              priority
              className="w-full h-auto"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/80 text-xs sm:text-sm md:text-base font-mono text-center sm:text-right"
          >
            © {new Date().getFullYear()}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
