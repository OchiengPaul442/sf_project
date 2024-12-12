"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { GradientSeparator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";

interface Step {
  id: string;
  title: string;
}

const STEPS: Step[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding" },
  { id: "data-integrity", title: "Data Integrity" },
  { id: "managed-consumables", title: "Tightly Managed Consumables" },
  { id: "recipe-adherence", title: "Recipe Adherence" },
  { id: "fraud-eliminated", title: "Fraud eliminated" },
];

const placeholderAnimations: Record<string, any> = {
  "smooth-onboarding": {
    animationData: {
      v: "5.5.7",
      fr: 30,
      ip: 0,
      op: 60,
      w: 400,
      h: 400,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Shape Layer 1",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [200, 200, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [100, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
    },
  },
  "data-integrity": {
    animationData: {
      v: "5.5.7",
      fr: 30,
      ip: 0,
      op: 60,
      w: 400,
      h: 400,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Shape Layer 1",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [200, 200, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [100, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
    },
  },
  "managed-consumables": {
    animationData: {
      v: "5.5.7",
      fr: 30,
      ip: 0,
      op: 60,
      w: 400,
      h: 400,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Shape Layer 1",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [200, 200, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [100, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
    },
  },
  "recipe-adherence": {
    animationData: {
      v: "5.5.7",
      fr: 30,
      ip: 0,
      op: 60,
      w: 400,
      h: 400,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Shape Layer 1",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [200, 200, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [100, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
    },
  },
  "fraud-eliminated": {
    animationData: {
      v: "5.5.7",
      fr: 30,
      ip: 0,
      op: 60,
      w: 400,
      h: 400,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "Shape Layer 1",
          sr: 1,
          ks: {
            o: { a: 0, k: 100, ix: 11 },
            r: { a: 0, k: 0, ix: 10 },
            p: { a: 0, k: [200, 200, 0], ix: 2 },
            a: { a: 0, k: [0, 0, 0], ix: 1 },
            s: { a: 0, k: [100, 100, 100], ix: 6 },
          },
          ao: 0,
          shapes: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [100, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path 1",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
          bm: 0,
        },
      ],
    },
  },
};

export default function HowSection() {
  const [selectedStep, setSelectedStep] = useState<string>(STEPS[0].id);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedStep(STEPS[index].id);
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const handleStepClick = (stepId: string): void => {
    const stepIndex = STEPS.findIndex((step) => step.id === stepId);
    if (stepIndex > -1 && emblaApi) {
      emblaApi.scrollTo(stepIndex);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="absolute left-4 top-0 w-[1px] h-full bg-gradient-to-b from-white via-white to-transparent" />
            <div className="space-y-8 sm:space-y-12">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`relative pl-12 block transition-all duration-300 w-full text-left ${
                    selectedStep === step.id
                      ? "text-white text-lg sm:text-xl md:text-2xl"
                      : "text-zinc-500 hover:text-zinc-300 text-base sm:text-lg md:text-xl"
                  }`}
                >
                  <div
                    className={`absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-300 ${
                      selectedStep === step.id ? "bg-white" : "bg-transparent"
                    }`}
                  />
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[400px] flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-transparent hover:bg-transparent hover:border-white/20 transition-colors z-10"
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5 text-white/50 hover:text-white/70" />
            </Button>

            <div className="overflow-hidden mx-16" ref={emblaRef}>
              <div className="flex">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex-[0_0_100%] min-w-0">
                    <div className="aspect-square relative flex items-center justify-center">
                      <Lottie
                        animationData={
                          placeholderAnimations[step.id]?.animationData ||
                          placeholderAnimations["smooth-onboarding"]
                            .animationData
                        }
                        loop={true}
                        autoplay={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-transparent hover:bg-transparent hover:border-white/20 transition-colors z-10"
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5 text-white/50 hover:text-white/70" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
