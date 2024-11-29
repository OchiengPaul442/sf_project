"use client";

import { MaskedText } from "@/components/masked-text";
import FormSection from "@/components/landingPage/FormSection";
import FooterSection from "@/components/landingPage/FooterSection";
import { WorkWithUs } from "@/components/landingPage/WorkWithUs";
import { motion } from "framer-motion";

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
        viewport={{ once: true, amount: 0.4 }} // Trigger animation when 30% of the section is in view
        variants={sectionVariants}
      >
        <FormSection />
      </motion.section>

      {/* FooterSection */}
      <motion.section
        className="h-screen flex items-center container mx-auto justify-center px-4 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Trigger animation when 30% of the section is in view
        variants={sectionVariants}
      >
        <FooterSection />
      </motion.section>
    </main>
  );
}
