"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ConstructionAnimation from "@/public/lottie/contruction.json";
import Lottie from "lottie-react";

export default function WorkSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 });

  return (
    <section
      ref={ref}
      className={`min-h-dvh bg-[#f5f5f5] text-black relative overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      id="contact"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center space-y-6 lg:space-y-8 mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal">
            Work with us
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-[-0.02em] leading-[1.1]">
            Are you an engineer who&apos;s excited about our{" "}
            <span className="block sm:inline">mission?</span>
          </h3>
        </div>

        <Link
          href="mailto:support@example.com"
          className="group inline-flex items-center font-bold relative text-sm sm:text-base"
        >
          <span className="relative z-10 mr-2 px-6 font-semibold sm:px-8 py-3 bg-[#e6e6e6] rounded-full transition-colors group-hover:bg-[#d9d9d9]">
            Reach out
          </span>
          <span className="relative z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full text-white transition-transform group-hover:translate-x-1 -ml-5 sm:-ml-7">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </Link>

        <div className="absolute bottom-0 right-0 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] aspect-square pointer-events-none">
          <Lottie
            animationData={ConstructionAnimation}
            loop={true}
            autoplay={true}
            style={{
              width: "100%",
              height: "100%",
              filter: "brightness(0)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
