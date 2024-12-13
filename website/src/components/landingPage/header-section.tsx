"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import MenuModal from "../dialog/menu-modal";

export default function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const COMMON_INPUT_RANGE = [0, 1];

  const textScale = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [1, 60]);
  const textOpacity = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [1, 1]);
  const backgroundOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  // x and y move to center on letter F in "Saving Food"
  const xMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%",
    "-850%",
  ]);
  const yMove = useTransform(scrollYProgress, COMMON_INPUT_RANGE, [
    "0%",
    "375%",
  ]);

  return (
    <motion.section ref={containerRef} className="relative min-h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: backgroundOpacity }}
        />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full z-10">
          <div className="max-w-[1800px] mx-auto flex justify-between items-center p-8">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity text-black dark:text-white"
            >
              sf.
            </Link>

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-transparent"
              aria-label="Toggle Menu"
              onClick={toggleMenu}
            >
              <span className="w-6 h-[2px] bg-black dark:bg-white" />
              <span className="w-6 h-[2px] bg-black dark:bg-white" />
              <span className="w-6 h-[2px] bg-black dark:bg-white" />
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="text-center">
          <h2 className="text-[#A8A8A8] text-2xl mb-2 font-mono">We&apos;re</h2>
          <motion.h1
            style={{
              scale: textScale,
              opacity: textOpacity,
              x: xMove,
              y: yMove,
              fontSize: "10vw",
              color: "#000000",
            }}
            className="text-6xl font-bold tracking-tight"
          >
            Saving Food.
          </motion.h1>
        </div>
      </div>

      {/* Futuristic Modal */}
      <MenuModal isOpen={isMenuOpen} onClose={toggleMenu} />
    </motion.section>
  );
}
