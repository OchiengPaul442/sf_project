"use client";
import { useState } from "react";
import MenuModal from "@/components/dialog/menu-modal";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center p-8">
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

      {/* Futuristic Modal */}
      <MenuModal isOpen={isMenuOpen} onClose={toggleMenu} />
    </>
  );
}
