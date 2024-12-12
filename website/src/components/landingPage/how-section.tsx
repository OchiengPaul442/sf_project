import { GradientSeparator } from "@/components/ui/separator";
import { HowSectionCarousel } from "../carousels/how-section-carousel";

export default function HowSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        <div className="space-y-16">
          <div className="relative">
            {/* Large watermark question mark */}
            <div className="absolute -top-12 right-0 text-white/5 pointer-events-none">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-48 h-48"
                stroke="currentColor"
                strokeWidth="0.5"
              >
                <path
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Main content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl text-white font-mono mb-8">
                How?
              </h2>
              <p className="text-3xl md:text-4xl lg:text-5xl font-mono tracking-tight leading-relaxed max-w-4xl">
                <span className="text-white">
                  By building a platform that empowers
                </span>{" "}
                <span className="text-zinc-500">
                  restaurants to cut food waste, protect their bottom line, and
                  have a meaningful, cumulative impact on global sustainability.
                </span>
              </p>
            </div>
          </div>

          <GradientSeparator className="" />

          <p className="text-2xl md:text-3xl lg:text-4xl text-end font-mono leading-relaxed max-w-4xl ml-auto">
            <span className="text-white">
              Our team blends more than a decade of Food and AI
            </span>{" "}
            <span className="text-zinc-500">
              experience, in a packaged solution that lets you focus on creating
              while we handle the rest
            </span>
          </p>
        </div>

        <HowSectionCarousel />
      </div>
    </section>
  );
}
