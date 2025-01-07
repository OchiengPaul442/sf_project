"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PiArrowULeftUp } from "react-icons/pi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FooterSection() {
  const animation = useScrollAnimation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="h-screen container mx-auto bg-black flex flex-col justify-end relative snap-start p-6 sm:p-8 md:p-12"
      ref={animation.ref}
      style={animation.style}
    >
      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white hover:bg-white/90 transition-all flex items-center justify-center shadow-lg"
        aria-label="Back to top"
        style={{
          top: "40%",
          left: "50%",
        }}
      >
        <PiArrowULeftUp className="w-6 h-6 sm:w-8 sm:h-8 text-black font-bold" />
      </Button>

      {/* Footer Content */}
      <div
        className="flex justify-between w-full h-full"
        style={{ alignItems: "end" }}
      >
        {/* Logo Section */}
        <div className="relative w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px] h-auto">
          <Image
            src="/images/logo-white.png"
            alt="We're Saving Food"
            width={400}
            height={400}
            priority={true}
            className="w-full h-auto"
          />
        </div>

        {/* Copyright Section */}
        <div className="text-white/80 text-sm sm:text-base font-mono text-right">
          © 2024
        </div>
      </div>
    </footer>
  );
}
