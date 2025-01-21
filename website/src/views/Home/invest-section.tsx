"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import InvestForm from "@/components/forms/InvestForm";
import AngelAnimation from "@/public/lottie/angel.json";
import Lottie from "lottie-react";

export default function InvestSection() {
  const animation = useScrollAnimation();

  return (
    <section
      id="invest"
      ref={animation.ref}
      style={animation.style}
      className="min-h-screen bg-white text-black flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 snap-start"
    >
      <div className="container mx-auto flex flex-col items-center space-y-6 sm:space-y-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center space-y-4 w-full">
          <h2 className="text-[#999999] text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal">
            Participate in our seed round
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">
            Invitation to potential investors to participate.
          </h3>
        </div>

        {/* Image Section */}
        <div className="flex justify-center w-full">
          <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[400px] lg:h-[400px] -my-16">
            <Lottie
              animationData={AngelAnimation}
              loop={true}
              autoplay={true}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Form Section */}
        <InvestForm />
      </div>
    </section>
  );
}
