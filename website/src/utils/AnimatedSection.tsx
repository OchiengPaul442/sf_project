import { motion } from "framer-motion";

interface AnimatedSectionProps {
  index: number;
  isActive: boolean;
  children: React.ReactNode;
  total: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  index,
  isActive,
  children,
  total,
}) => {
  const variants = {
    initial: {
      y: "100%",
      opacity: 0,
      zIndex: index,
    },
    enter: {
      y: "0%",
      opacity: 1,
      zIndex: total - index,
      transition: {
        duration: 0.6,
        ease: "easeInOut", // Custom easing for smoother animation
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      zIndex: index,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-screen overflow-hidden"
      initial="initial"
      animate={isActive ? "enter" : "exit"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
