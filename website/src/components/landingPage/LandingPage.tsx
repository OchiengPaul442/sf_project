"use client";

import LandingSection from "./LandingSection";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const nextSectionOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  return (
    <div>
      {/* Landing Section */}
      <LandingSection />
      {/* Next Section */}
      <motion.div
        style={{ opacity: nextSectionOpacity }}
        className="min-h-screen flex items-center justify-center bg-black"
      >
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">
            HELLO
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto px-4">
            Dive into the depths of the ocean, where mysteries await to be
            discovered.
          </p>
        </div>
      </motion.div>

      {/* Final Section */}
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Explore The Deep
          </h2>
          <p className="text-xl text-gray-600">
            Journey through the unexplored territories of our vast oceans, where
            every wave tells a story and every depth holds a secret.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
