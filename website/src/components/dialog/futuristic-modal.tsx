"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FuturisticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = ["Home", "About", "Services", "Contact"];

export default function FuturisticModal({
  isOpen,
  onClose,
}: FuturisticModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-10 rounded-3xl p-12 w-full max-w-3xl relative overflow-hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-gray-200"
              onClick={onClose}
            >
              <X className="h-8 w-8" />
            </Button>
            <nav>
              <ul className="space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a
                        href="#"
                        className="text-4xl font-bold text-white hover:text-gray-200 transition-colors flex items-center"
                      >
                        <span className="mr-4 text-2xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </a>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
