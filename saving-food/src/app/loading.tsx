"use client";
import { FC } from "react";
import Lottie from "lottie-react";
import animationData from "@public/animations/loader.json";

const Loading: FC = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Lottie
        animationData={animationData}
        loop
        className="w-32 h-32 md:w-48 md:h-48"
      />
    </div>
  );
};

export default Loading;
