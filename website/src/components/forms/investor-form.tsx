"use client";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SectionInput } from "../ui/SectionInput";
import { useInvestmentSubmission } from "@/hooks/useContactUsSubmission";
import { toast } from "react-toastify";

/**
 * Define the Yup schema for the Investor form.
 */
const InvestorSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  fundOrOrganisationName: Yup.string().required(
    "Organization name is required"
  ),
  websiteOrLinkedInProfile: Yup.string()
    .url("Invalid URL format")
    .required("Profile URL is required"),
  investmentInterest: Yup.number()
    .min(50000, "Minimum investment is $50,000")
    .max(1000000000, "Maximum investment is $1,000,000,000")
    .required("Investment amount is required"),
}).required();

/** Define form inputs type */
type InvestorFormInputs = Yup.InferType<typeof InvestorSchema>;

export function InvestorForm() {
  const { trigger, isMutating } = useInvestmentSubmission();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InvestorFormInputs>({
    resolver: yupResolver(InvestorSchema),
    defaultValues: {
      investmentInterest: 500000,
    },
  });

  const onSubmit: SubmitHandler<InvestorFormInputs> = async (data) => {
    try {
      const formattedData = {
        ...data,
        investmentInterest: `USD ${data.investmentInterest.toLocaleString()}`,
      };
      await trigger(formattedData);
      toast.success("Form submitted successfully!");
      reset(); // Reset the form after successful submission
    } catch (err) {
      toast.error(
        "An error occurred while submitting the form. Please try again."
      );
      console.error("Submission error:", err);
    }
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
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          register={register}
          error={errors.fullName}
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
          id="fundOrOrganisationName"
          label="Fund/Organisation Name"
          placeholder="Enter organization name"
          register={register}
          error={errors.fundOrOrganisationName}
        />
        <SectionInput
          id="websiteOrLinkedInProfile"
          label="Website or LinkedIn Profile"
          type="url"
          placeholder="https://"
          register={register}
          error={errors.websiteOrLinkedInProfile}
        />

        {/* Investment Amount Slider */}
        <div>
          <h3 className="text-sm font-medium mb-2">Investment Interest</h3>
          {errors.investmentInterest && (
            <p className="text-sm text-red-500 mb-1">
              {errors.investmentInterest.message}
            </p>
          )}
          <Controller
            control={control}
            name="investmentInterest"
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
        disabled={isMutating}
      >
        {isMutating ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
