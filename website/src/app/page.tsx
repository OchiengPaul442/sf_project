"use client";

import { useState, useEffect } from "react";
import { MaskedText } from "@/components/masked-text";
import FormSection from "@/components/landingPage/FormSection";
import FooterSection from "@/components/landingPage/FooterSection";
import { WorkWithUs } from "@/components/landingPage/WorkWithUs";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@/components/loader"), { ssr: false });

// Animation Variants for Framer Motion
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50, // Start slightly below
  },
  visible: {
    opacity: 1,
    y: 0, // Slide into place
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

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
    <main className="flex flex-col gap-12 md:gap-20">
      {/* MaskedText Section */}
      <MaskedText />

      {/* WorkWithUs Section */}
      <motion.section
        className="h-screen flex items-center container mx-auto justify-center px-4 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the section is in view
        variants={sectionVariants}
      >
        <WorkWithUs />
      </motion.section>

      {/* FormSection */}
      <motion.section
        className="h-screen flex items-center container mx-auto justify-center px-4 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }} // Trigger animation when 40% of the section is in view
        variants={sectionVariants}
      >
        <FormSection />
      </motion.section>

      {/* FooterSection */}
      <motion.section
        className="h-screen flex items-center container mx-auto justify-center px-4 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the section is in view
        variants={sectionVariants}
      >
        <FooterSection />
      </motion.section>
    </main>
  );
}
