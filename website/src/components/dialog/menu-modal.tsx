"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Leaf,
  ChefHat,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: { id: string }[];
  scrollToSection: (index: number) => void;
}

const menuItems = [
  { title: "HOME", id: "home" },
  { title: "PLATFORM", id: "platform" },
  { title: "SOLUTIONS", id: "solutions" },
  { title: "WORK", id: "work" },
  { title: "INVEST", id: "invest" },
];

const latestUpdates = [
  { title: "Reducing Restaurant Food Waste", author: "SUSTAINABILITY TEAM" },
  { title: "AI in Modern Kitchen Management", author: "TECH INSIGHTS" },
];

export default function MenuModal({
  isOpen,
  onClose,
  sections,
  scrollToSection,
}: MenuModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
          className="fixed inset-0 z-[1000] bg-black text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 overflow-y-auto">
            <div className="container mx-auto px-6 py-12 min-h-screen">
              <div className="flex justify-between items-start">
                <div></div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
                {/* Main Menu */}
                <div className="space-y-8">
                  <h2 className="text-sm text-gray-400 mb-8">MENU</h2>
                  <nav>
                    <ul className="space-y-6">
                      {menuItems.map((item, index) => (
                        <motion.li
                          key={item.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <button
                            onClick={() => handleLinkClick(item.id)}
                            className="text-3xl font-bold hover:text-blue-400 transition-colors flex items-center group"
                          >
                            {item.title}
                            <ArrowUpRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Mission */}
                <div className="space-y-8">
                  <h2 className="text-sm text-gray-400 mb-8">HOW WE HELP</h2>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      <Leaf className="h-6 w-6 text-blue-500 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Building a platform that empowers restaurants to cut
                        food waste, protect their bottom line, and impact global
                        sustainability.
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-4"
                    >
                      <ChefHat className="h-6 w-6 text-blue-300 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Our team blends more than a decade of Food and AI
                        experience, letting you focus on creating while we
                        handle the rest.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Latest Updates */}
                <div className="space-y-8">
                  <h2 className="text-sm text-gray-400 mb-8">LATEST UPDATES</h2>
                  <div className="space-y-8">
                    {latestUpdates.map((update, index) => (
                      <motion.article
                        key={update.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="space-y-2"
                      >
                        <h3 className="text-lg font-medium hover:text-blue-400 transition-colors cursor-pointer">
                          {update.title}
                        </h3>
                        <p className="text-sm text-gray-400">{update.author}</p>
                      </motion.article>
                    ))}
                    <motion.a
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      href="#"
                      onClick={onClose}
                      className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      More Updates
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-24 pt-12 border-t border-gray-800"
              >
                <div className="flex flex-row justify-between items-start gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-200" />
                      <span className="text-sm">Get in touch</span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <a
                      href="#"
                      onClick={onClose}
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      X
                    </a>
                    <a
                      href="#"
                      onClick={onClose}
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      onClick={onClose}
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </motion.footer>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
