"use client";
import { motion } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";

export function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 z-50"
    >
      <motion.a
        href="/"
        className="text-2xl font-bold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        sf.
      </motion.a>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-2xl"
      >
        <RxHamburgerMenu />
        <span className="sr-only">Open menu</span>
      </motion.button>
    </motion.nav>
  );
}
