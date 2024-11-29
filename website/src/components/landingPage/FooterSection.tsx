"use client";

import React from "react";
import { PiArrowULeftUp } from "react-icons/pi";

interface FooterSectionProps {
  scrollToTop: () => void;
}

const FooterSection: React.FC<FooterSectionProps> = ({ scrollToTop }) => (
  <footer className="relative w-full h-screen bg-black text-white flex flex-col justify-center items-center container mx-auto">
    {/* Back to Top Button */}
    <button
      onClick={scrollToTop}
      className="flex items-center justify-center w-16 h-16 bg-white text-black rounded-full shadow-md hover:shadow-lg transition-all duration-300 mb-8"
    >
      <PiArrowULeftUp className="text-3xl" />
    </button>

    {/* Footer Content */}
    <div className="w-full max-w-6xl px-8 text-center mt-44">
      <div className="flex justify-between items-center px-8 mb-6">
        {/* Left Text */}
        <p className="text-lg font-light">We’re</p>

        {/* Right Text */}
        <p className="text-lg font-light">© 2024</p>
      </div>

      {/* Center Text */}
      <h1 className="text-8xl md:text-[180px] font-bold leading-none tracking-tight">
        Saving Food.
      </h1>
    </div>
  </footer>
);

export default FooterSection;
