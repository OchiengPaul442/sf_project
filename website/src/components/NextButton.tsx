import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NextButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <button
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black border border-black rounded-full p-2 sm:p-3 shadow-lg z-10 transition-colors hover:bg-black hover:text-white"
          onClick={onClick}
        >
          <motion.div
            animate={{
              y: [0, -3, 0],
              transition: {
                y: {
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              },
            }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>
      )}
    </AnimatePresence>
  );
};

export default NextButton;
