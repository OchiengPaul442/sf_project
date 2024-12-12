"use client";

import { Space_Mono } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Work from "@/public/images/Layer 2.png";
// import Lottie from "lottie-react";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

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
  return (
    <section
      className={`${spaceMono.variable} min-h-screen bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-[#999999] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono">
            Participate in our seed round
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mono tracking-tight">
            Invitation to potential investors to participate.
          </h3>
        </div>

        <div className="mt-12 sm:mt-16 mb-16 sm:mb-20 flex justify-center">
          <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px]">
            {/* <Lottie
              animationData={placeholderAnimation}
              loop={true}
              autoplay={true}
              style={{
                width: "100%",
                height: "100%",
              }}
            /> */}
            <Image
              src={Work}
              alt="Work"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <form className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm sm:text-base font-mono">
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter Full name"
                className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm sm:text-base font-mono">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm sm:text-base font-mono">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Message"
              className="min-h-[120px] sm:min-h-[160px] rounded-xl sm:rounded-2xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm sm:text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 sm:h-14 rounded-full bg-black hover:bg-black/90 font-mono text-sm sm:text-base"
          >
            Send
          </Button>
        </form>
      </div>
    </section>
  );
}
