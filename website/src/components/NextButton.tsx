"use client";

import { motion, AnimatePresence } from "framer-motion";

const NextButton: React.FC<any> = ({ onClick }) => {
  const lineVariants = {
    initial: { scaleY: 0.3, opacity: 0.3 },
    animate: {
      scaleY: [0.3, 0.7, 0.3],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };
  return (
    <AnimatePresence>
      <button
        onClick={onClick}
        className="rounded-full border border-black z-10 bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center"
        style={{ width: "32px", height: "64px" }}
      >
        <motion.div
          className="w-[2px] h-6 bg-green-600 rounded-full -mt-4"
          variants={lineVariants}
          initial="initial"
          animate="animate"
        />
      </button>
    </AnimatePresence>
  );
};

export default NextButton;
