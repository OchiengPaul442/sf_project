"use client";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SectionInput } from "../ui/SectionInput";
import { useState } from "react";
import { useRestaurantsSubmission } from "@/hooks/useContactUsSubmission";
import { toast } from "react-toastify";

/** Dummy data sources */
const SKILLS = [
  "My current system is too slow",
  "I want to mitigate fraud in my business",
  "I don't know where my money is going",
  "I want to help save the planet by saving food",
  "I just want to focus on making great food and client experiences",
  "My system data is not reliable",
];

const BUSINESS_TYPES = [
  "Restaurant",
  "Bar",
  "Nightclub",
  "Fast Food",
  "Pizza",
  "Other",
];

/**
 * Define the Yup schema.
 * We'll use transformations to trim white spaces and automatically add the plus sign
 * for the phone number if it's missing.
 */
const RestaurantSchema = Yup.object({
  restaurantName: Yup.string()
    .transform((value) => value.trim())
    .required("Restaurant Name is required."),
  contactPersonFullName: Yup.string()
    .transform((value) => value.trim())
    .required("Contact Person Name is required."),
  email: Yup.string()
    .transform((value) => value.trim())
    .email("Invalid email format.")
    .required("Email is required."),
  phoneNumber: Yup.string()
    .transform((value, originalValue) => {
      const trimmed = originalValue.trim();
      return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
    })
    // Updated regex: + followed by 7 to 15 digits
    .matches(
      /^\+\d{7,15}$/,
      "Phone number must include the country code. For example: +256333334456"
    )
    .required("Phone Number is required."),
  location: Yup.string()
    .transform((value) => value.trim())
    .required("Location is required."),
  BusinessType: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one business type must be selected.")
    .required("Business Type is required."),
  estimatedAnnualCostOfGoodsSold: Yup.number()
    .min(10000, "Minimum annual cost is $10,000.")
    .max(5000000000, "Maximum annual cost is $5,000,000,000.")
    .required("Annual cost is required."),
  currentChallengesOrReasonForInterest: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one challenge must be selected.")
    .required("Current Challenges are required."),
}).required();

/** Derive the form fields type from the schema */
type RestaurantFormInputs = Yup.InferType<typeof RestaurantSchema>;

export function RestaurantForm() {
  const [step, setStep] = useState(1); // Manage current step
  const { trigger, isMutating } = useRestaurantsSubmission();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger: triggerValidation,
  } = useForm<RestaurantFormInputs>({
    resolver: yupResolver(RestaurantSchema),
    defaultValues: {
      estimatedAnnualCostOfGoodsSold: 100000,
      BusinessType: [],
      currentChallengesOrReasonForInterest: [],
    },
  });

  const onSubmit: SubmitHandler<RestaurantFormInputs> = async (data) => {
    try {
      const formattedData = {
        ...data,
        BusinessType: data.BusinessType.join(", "),
        estimatedAnnualCostOfGoodsSold: `USD ${data.estimatedAnnualCostOfGoodsSold.toLocaleString()}`,
        currentChallengesOrReasonForInterest:
          data.currentChallengesOrReasonForInterest.join(", "),
      };
      await trigger(formattedData);
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error(
        "An error occurred while submitting the form. Please try again."
      );
      console.error("Submission error:", error);
    }
  };

  // Handle moving to the next step
  const handleNext = async () => {
    // Trigger validation for Step 1 fields
    const valid = await triggerValidation([
      "restaurantName",
      "contactPersonFullName",
      "email",
      "phoneNumber",
      "location",
      "BusinessType",
    ]);
    if (valid) {
      setStep(2);
    }
  };

  // Handle moving back to the previous step
  const handleBack = () => {
    setStep(1);
  };

  return (
    <form className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          Restaurant Information
        </h2>
        <p className="text-sm text-gray-600">
          Tell us about your restaurant and how we can help
        </p>
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <>
            <SectionInput
              id="restaurantName"
              label="Restaurant Name"
              placeholder="Enter restaurant name"
              required
              register={register}
              error={errors.restaurantName}
            />
            <SectionInput
              id="contactPersonFullName"
              label="Contact Person Name"
              placeholder="Enter your full name"
              required
              register={register}
              error={errors.contactPersonFullName}
            />
            <SectionInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              register={register}
              error={errors.email}
            />
            <SectionInput
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number with country code (e.g., 256333334456 or +256333334456)"
              required
              register={register}
              error={errors.phoneNumber}
            />
            <SectionInput
              id="location"
              label="Location (City/Country)"
              placeholder="Enter your location"
              required
              register={register}
              error={errors.location}
            />

            {/* Business Types (Checkbox Array) */}
            <div>
              <h3 className="text-sm font-medium mb-2">Business Type</h3>
              {errors.BusinessType && (
                <p className="text-sm text-red-500 mb-1">
                  {errors.BusinessType.message}
                </p>
              )}
              <div className="grid gap-2">
                {BUSINESS_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="BusinessType"
                      render={({ field }) => {
                        const { value, onChange } = field;
                        return (
                          <Checkbox
                            id={`type-${type}`}
                            checked={value.includes(type)}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                onChange([...value, type]);
                              } else {
                                onChange(value.filter((t) => t !== type));
                              }
                            }}
                          />
                        );
                      }}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Annual Cost Slider */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Estimated Annual Cost of Goods Sold
              </h3>
              {errors.estimatedAnnualCostOfGoodsSold && (
                <p className="text-sm text-red-500 mb-1">
                  {errors.estimatedAnnualCostOfGoodsSold.message}
                </p>
              )}
              <Controller
                control={control}
                name="estimatedAnnualCostOfGoodsSold"
                render={({ field }) => (
                  <>
                    <Slider
                      value={[field.value]}
                      onValueChange={(val: number[]) => field.onChange(val[0])}
                      min={10000}
                      max={5000000000}
                      step={10000}
                      className="mt-2"
                    />
                    <p className="text-sm font-medium text-black mt-2">
                      ${field.value.toLocaleString()}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Current Challenges (Checkbox Array) */}
            <div>
              <h3 className="text-sm font-medium mb-2">Current Challenges</h3>
              {errors.currentChallengesOrReasonForInterest && (
                <p className="text-sm text-red-500 mb-1">
                  {errors.currentChallengesOrReasonForInterest.message}
                </p>
              )}
              <div className="grid gap-2">
                {SKILLS.map((challenge) => (
                  <div key={challenge} className="flex items-start space-x-2">
                    <Controller
                      control={control}
                      name="currentChallengesOrReasonForInterest"
                      render={({ field }) => {
                        const { value, onChange } = field;
                        return (
                          <Checkbox
                            id={`challenge-${challenge}`}
                            checked={value.includes(challenge)}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                onChange([...value, challenge]);
                              } else {
                                onChange(value.filter((c) => c !== challenge));
                              }
                            }}
                            className="mt-1"
                          />
                        );
                      }}
                    />
                    <Label
                      htmlFor={`challenge-${challenge}`}
                      className="text-sm leading-tight"
                    >
                      {challenge}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {step === 2 && (
          <Button
            type="button"
            onClick={handleBack}
            className="h-10 sm:h-12 rounded-full bg-gray-500 text-white hover:bg-gray-600 font-normal text-sm"
          >
            Back
          </Button>
        )}
        {step === 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="h-10 sm:h-12 w-full rounded-full bg-black text-white hover:bg-black/90 font-normal text-sm"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit(onSubmit)}
            type="button"
            className="h-10 sm:h-12 rounded-full bg-black text-white hover:bg-black/90 font-normal text-sm"
            disabled={isMutating}
          >
            {isMutating ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}
