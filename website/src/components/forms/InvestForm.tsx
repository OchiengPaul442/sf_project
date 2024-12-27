"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const InvestForm = () => {
  return (
    <form className="w-full space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm sm:text-base font-mono">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter Full name"
            className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm sm:text-base"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm sm:text-base font-mono">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm sm:text-base font-mono">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Message"
          className="min-h-[100px] sm:min-h-[120px] rounded-xl sm:rounded-2xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm sm:text-base"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 sm:h-14 rounded-full bg-black text-white hover:bg-black/90 font-mono text-sm sm:text-base"
      >
        Send
      </Button>
    </form>
  );
};

export default InvestForm;
