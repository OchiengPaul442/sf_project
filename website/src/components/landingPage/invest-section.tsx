"use client";

import Image from "next/image";
import Work from "@/public/images/Layer 2.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import InvestForm from "../forms/InvestForm";
// import Lottie from "lottie-react";

// Placeholder animation data for the angel illustration
// const placeholderAnimation = {
//   v: "5.5.7",
//   fr: 30,
//   ip: 0,
//   op: 60,
//   w: 400,
//   h: 400,
//   assets: [],
//   layers: [
//     {
//       ddd: 0,
//       ind: 1,
//       ty: 4,
//       nm: "Angel",
//       sr: 1,
//       ks: {
//         o: { a: 0, k: 100 },
//         r: { a: 0, k: 0 },
//         p: { a: 0, k: [200, 200, 0] },
//         a: { a: 0, k: [0, 0, 0] },
//         s: { a: 0, k: [100, 100, 100] },
//       },
//       ao: 0,
//       shapes: [],
//       ip: 0,
//       op: 60,
//       st: 0,
//       bm: 0,
//     },
//   ],
// };

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
        <div className="mt-8 sm:mt-12 mb-8 sm:mb-10 flex justify-center">
          <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]">
            {/* 
            <Lottie
              animationData={placeholderAnimation}
              loop={true}
              autoplay={true}
              style={{
                width: "100%",
                height: "100%",
              }}
            /> 
            */}
            <Image
              src={Work}
              alt="Work"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Form Section */}
        <InvestForm />
      </div>
    </section>
  );
}
