"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Lottie from "lottie-react";

import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { PiArrowULeftUp } from "react-icons/pi";
import stuffAnimation from "../lottie/stuff.json";
import waterAnimation from "../lottie/water.json";
import energyAnimation from "../lottie/energy.json";
import foodAnimation from "../lottie/food.json";
import animationWithUs from "@public/animations/animationWithUs.json";
import animationWithoutUs from "@public/animations/animationWithoutUs.json";

const LandingPage: React.FC = () => {
  const { scrollY } = useScroll();

  // Transformations for fade-out and animations
  const opacityText = useTransform(scrollY, [0, 500], [1, 0], { clamp: true });
  const [isHoveringWithUs, setIsHoveringWithUs] = useState(false);
  const [isHoveringWithoutUs, setIsHoveringWithoutUs] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Landing Section */}
      <section className="relative bg-white h-screen flex items-center justify-center overflow-hidden">
        {/* Top Bar */}
        <motion.header
          style={{ opacity: opacityText }}
          className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50 bg-transparent"
        >
          <div className="text-black font-bold text-xl">sf.</div>
          <FiMenu className="text-black text-2xl cursor-pointer" />
        </motion.header>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto flex flex-col items-center">
          {/* Subtitle */}
          <motion.h2
            style={{ opacity: opacityText }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-gray-500 font-light text-xl sm:text-2xl tracking-wide"
          >
            We&apos;re
          </motion.h2>

          {/* Title */}
          <motion.h1
            style={{ opacity: opacityText }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="font-bold text-6xl sm:text-8xl md:text-9xl tracking-tight text-black text-center"
          >
            Saving Food
          </motion.h1>
        </div>

        {/* Lottie Animations Positioned Around the Text */}
        <div className="absolute inset-0 container mx-auto flex items-center justify-center pointer-events-none">
          {/* Top-Left Animation */}
          <motion.div
            className="absolute top-16 left-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Lottie animationData={foodAnimation} className="w-24 h-24" />
          </motion.div>

          {/* Top-Right Animation */}
          <motion.div
            className="absolute top-16 right-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            <Lottie animationData={waterAnimation} className="w-24 h-24" />
          </motion.div>

          {/* Bottom-Left Animation */}
          <motion.div
            className="absolute bottom-16 left-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
          >
            <Lottie animationData={energyAnimation} className="w-24 h-24" />
          </motion.div>

          {/* Bottom-Right Animation */}
          <motion.div
            className="absolute bottom-16 right-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          >
            <Lottie animationData={stuffAnimation} className="w-24 h-24" />
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Video Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-screen object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Third Section: Video in Text */}
      <section className="relative w-full h-screen container mx-auto flex flex-col items-center justify-center overflow-hidden">
        {/* Top Text */}
        <div className="text-gray-300 text-xl md:text-2xl font-medium mb-4 z-10">
          We&apos;re
        </div>

        {/* Masked Video Text */}
        <div className="relative w-full max-w-5xl h-[200px] flex justify-center items-center">
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* SVG for Text Mask */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-full h-full"
            viewBox="0 0 1200 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="text-mask" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="black"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="120"
                >
                  Saving Food
                </text>
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="black"
              mask="url(#text-mask)"
            />
          </svg>
        </div>
      </section>

      {/* Fourth Section: Text in Video */}
      <section className="relative w-full h-screen container mx-auto flex flex-col items-center justify-start pt-20 overflow-hidden">
        {/* Top Text */}
        <div className="text-gray-300 text-lg md:text-xl font-medium mb-2 z-10">
          We&apos;re
        </div>

        {/* Masked Video Text */}
        <div className="relative w-full max-w-5xl h-[150px] flex justify-center items-center">
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* SVG for Text Mask */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-full h-full"
            viewBox="0 0 1200 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="text-mask-1" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="black"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="100"
                >
                  Saving Food
                </text>
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="black"
              mask="url(#text-mask-1)"
            />
          </svg>
        </div>
      </section>

      {/* Fifth Section: Text in Video with Animation */}
      <section className="relative w-full container mx-auto h-screen flex flex-col items-center justify-start pt-20 overflow-hidden">
        {/* Top Text */}
        <div className="text-gray-300 text-lg md:text-xl font-medium mb-2 z-10">
          We&apos;re
        </div>

        {/* Masked Video Text */}
        <div className="relative w-full max-w-5xl h-[150px] flex justify-center items-center">
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* SVG for Text Mask */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-full h-full"
            viewBox="0 0 1200 200"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <mask id="text-mask-2" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="black"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="100" /* Reduced size */
                >
                  Saving Food
                </text>
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="black"
              mask="url(#text-mask-2)"
            />
          </svg>
        </div>

        {/* Problem Statement Section */}
        <div className="mt-12 text-start text-white px-4">
          <h2 className="font-thin text-5xl text-[#A8A8A8] mb-4 tracking-wide">
            The problem statement
          </h2>
          <p className="text-[#A8A8A8] text-5xl font-medium leading-tight">
            <span className="font-bold text-white">
              By building a platform that empowers restaurants
            </span>
            <br />
            to cut food waste,{" "}
            <span className="font-bold">protect their bottom line</span>, and
            have a meaningful, cumulative impact on global sustainability.
          </p>
        </div>
      </section>

      {/* Sixth Section: Text in Video with Animation */}
      <section className="relative w-full h-screen container mx-auto pt-20 flex flex-col justify-center items-center">
        {/* Problem Statement Text */}
        <div className="text-start text-white w-full mb-16">
          <h2 className="font-thin text-5xl md:text-6xl text-[#A8A8A8] mb-8 tracking-wide">
            The problem statement
          </h2>
          <p className="text-[#A8A8A8] text-3xl md:text-4xl font-medium leading-tight">
            <span className="font-bold text-white">
              By building a platform that empowers restaurants
            </span>
            <br />
            to cut food waste,{" "}
            <span className="font-bold">protect their bottom line</span>, and
            have a meaningful, cumulative impact on global sustainability.
          </p>
        </div>

        {/* With Us and Without Us Section */}
        <div className="flex justify-between items-center w-full">
          {/* With Us */}
          <motion.div
            className="relative flex flex-col items-start gap-2 text-white cursor-pointer"
            onMouseEnter={() => setIsHoveringWithUs(true)}
            onMouseLeave={() => setIsHoveringWithUs(false)}
          >
            <p
              className={`transition-all duration-300 ${
                isHoveringWithUs ? "text-6xl font-bold" : "text-4xl font-thin"
              }`}
            >
              With
            </p>
            <p
              className={`transition-all duration-300 ${
                isHoveringWithUs ? "text-6xl font-bold" : "text-4xl font-thin"
              }`}
            >
              Us
            </p>
            <FiArrowDownLeft
              className={`transition-all duration-300 ${
                isHoveringWithUs
                  ? "text-5xl text-gray-200"
                  : "text-3xl text-gray-400"
              }`}
            />
            {isHoveringWithUs && (
              <motion.div
                className="absolute top-[20px] left-[120%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Lottie animationData={animationWithUs} loop={true} />
              </motion.div>
            )}
          </motion.div>

          {/* Without Us */}
          <motion.div
            className="relative flex flex-col items-end gap-2 text-white cursor-pointer"
            onMouseEnter={() => setIsHoveringWithoutUs(true)}
            onMouseLeave={() => setIsHoveringWithoutUs(false)}
          >
            <p
              className={`transition-all duration-300 ${
                isHoveringWithoutUs
                  ? "text-6xl font-bold"
                  : "text-4xl font-thin"
              }`}
            >
              Without
            </p>
            <p
              className={`transition-all duration-300 ${
                isHoveringWithoutUs
                  ? "text-6xl font-bold"
                  : "text-4xl font-thin"
              }`}
            >
              Us
            </p>
            <FiArrowUpRight
              className={`transition-all duration-300 ${
                isHoveringWithoutUs
                  ? "text-5xl text-gray-200"
                  : "text-3xl text-gray-400"
              }`}
            />
            {isHoveringWithoutUs && (
              <motion.div
                className="absolute top-[20px] right-[120%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Lottie animationData={animationWithoutUs} loop={false} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Section 7 */}
      <section className="w-full flex justify-center h-screen items-center pt-20">
        <div className="container mx-auto bg-[#F5F5F5] rounded-3xl px-8 py-12 text-center">
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
      </section>

      {/* section 8 */}
      <section className="w-full h-screen flex justify-center items-center bg-black px-4">
        <div className="container mx-auto flex flex-col justify-center items-center bg-white rounded-3xl px-12 py-12 text-center shadow-lg">
          {/* Heading */}
          <h2 className="text-lg font-normal text-gray-600 mb-4 tracking-wide">
            Participate in our seed round
          </h2>
          <h1 className="text-3xl md:text-4xl max-w-3xl font-semibold text-black mb-8 leading-tight">
            Invitation to potential investors to participate.
          </h1>

          {/* Form */}
          <form className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-3 text-sm bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 text-sm bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                />
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                placeholder="Message"
                rows={5}
                className="w-full px-4 py-3 text-sm bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full h-screen bg-black text-white flex flex-col justify-center items-center">
        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-16 h-16 bg-white text-black rounded-full shadow-md hover:shadow-lg transition-all duration-300 mb-8"
        >
          <PiArrowULeftUp className="text-3xl" />
        </button>

        {/* Footer Content */}
        <div className="w-full max-w-6xl px-8 text-center mt-44">
          <div className="flex justify-between items-center px-2 mb-6">
            {/* Left Text */}
            <p className="text-lg font-light">We’re</p>

            {/* Right Text */}
            <p className="text-lg font-light">© 2024</p>
          </div>

          {/* Center Text */}
          <h1 className="text-8xl md:text-[180px] font-bold leading-none tracking-tight">
            Saving Food.
          </h1>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
