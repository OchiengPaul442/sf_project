"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
// import Lottie from "lottie-react";
import Image from "next/image";
import Ship from "@/public/images/Ship.png";
import Integrity from "@/public/images/Group 2.png";
import Tight from "@/public/images/Group 3.png";
import Recipe from "@/public/images/Group 4.png";
import Fraud from "@/public/images/Group 5.png";

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
    animationData: Ship,
  },
  "data-integrity": {
    animationData: Integrity,
  },
  "managed-consumables": {
    animationData: Tight,
  },
  "recipe-adherence": {
    animationData: Recipe,
  },
  "fraud-eliminated": {
    animationData: Fraud,
  },
};

export const HowSectionCarousel = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
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
                  {/* <Lottie
                        animationData={
                          placeholderAnimations[step.id]?.animationData ||
                          placeholderAnimations["smooth-onboarding"]
                            .animationData
                        }
                        loop={true}
                        autoplay={true}
                        style={{ width: "100%", height: "100%" }}
                      /> */}
                  <Image
                    src={
                      placeholderAnimations[step.id]?.animationData ||
                      placeholderAnimations["smooth-onboarding"].animationData
                    }
                    alt="placeholder"
                    className="w-full h-full object-contain"
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
  );
};
