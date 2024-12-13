"use client";

import { Button } from "@/components/ui/button";
import { PiArrowULeftUp } from "react-icons/pi";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useMemo } from "react";

export default function FooterSection() {
  const { width } = useWindowSize();

  const fontSize = useMemo(() => {
    if (!width) return "100px"; // Default size
    if (width < 640) return `${width / 7}px`; // Smaller screens
    if (width < 768) return `${width / 7}px`; // Small to medium screens
    if (width < 1024) return `${width / 6.5}px`; // Medium to large screens
    return `${width / 9.4}px`; // Large screens
  }, [width]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black min-h-screen flex flex-col items-center justify-center text-white relative">
      <div className="max-w-7xl mx-auto relative px-6 py-24 sm:p-24 sm:mx-6 lg:mx-8 mb-4 sm:mb-6 lg:mb-8">
        {/* Back to Top Button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Button
            onClick={scrollToTop}
            className="w-16 h-16 rounded-full bg-white hover:bg-white/90 transition-colors"
            aria-label="Back to top"
          >
            <PiArrowULeftUp className="text-7xl text-black" />
          </Button>
        </div>

        {/* Main Text */}
      </div>
      <div className="pt-16 sm:pt-24 max-w-7xl mx-auto absolute bottom-0 left-0 right-0">
        <div className="space-y-2 px-2">
          <div className="flex items-center lg:ml-6 lg:mr-9 justify-between">
            <p className="text-white/80 text-2xl sm:text-3xl md:text-4xl font-mono">
              We&apos;re
            </p>
            <p className="text-white/80 font-mono text-sm sm:text-base">
              © 2024
            </p>
          </div>
          <h2
            style={{ fontSize }}
            className="text-white font-mono tracking-tight whitespace-nowrap overflow-hidden"
          >
            Saving Food.
          </h2>
        </div>
      </div>
    </footer>
  );
}
