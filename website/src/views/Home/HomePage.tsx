"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeaderSection from "@/views/Home/header-section";
import HowSection from "@/views/Home/how-section";
import WorkSection from "@/views/Home/work-section";
import InvestSection from "@/views/Home/invest-section";
import FooterSection from "@/views/Home/footer-section";
import { HowSectionCarousel } from "@/components/carousels/how-section-carousel";

const Loader = dynamic(() => import("@/views/loader"), { ssr: false });

export default function HomePage() {
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
    return <Loader />;
  }

  return (
    <main>
      <HeaderSection />
      <HowSection />
      <HowSectionCarousel />
      <WorkSection />
      <InvestSection />
      <FooterSection />
    </main>
  );
}
