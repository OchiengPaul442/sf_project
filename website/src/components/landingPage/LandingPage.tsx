"use client";

import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";
// Import individual sections
import LandingSection from "./LandingSection";
import FormSection from "./FormSection";
import FooterSection from "./FooterSection";
import dynamic from "next/dynamic";
const Loader = dynamic(() => import("@/components/loader"), { ssr: false });

const LandingPage = () => {
  const { scrollY } = useScroll();

  // Fade-out for header and subtitle
  const opacityElements = useTransform(scrollY, [1200, 1700], [1, 0], {
    clamp: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Variants for smooth transitions between sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {/* Top Bar */}
      <motion.header
        style={{ opacity: opacityElements }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 bg-transparent"
      >
        <div className="text-black font-bold text-xl">sf.</div>
        <FiMenu className="text-black text-2xl cursor-pointer" />
      </motion.header>

      {/* Landing Section */}
      <LandingSection />

      {/* Work with Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="w-full flex justify-center h-screen items-center pt-20 container mx-auto px-8"
      >
        <div className="bg-[#F5F5F5] rounded-3xl px-8 py-12 text-center">
          {/* Top Heading */}
          <h2 className="text-[36px] font-normal text-gray-600 tracking-wide mb-4">
            Work with us
          </h2>

          {/* Main Question */}
          <h1 className="text-4xl md:text-[96px] font-semibold text-black leading-[96px] mb-8">
            Are you’re an engineer <br />
            who’s excited about our mission?
          </h1>

          {/* Button */}
          <div className="flex justify-center items-center">
            <motion.button
              className="flex items-center gap-4 px-6 py-2 w-[140px] bg-gray-300 rounded-full relative shadow-md"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="text-lg text-black font-medium">Reach out</span>
              <motion.div
                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full absolute -right-4"
                animate={{
                  x: isHovering ? 10 : 0,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                →
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <FormSection />
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <FooterSection scrollToTop={scrollToTop} />
      </motion.div>
    </div>
  );
};

export default LandingPage;
