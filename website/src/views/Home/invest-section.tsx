"use client";

import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import ContactUsForm from "@/components/forms/Contact-Us-Form";
import AngelAnimation from "@/public/lottie/angel.json";

const InvestSection: React.FC<any> = () => {
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lottieContainerRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: AngelAnimation,
      });

      // Set animation speed
      animation.setSpeed(1.2);

      return () => {
        animation.destroy();
      };
    }
  }, []);

  return (
    <section
      id="invest"
      className="h-screen bg-white text-black flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto flex flex-col items-center justify-between h-full max-w-4xl">
        <div className="text-center space-y-4 w-full mb-8 sm:mb-12">
          <h2 className="text-[#999999] text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal">
            Participate in our seed round
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight">
            Invitation to potential investors to participate.
          </h3>
        </div>

        <div className="flex justify-center w-full -my-16">
          <div className="w-[200px] h-[200px] lg:w-[300px] lg:h-[300px]">
            <div
              ref={lottieContainerRef}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="w-full">
          <ContactUsForm />
        </div>
      </div>
    </section>
  );
};

InvestSection.displayName = "InvestSection";
export default InvestSection;
