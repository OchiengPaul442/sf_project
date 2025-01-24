"use client";

import InvestForm from "@/components/forms/InvestForm";
import { useEffect, useRef, lazy } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamically import the Lottie component for better performance
const Lottie = lazy(() => import("lottie-react"));

// Import the Lottie animation JSON
import AngelAnimation from "@/public/lottie/angel.json";

export default function InvestSection() {
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
      id="invest"
      className="h-dvh bg-white text-black flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
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
            <Lottie
              animationData={AngelAnimation}
              loop
              autoplay
              lottieRef={lottieRef} // Attach the ref here
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="w-full">
          <InvestForm />
        </div>
      </div>
    </section>
  );
}
