"use client";

import { motion, AnimatePresence } from "framer-motion";

interface NextButtonProps {
  onClick: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick }) => {
  return (
    <AnimatePresence>
      <button
        onClick={onClick}
        className="rounded-full border-2 border-black z-10 bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center"
        style={{ width: "32px", height: "64px" }}
      >
        <motion.div
          className="w-[3px] h-[10px] bg-black rounded-full -mt-4"
          animate={{
            height: ["10px", "20px", "10px"],
            transition: {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      </button>
    </AnimatePresence>
  );
};

export default NextButton;
