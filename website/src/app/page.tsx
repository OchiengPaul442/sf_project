"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeaderSection from "@/components/landingPage/header-section";
import HowSection from "@/components/landingPage/how-section";
import WorkSection from "@/components/landingPage/work-section";
import InvestSection from "@/components/landingPage/invest-section";
import FooterSection from "@/components/landingPage/footer-section";
import { HowSectionCarousel } from "@/components/carousels/how-section-carousel";

const Loader = dynamic(() => import("@/components/loader"), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);

  // Check if running in the browser
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  // Simulate loading logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isBrowser || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader />
      </div>
    );
  }

  return (
    <main>
      <HeaderSection />
      <section id="solutions">
        <HowSection />
      </section>
      <section className="min-h-screen bg-black flex flex-col justify-center items-center">
        <HowSectionCarousel />
      </section>
      <section id="contact">
        <WorkSection />
      </section>
      <section id="invest">
        <InvestSection />
      </section>
      <FooterSection />
    </main>
  );
}
