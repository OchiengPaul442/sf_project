// components/forms/EngineerForm.tsx
"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SectionInput } from "@/components/ui/SectionInput";
import { useState } from "react";

/** Dummy skill list */
const SKILLS = [
  "Full Stack",
  "Frontend",
  "Backend",
  "AI/ML",
  "DevOps",
  "Python",
  "JavaScript",
  "Node.js",
  "GraphDB",
];

/**
 * Define the Yup schema for the Engineer form.
 * Notice how we define `resume` as a mixed file type,
 * and the tests use an optional check for `value[0]`.
 */
const EngineerSchema = Yup.object({
  name: Yup.string().required("Full Name is required."),
  email: Yup.string()
    .email("Invalid email format.")
    .required("Email is required."),
  profile: Yup.string()
    .url("Invalid URL format.")
    .required("Profile URL is required."),
  primarySkills: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one skill must be selected.")
    .required("Primary skills are required."),
  interest: Yup.string().optional(),
  resume: Yup.mixed<FileList>()
    .test("fileSize", "File Size is too large (Max 2MB).", (value) => {
      // If no file is uploaded, it's optional -> pass
      if (!value || value.length === 0) return true;
      // Otherwise, check the size of the first file
      return value[0].size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Unsupported File Format (Only PDF).", (value) => {
      if (!value || value.length === 0) return true;
      return ["application/pdf"].includes(value[0].type);
    })
    .optional(),
}).required();

/** Derive form inputs from schema */
type EngineerFormInputs = Yup.InferType<typeof EngineerSchema>;

export function EngineerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EngineerFormInputs>({
    resolver: yupResolver(EngineerSchema),
    defaultValues: {
      primarySkills: [],
    },
  });

  const onSubmit: SubmitHandler<EngineerFormInputs> = async (data) => {
    setIsSubmitting(true);

    // Handle form data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("profile", data.profile);
    data.primarySkills.forEach((skill) =>
      formData.append("primarySkills", skill)
    );
    if (data.interest) {
      formData.append("interest", data.interest);
    }
    if (data.resume && data.resume.length > 0) {
      formData.append("resume", data.resume[0]);
    }

    // log
    console.log(formData.entries());

    // Simulate async form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          Engineer Application
        </h2>
        <p className="text-sm text-gray-600">
          Join our team and help build the future of restaurant management
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
          id="profile"
          label="LinkedIn Profile or Github Link"
          type="url"
          placeholder="https://"
          register={register}
          error={errors.profile}
        />

        {/* Primary Skillset Checkboxes */}
        <div>
          <h3 className="text-sm font-medium mb-2">Primary Skillset</h3>
          {errors.primarySkills && (
            <p className="text-sm text-red-500 mb-1">
              {errors.primarySkills.message}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="primarySkills"
                  render={({ field }) => {
                    const { value, onChange } = field;
                    return (
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={value.includes(skill)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            onChange([...value, skill]);
                          } else {
                            onChange(value.filter((s) => s !== skill));
                          }
                        }}
                      />
                    );
                  }}
                />
                <label htmlFor={`skill-${skill}`} className="text-sm">
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>

        <SectionInput
          id="interest"
          label="Reason for Interest (Optional)"
          type="textarea"
          placeholder="Tell us why you're interested in joining our team"
          register={register}
          error={errors.interest}
        />

        <SectionInput
          id="resume"
          label="Resume (Optional)"
          type="file"
          accept=".pdf"
          register={register}
          error={errors.resume}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-10 sm:h-12 rounded-full bg-black text-white hover:bg-black/90 font-normal text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}

export default EngineerForm;
