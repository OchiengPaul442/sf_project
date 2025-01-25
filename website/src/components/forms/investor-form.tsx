// components/forms/InvestorForm.tsx
"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SectionInput } from "../ui/SectionInput";
import { useState } from "react";

/**
 * Define the Yup schema for the Investor form.
 */
const InvestorSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  organization: Yup.string().required("Organization name is required"),
  profile: Yup.string()
    .url("Invalid URL format")
    .required("Profile URL is required"),
  investmentAmount: Yup.number()
    .min(50000, "Minimum investment is $50,000")
    .max(1000000000, "Maximum investment is $1,000,000,000")
    .required("Investment amount is required"),
}).required();

/** Define form inputs type */
type InvestorFormInputs = Yup.InferType<typeof InvestorSchema>;

export function InvestorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvestorFormInputs>({
    resolver: yupResolver(InvestorSchema),
    defaultValues: {
      investmentAmount: 500000,
    },
  });

  const onSubmit: SubmitHandler<InvestorFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log("Form Data:", data);
    // Add your form submission logic here

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          Investor Information
        </h2>
        <p className="text-sm text-gray-600">
          Partner with us in revolutionizing the restaurant industry
        </p>
      </div>

      <div className="space-y-4">
        <SectionInput
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          register={register}
          error={errors.name}
        />
        <SectionInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
        />
        <SectionInput
          id="organization"
          label="Fund/Organisation Name"
          placeholder="Enter organization name"
          register={register}
          error={errors.organization}
        />
        <SectionInput
          id="profile"
          label="Website or LinkedIn Profile"
          type="url"
          placeholder="https://"
          register={register}
          error={errors.profile}
        />

        {/* Investment Amount Slider */}
        <div>
          <h3 className="text-sm font-medium mb-2">Investment Interest</h3>
          {errors.investmentAmount && (
            <p className="text-sm text-red-500 mb-1">
              {errors.investmentAmount.message}
            </p>
          )}
          <Controller
            control={control}
            name="investmentAmount"
            render={({ field }) => (
              <>
                <Slider
                  value={[field.value]}
                  onValueChange={(val: number[]) => field.onChange(val[0])}
                  min={50000}
                  max={1000000000}
                  step={50000}
                  className="mt-2"
                />
                <p className="text-sm font-medium text-black mt-2">
                  {field.value >= 1000000
                    ? `$${(field.value / 1000000).toFixed(1)}M`
                    : `$${(field.value / 1000).toFixed(0)}k`}
                </p>
              </>
            )}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-10 sm:h-12 rounded-full bg-black text-white hover:bg-black/90 font-normal text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
