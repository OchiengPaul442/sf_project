"use client";

import { Button } from "@/components/ui/button";
import { Space_Mono } from "next/font/google";
import Link from "next/link";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default function HeaderSection() {
  return (
    <section className="min-h-screen bg-white">
      {/* Navigation */}
      <nav>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center p-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-black text-xl font-normal tracking-tighter hover:opacity-70 transition-opacity"
          >
            sf.
          </Link>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-transparent"
            aria-label="Toggle Menu"
          >
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <h1 className={`${spaceMono.variable} font-mono text-center`}>
          <span className="block text-[#999999] text-5xl sm:text-6xl md:text-7xl mb-2 font-normal">
            We&apos;re
          </span>
          <span className="block text-black text-6xl sm:text-7xl md:text-8xl font-bold tracking-[-0.02em]">
            Saving Food.
          </span>
        </h1>
      </div>
    </section>
  );
}
