"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import InvestForm from "@/components/forms/InvestForm";
import AngelAnimation from "@/public/lottie/angel.json";
import Lottie from "lottie-react";

export default function InvestSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.6 });

  return (
    <section
      id="invest"
      ref={ref}
      className={`min-h-dvh bg-white text-black flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto flex flex-col items-center justify-between h-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center space-y-4 w-full mb-8 sm:mb-12">
          <h2 className="text-[#999999] text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal">
            Participate in our seed round
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">
            Invitation to potential investors to participate.
          </h3>
        </div>

        {/* Image Section */}
        <div className="flex justify-center w-full my-12">
          <div className="w-[200px] h-[200px] lg:w-[300px] lg:h-[300px]">
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
        <div className="w-full">
          <InvestForm />
        </div>
      </div>
    </section>
  );
}
