"use client";

import React from "react";

const FormSection: React.FC = () => (
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
              required
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
              required
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
            required
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
);

export default FormSection;
