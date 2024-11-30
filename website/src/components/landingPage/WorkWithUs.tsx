"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const WorkWithUs = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <section className="w-full min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full bg-white rounded-3xl px-4 py-10 lg:py-20 lg:px-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top Heading */}
        <motion.h2
          className="text-xl font-mono mb-6 text-black/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Work with us
        </motion.h2>

        {/* Main Question */}
        <motion.h1
          className="text-xl md:text-6xl lg:text-[72px] font-bold font-mono text-black leading-tight max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Are you&apos;re an engineer who&apos;s excited about our mission?
        </motion.h1>

        {/* Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="group relative flex items-center bg-[#E8E8E8] text-black rounded-full pl-6 pr-14 py-3 font-mono"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="text-base font-bold relative z-10">Reach out</span>
            <motion.div
              className="absolute -right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
              animate={{
                x: isHovering ? 5 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <motion.span
                animate={{
                  x: isHovering ? 2 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                →
              </motion.span>
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};
