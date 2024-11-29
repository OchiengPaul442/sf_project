"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export const WorkWithUs = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
      transition={{ duration: 0.8, delay: 1.0 }}
      className="w-full flex justify-center h-screen items-center pt-20 container mx-auto px-8"
    >
      <div className="bg-[#F5F5F5] rounded-3xl px-8 py-12 text-center">
        {/* Top Heading */}
        <h2 className="text-[36px] font-normal text-gray-600 tracking-wide mb-4">
          Work with us
        </h2>

        {/* Main Question */}
        <h1 className="text-4xl md:text-[96px] font-semibold text-black leading-[96px] mb-8">
          Are you’re an engineer <br />
          who’s excited about our mission?
        </h1>

        {/* Button */}
        <div className="flex justify-center items-center">
          <motion.button
            className="flex items-center gap-4 px-6 py-2 w-[140px] bg-gray-300 rounded-full relative shadow-md"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="text-lg text-black font-medium">Reach out</span>
            <motion.div
              className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full absolute -right-4"
              animate={{
                x: isHovering ? 10 : 0,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              →
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
