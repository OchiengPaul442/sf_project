"use client";

import imageUrls from "@/utils/Images_Json_Urls";
import Image from "next/image";
import { PiArrowULeftUp } from "react-icons/pi";

interface FooterSectionProps {
  scrollToTop: () => void;
}

export default function FooterSection({ scrollToTop }: FooterSectionProps) {
  return (
    <footer className="h-dvh container mx-auto bg-transparent flex flex-col justify-end relative p-4 sm:p-6 md:p-8 lg:p-12">
      <button
        onClick={scrollToTop}
        className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-lg"
        style={{ top: "clamp(20%, 40%, 60%)" }}
      >
        <PiArrowULeftUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black font-bold" />
      </button>

      <div className="flex flex-row justify-between items-end w-full h-full gap-4 sm:gap-0">
        <div className="relative w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] h-auto">
          <Image
            src={imageUrls.footerImage}
            alt="We're Saving Food"
            width={400}
            height={400}
            priority
            className="w-full h-auto"
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
          />
        </div>
        <div className="text-white/80 text-xs sm:text-sm md:text-base font-mono text-center sm:text-right">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
