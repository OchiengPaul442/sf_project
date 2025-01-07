"use client";

import HeaderSection from "@/views/Home/header-section";
import HowSection from "@/views/Home/how-section";
import WorkSection from "@/views/Home/work-section";
import InvestSection from "@/views/Home/invest-section";
import FooterSection from "@/views/Home/footer-section";
import { HowSectionCarousel } from "@/components/carousels/how-section-carousel";

export default function HomePage() {
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
