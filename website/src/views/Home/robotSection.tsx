"use client";

import React from "react";
import Lottie from "lottie-react";
import ConstructionAnimation from "../../lib/lottie/robot.json";

const RobotSection = () => {
  return (
    <section className="relative h-screen bg-black flex flex-col overflow-hidden items-center justify-center py-24 snap-start">
      <div className="container mx-auto flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-white text-[2.75rem] md:text-[4.4rem] font-extralight tracking-[-0.02em] mb-16">
          with{" "}
          <span className="inline-block font-extrabold">
            AI<span className="text-white">...</span>
          </span>
        </h2>

        {/* Robot Animation Container */}
        <div className="w-full max-w-[400px] bg-black aspect-square relative">
          <Lottie
            animationData={ConstructionAnimation}
            loop={true}
            autoplay={true}
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
