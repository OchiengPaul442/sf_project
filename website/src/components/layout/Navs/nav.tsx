"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { FaRocket, FaLightbulb, FaUserAstronaut } from "react-icons/fa";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center container mx-auto p-8 z-50"
      >
        <motion.a
          href="/"
          className="text-4xl font-bold text-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          sf.
        </motion.a>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-3xl text-black"
          onClick={toggleMenu}
        >
          <RxHamburgerMenu />
          <span className="sr-only">Open menu</span>
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-8 right-8 text-3xl text-white"
              onClick={toggleMenu}
            >
              <RxCross1 />
              <span className="sr-only">Close menu</span>
            </motion.button>

            <motion.ul className="space-y-8 text-center">
              {[
                { icon: FaRocket, text: "Mission" },
                { icon: FaLightbulb, text: "Innovation" },
                { icon: FaUserAstronaut, text: "Team" },
              ].map((item, index) => (
                <motion.li
                  key={item.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href="#"
                    className="text-white text-3xl flex items-center space-x-4 hover:text-blue-400 transition-colors duration-300"
                  >
                    <item.icon className="text-4xl" />
                    <span>{item.text}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-8 left-8 right-8 text-center text-white text-lg"
            >
              <p>Explore the future of food sustainability with us.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
