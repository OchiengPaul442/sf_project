"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, lazy } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamically import the Lottie component
const Lottie = lazy(() => import("lottie-react"));

// Import the Lottie animation JSON
import ConstructionAnimation from "@/public/lottie/contruction.json";

export default function WorkSection() {
  // Create a ref with the correct type for lottie-react
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    // Once the component mounts, set the animation speed
    if (lottieRef.current?.animationItem) {
      lottieRef.current.animationItem.setSpeed(1.2);
    }
  }, []);

  return (
    <section
      id="contact"
      className="h-dvh bg-[#f5f5f5] text-black relative overflow-hidden flex items-center justify-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full relative">
        {/* Main Content */}
        <div className="text-center space-y-6 lg:space-y-8 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal">
            Work with us
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-[-0.02em] leading-[1.1]">
            Are you an engineer who&apos;s excited about our{" "}
            <span className="block sm:inline">mission?</span>
          </h3>
        </div>

        {/* CTA Button */}
        <div className="mt-12 lg:mt-16">
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
        </div>

        {/* Lottie Animation with Floating Effect */}
        <div
          className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-4 sm:right-8 md:right-12 lg:right-16 
                     w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] 
                     lg:w-[260px] lg:h-[260px] xl:w-[300px] xl:h-[300px] 
                     pointer-events-none animate-float 
                     will-change-transform opacity-100"
        >
          <Lottie
            animationData={ConstructionAnimation}
            loop
            autoplay
            lottieRef={lottieRef} // Attach the ref here
            style={{
              filter: "brightness(1)", // Adjusted to normal brightness
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
