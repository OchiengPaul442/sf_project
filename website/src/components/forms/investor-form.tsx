"use client";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SectionInput } from "../ui/SectionInput";
import { useInvestmentSubmission } from "@/hooks/useContactUsSubmission";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const InvestorSchema = Yup.object({
  fullName: Yup.string()
    .transform((value) => value.trim())
    .required("Full Name is required"),
  email: Yup.string()
    .transform((value) => value.trim())
    .email("Invalid email format")
    .required("Email is required"),
  fundOrOrganisationName: Yup.string()
    .transform((value) => value.trim())
    .required("Organization name is required"),
  websiteOrLinkedInProfile: Yup.string()
    .transform((value) => value.trim())
    .url("Invalid URL format")
    .required("Profile URL is required"),
  investmentInterest: Yup.number()
    .min(50000, "Minimum investment is $50,000")
    .max(1000000000, "Maximum investment is $1,000,000,000")
    .required("Investment amount is required"),
}).required();

type InvestorFormInputs = Yup.InferType<typeof InvestorSchema>;

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
      reset(); // Clear form inputs after success
    } catch (err) {
      toast.error(
        "An error occurred while submitting the form. Please try again."
      );
      console.error("Submission error:", err);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-white md:rounded-2xl p-4 md:p-8"
      initial="hidden"
      animate="show"
      variants={formAnimation}
    >
      <div className="space-y-6">
        <motion.div className="space-y-2" variants={itemAnimation}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
            Investor Information
          </h2>
          <p className="text-gray-600">
            Partner with us in revolutionizing the restaurant industry
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={itemAnimation}
          >
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
          </motion.div>

          <motion.div variants={itemAnimation}>
            <SectionInput
              id="fundOrOrganisationName"
              label="Fund/Organisation Name"
              placeholder="Enter organization name"
              register={register}
              error={errors.fundOrOrganisationName}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <SectionInput
              id="websiteOrLinkedInProfile"
              label="Website or LinkedIn Profile"
              type="url"
              placeholder="https://"
              register={register}
              error={errors.websiteOrLinkedInProfile}
            />
          </motion.div>

          <motion.div
            className="space-y-4 bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100"
            variants={itemAnimation}
          >
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-black">
                Investment Interest
              </h3>
              {errors.investmentInterest && (
                <p className="text-sm text-red-500">
                  {errors.investmentInterest.message}
                </p>
              )}
            </div>

            <Controller
              control={control}
              name="investmentInterest"
              render={({ field }) => (
                <div className="space-y-4 md:space-y-6">
                  <Slider
                    value={[field.value]}
                    onValueChange={(val: number[]) => field.onChange(val[0])}
                    min={50000}
                    max={1000000000}
                    step={50000}
                    className="mt-2"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">$50k</span>
                    <p className="text-xl md:text-2xl font-bold text-green-600">
                      {field.value >= 1000000
                        ? `$${(field.value / 1000000).toFixed(1)}M`
                        : `$${(field.value / 1000).toFixed(0)}k`}
                    </p>
                    <span className="text-sm text-gray-500">$1B</span>
                  </div>
                </div>
              )}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-900 font-medium text-lg transition-colors"
              disabled={isMutating}
            >
              {isMutating ? "Submitting..." : "Submit"}
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
