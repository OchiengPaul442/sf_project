"use client";

import { useScroll } from "framer-motion";
import { MaskedText } from "@/components/masked-text";
// Import individual sections
import FormSection from "@/components/landingPage/FormSection";
import FooterSection from "@/components/landingPage/FooterSection";

export default function Home() {
  const { scrollYProgress } = useScroll();

  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <MaskedText scrollProgress={scrollYProgress} />

      <FormSection />

      <FooterSection scrollToTop={scrollToTop} />
    </main>
  );
}
