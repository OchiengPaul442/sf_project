"use client";

import { GradientSeparator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HowSection() {
  const animation = useScrollAnimation();

  return (
    <section
      ref={animation.ref}
      style={animation.style}
      id="solutions"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black min-h-screen overflow-hidden transition-colors duration-1000 ease-in-out snap-start"
    >
      <div className="container mx-auto space-y-24">
        <div className="space-y-24">
          <div className="relative">
            <div className="relative z-10">
              {/* first part to animate */}
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-12 origin-left">
                <span className="text-zinc-500 font-normal">We&apos;re</span>
                <br />
                Saving Food.
              </h2>

              {/* second part to animate */}
              <div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-mono tracking-tight leading-relaxed max-w-4xl">
                  <span className="text-white">
                    By building a platform that empowers
                  </span>{" "}
                  <span className="text-zinc-500">
                    restaurants to cut food waste, protect their bottom line,
                    and have a meaningful, cumulative impact on global
                    sustainability.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="transform origin-center transition-transform duration-1000 ease-in-out">
            <GradientSeparator />
          </div>

          {/* first part to animate */}
          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl text-end font-mono leading-relaxed max-w-4xl ml-auto">
              <span className="text-white">
                Our team blends more than a decade of Food and AI
              </span>{" "}
              <span className="text-zinc-500">
                experience, in a packaged solution that lets you focus on
                creating while we handle the rest
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
