"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import InvestForm from "../../components/forms/InvestForm";
import Lottie from "lottie-react";
import AngelAnimation from "@/lib/lottie/angel.json";

export default function InvestSection() {
  const animation = useScrollAnimation();

  return (
    <section
      id="invest"
      ref={animation.ref}
      style={animation.style}
      className="h-screen bg-white text-black flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 snap-start"
    >
      <div className="container mx-auto flex flex-col items-center space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-[#999999] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono">
            Participate in our seed round
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mono tracking-tight">
            Invitation to potential investors to participate.
          </h3>
        </div>

        {/* Image Section */}
        <div className="mt-8 mb-8 flex justify-center">
          <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[350px] md:h-[350px]">
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
