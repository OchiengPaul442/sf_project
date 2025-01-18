"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInvestSubmission } from "@/hooks/useInvestSubmission";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is required."),
  message: Yup.string().required("Message is required."),
});

const InvestForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { trigger, isMutating } = useInvestSubmission();

  const onSubmit = async (data: FormData) => {
    try {
      await trigger(data);
      toast.success("Submission successful!");
      reset();
    } catch (err: any) {
      toast.error("Submission failed!");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4 sm:space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-mono">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter Full name"
            className="h-10 sm:h-12 rounded-lg sm:rounded-xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-mono">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-mono">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            className="h-10 sm:h-12 rounded-lg sm:rounded-xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-mono">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-mono">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Message"
          className="min-h-[80px] sm:min-h-[100px] rounded-lg sm:rounded-xl bg-[#f5f5f5] border-0 font-mono placeholder:text-[#999] text-sm"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-500 font-mono">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isMutating}
        className="w-full h-10 sm:h-12 rounded-full bg-black text-white hover:bg-black/90 font-mono text-sm"
      >
        {isMutating ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

export default InvestForm;
