"use client";

import Lottie from "lottie-react";
import RobotAnimation from "@/public/lottie/robot.json";
import React from "react";

const RobotSection: React.FC = () => {
  return (
    <section className="relative min-h-dvh snap-start bg-black flex flex-col items-center justify-center py-24 transition-opacity duration-1000 opacity-100">
      <div className="container mx-auto flex flex-col items-center">
        <h2 className="text-white text-2xl md:text-4xl font-extralight tracking-[-0.02em] mb-16">
          with{" "}
          <span className="inline-block font-extrabold">
            AI<span className="text-white">...</span>
          </span>
        </h2>
        <div className="w-full max-w-[400px] bg-black aspect-square relative">
          <Lottie
            animationData={RobotAnimation}
            loop
            autoplay
            style={{
              width: "100%",
              height: "100%",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default RobotSection;
