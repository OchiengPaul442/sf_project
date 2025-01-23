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
        <motion.button
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 md:bottom-8 md:right-8 bg-white text-black border border-black rounded-full p-2 sm:p-3 shadow-lg z-50 transition-colors hover:bg-black hover:text-white"
          onClick={onClick}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              y: {
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
          exit={{ opacity: 0, y: 10 }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default NextButton;
