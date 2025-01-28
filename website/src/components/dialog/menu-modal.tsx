"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, ChefHat, ArrowUpRight } from "lucide-react";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: { id: string }[];
  scrollToSection: (index: number) => void;
}

const menuItems = [
  { title: "HOME", id: "home" },
  { title: "SOLUTIONS", id: "solutions" },
  { title: "WORK", id: "work" },
];

export default function MenuModal({
  isOpen,
  onClose,
  sections,
  scrollToSection,
}: MenuModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const handleLinkClick = (id: string) => {
    onClose();
    setTimeout(() => {
      const index = sections.findIndex((section) => section.id === id);
      if (index !== -1) {
        scrollToSection(index);
      }
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-[1000] bg-black/95 text-white overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <div className="container mx-auto px-4 sm:px-6 py-12 min-h-screen flex flex-col relative">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h1 className="text-2xl font-bold text-green-400">
                  SavingFood.ai
                </h1>
              </motion.div>
              <button
                onClick={onClose}
                className="text-white hover:text-green-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-grow grid md:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-16">
              <div className="space-y-8 md:space-y-12">
                <nav>
                  <motion.h2
                    className="text-sm text-green-400 mb-6 md:mb-8 uppercase tracking-wider"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Menu
                  </motion.h2>
                  <ul className="space-y-4 md:space-y-6">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      >
                        <button
                          type="button"
                          onClick={() => handleLinkClick(item.id)}
                          className="text-2xl md:text-4xl font-bold hover:text-green-400 transition-colors flex items-center group"
                        >
                          {item.title}
                          <motion.div
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ x: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <ArrowUpRight className="h-4 w-4 md:h-6 md:w-6" />
                          </motion.div>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="space-y-8 md:space-y-12">
                <motion.div
                  className="space-y-6 md:space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h2 className="text-sm text-green-400 uppercase tracking-wider mb-4">
                    How We Help
                  </h2>
                  <div className="space-y-4 md:space-y-6">
                    <motion.div
                      className="flex gap-4 items-start p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Leaf className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-300">
                        Building a platform that empowers restaurants to cut
                        food waste, protect their bottom line, and impact global
                        sustainability.
                      </p>
                    </motion.div>
                    <motion.div
                      className="flex gap-4 items-start p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <ChefHat className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-300">
                        Our team blends more than a decade of Food and AI
                        experience, letting you focus on creating while we
                        handle the rest.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 md:mt-12 pt-6 border-t border-gray-800"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} SavingFood.ai. All rights
                  reserved.
                </p>
                <div className="flex gap-6">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    X
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </motion.footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
