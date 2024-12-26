"use client";

import { ArrowRight } from "lucide-react";
// import Lottie from "lottie-react";
import Link from "next/link";
import Image from "next/image";
import Work from "@/public/images/Layer 1.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Placeholder animation data
// const placeholderAnimation = {
//   v: "5.5.7",
//   fr: 30,
//   ip: 0,
//   op: 60,
//   w: 500,
//   h: 500,
//   assets: [],
//   layers: [
//     {
//       ddd: 0,
//       ind: 1,
//       ty: 4,
//       nm: "Tools",
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

export default function WorkSection() {
  const animation = useScrollAnimation();

  return (
    <section
      className="min-h-screen bg-[#f5f5f5] text-black relative overflow-hidden py-12 sm:py-16 md:py-24 snap-start"
      ref={animation.ref}
      style={animation.style}
      id="contact"
    >
      <div className="container mx-auto relative px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-mono">
            Work with us
          </h2>
          <h3 className="text-[24px] sm:text-[40px] md:text-[48px] lg:text-[64px] xl:text-[96px] font-bold tracking-[-0.02em] leading-[1.1] max-w-7xl">
            Are you an engineer who&apos;s excited about our <br /> mission?
          </h3>
        </div>

        <Link
          href="/contact"
          className="group inline-flex items-center font-bold relative text-sm sm:text-base"
        >
          <span className="relative z-10 px-6 font-bold sm:px-8 py-2 sm:py-3 bg-[#e6e6e6] rounded-full transition-colors group-hover:bg-[#d9d9d9]">
            Reach out
          </span>
          <span className="relative z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full text-white transition-transform group-hover:translate-x-1 -ml-5 sm:-ml-7">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </Link>

        <div className="absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] pointer-events-none">
          {/* <Lottie
            animationData={placeholderAnimation}
            loop={true}
            autoplay={true}
            style={{
              width: "100%",
              height: "100%",
              filter: "brightness(0)",
            }}
          /> */}

          <Image
            src={Work}
            alt="Work"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
