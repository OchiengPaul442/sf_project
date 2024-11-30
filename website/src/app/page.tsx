"use client";

import { useState, useEffect } from "react";
import { MaskedText } from "@/components/landingPage/masked-text";
import FormSection from "@/components/landingPage/FormSection";
import FooterSection from "@/components/layout/Footer/FooterSection";
import { WorkWithUs } from "@/components/landingPage/WorkWithUs";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ProblemStatement } from "@/components/landingPage/ProblemStatement";

const Loader = dynamic(() => import("@/components/loader"), { ssr: false });

// Animation Variants for Framer Motion
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
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

      <motion.section
        className="h-full md:h-screen flex items-center container mx-auto justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <ProblemStatement />
      </motion.section>

      {/* WorkWithUs Section */}
      <motion.section
        className="h-full md:h-screen flex items-center container mx-auto justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <WorkWithUs />
      </motion.section>

      {/* FormSection */}
      <motion.section
        className="h-full md:h-screen flex items-center container mx-auto justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={sectionVariants}
      >
        <FormSection />
      </motion.section>

      {/* FooterSection */}
      <motion.section
        className="h-full md:h-screen flex items-center container mx-auto justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <FooterSection />
      </motion.section>
    </main>
  );
}
