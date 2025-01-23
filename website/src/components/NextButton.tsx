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
          className="hidden bottom-8 right-8 bg-white text-black border border-black rounded-full p-3 shadow-lg z-50 transition-colors hover:bg-black hover:text-white"
          onClick={onClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default NextButton;
