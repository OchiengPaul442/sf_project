"use client";

import React from "react";
import { motion } from "framer-motion";

const FormSection: React.FC = () => {
  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-black p-4">
      <motion.div
        className="w-full bg-white rounded-3xl px-8 sm:px-12 py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Headings */}
        <motion.h2
          className="text-xl font-mono text-black/70 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Participate in our seed round
        </motion.h2>

        <motion.h1
          className="text-3xl sm:text-4xl font-mono max-w-4xl w-full font-bold mx-auto text-black mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Invitation to potential investors to participate.
        </motion.h1>

        {/* Form */}
        <motion.form
          className="space-y-6 w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="flex flex-col items-start">
              <label
                htmlFor="name"
                className="block text-base font-mono text-black mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter full name"
                className="w-full px-6 py-4 text-base font-mono bg-[#F5F5F5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 placeholder:text-black/40"
                required
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col items-start">
              <label
                htmlFor="email"
                className="block text-base font-mono text-black mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email address"
                className="w-full px-6 py-4 text-base font-mono bg-[#F5F5F5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 placeholder:text-black/40"
                required
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="flex flex-col items-start">
            <label
              htmlFor="message"
              className="block text-base font-mono text-black mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              placeholder="Message"
              rows={5}
              className="w-full px-6 py-4 text-base font-mono bg-[#F5F5F5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 placeholder:text-black/40 resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full px-6 py-4 bg-black text-white text-base font-mono rounded-full hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default FormSection;
