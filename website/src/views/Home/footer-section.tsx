"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PiArrowULeftUp } from "react-icons/pi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const FooterSection = () => {
  const animation = useScrollAnimation();
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className="min-h-screen container mx-auto bg-black flex flex-col justify-end relative snap-start p-4 sm:p-6 md:p-8 lg:p-12"
      ref={animation.ref}
      style={animation.style}
    >
      {showButton && (
        <Button
          onClick={scrollToTop}
          className="absolute left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white hover:bg-white/90 transition-all flex items-center justify-center shadow-lg"
          aria-label="Back to top"
          style={{
            top: "clamp(20%, 40%, 60%)",
          }}
        >
          <PiArrowULeftUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black font-bold" />
        </Button>
      )}
      <div className="flex flex-row justify-between items-end w-full h-full gap-4 sm:gap-0">
        {/* Logo Section */}
        <div className="relative w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] h-auto">
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
        <div className="text-white/80 text-xs sm:text-sm md:text-base font-mono text-center sm:text-right">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
