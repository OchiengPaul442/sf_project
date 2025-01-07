"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux-store/slices/menuSlice";

export function Nav() {
  const dispatch = useDispatch();

  const handleToggle = () => dispatch(toggleMenu());

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="container mx-auto flex justify-between items-center py-6 px-4">
          {/* Logo */}
          <Link
            href="/home"
            className="hover:opacity-70 transition-opacity top-6 relative"
          >
            <Image
              src="/images/logo.png"
              alt="We're Saving Food"
              width={85.13}
              height={90}
              loading="eager"
              className="w-auto h-auto"
            />
          </Link>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-transparent"
            aria-label="Toggle Menu"
            onClick={handleToggle}
          >
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
