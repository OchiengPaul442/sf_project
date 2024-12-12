"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import FuturisticModal from "../dialog/futuristic-modal";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <section className="min-h-screen bg-white">
      {/* Navigation */}
      <nav>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center p-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="text-black text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity"
            >
              sf.
            </Link>
          </motion.div>

          {/* Menu Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-transparent"
              aria-label="Toggle Menu"
              onClick={toggleMenu}
            >
              <span className="w-6 h-[2px] bg-black" />
              <span className="w-6 h-[2px] bg-black" />
              <span className="w-6 h-[2px] bg-black" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative bottom-12">
        <motion.h1
          className={`${spaceMono.variable} font-mono text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            className="block text-[#999999] text-5xl sm:text-6xl md:text-7xl mb-2 font-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We&apos;re
          </motion.span>
          <motion.span
            className="block text-black text-6xl sm:text-7xl md:text-8xl font-bold tracking-[-0.02em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Saving Food.
          </motion.span>
        </motion.h1>
      </div>

      {/* Futuristic Modal */}
      <FuturisticModal isOpen={isMenuOpen} onClose={toggleMenu} />
    </section>
  );
}
