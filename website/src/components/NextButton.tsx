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
          className="hidden fixed md:block bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 bg-white text-black border border-black rounded-full p-2 sm:p-3 shadow-lg z-50 transition-colors hover:bg-black hover:text-white"
          onClick={onClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default NextButton;
