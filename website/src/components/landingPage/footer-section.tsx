"use client";

import { Space_Mono } from "next/font/google";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`${spaceMono.variable} bg-black rounded-[40px] relative px-6 py-24 sm:p-24 mx-4 sm:mx-6 lg:mx-8 mb-4 sm:mb-6 lg:mb-8`}
    >
      <div className="max-w-[1440px] mx-auto relative">
        {/* Copyright */}
        <div className="absolute top-0 right-0">
          <p className="text-white/80 font-mono text-sm sm:text-base">© 2024</p>
        </div>

        {/* Back to Top Button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Button
            onClick={scrollToTop}
            className="w-16 h-16 rounded-full bg-white hover:bg-white/90 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6 text-black" />
          </Button>
        </div>

        {/* Main Text */}
        <div className="pt-16 sm:pt-24">
          <div className="space-y-2">
            <p className="text-white/80 text-2xl sm:text-3xl md:text-4xl font-mono">
              We&apos;re
            </p>
            <h2 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-mono tracking-tight">
              Saving Food.
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
}
