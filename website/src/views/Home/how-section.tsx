"use client";

import React from "react";

const HowSection: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section
      id={id}
      className="relative bg-black text-white min-h-screen flex items-center justify-center px-6"
    >
      <div className="container mx-auto text-center space-y-12">
        {/* First Paragraph */}
        <p className="text-left text-2xl sm:text-3xl md:text-4xl font-normal leading-relaxed">
          By building a platform that empowers restaurants to cut food waste,
          protect their bottom line, and have a meaningful, cumulative impact on
          global sustainability.
        </p>

        {/* Separator */}
        <div className="relative w-full flex items-center gap-4 py-6">
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
          <div className="flex-1 h-px bg-gradient-to-l from-white/20 to-transparent" />
        </div>

        {/* Second Paragraph */}
        <p className="text-right text-2xl sm:text-3xl md:text-4xl font-normal leading-relaxed">
          Our team blends more than a decade of Food and AI experience in a
          packaged solution that lets you focus on creating while we handle the
          rest.
        </p>
      </div>
    </section>
  );
};

export default HowSection;
