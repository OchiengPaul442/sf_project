"use client";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SectionInput } from "@/components/ui/SectionInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { useEngineersSubmission } from "@/hooks/useContactUsSubmission";
import { toast } from "react-toastify";

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Define the Yup schema for the Engineer form.
 * Each text field is trimmed automatically.
 */
const EngineerSchema = Yup.object({
  fullName: Yup.string()
    .transform((value) => value.trim())
    .required("Full Name is required."),
  email: Yup.string()
    .transform((value) => value.trim())
    .email("Invalid email format.")
    .required("Email is required."),
  linkedInOrGithubURL: Yup.string()
    .transform((value) => value.trim())
    .url("Invalid URL format.")
    .required("Profile URL is required."),
  primarySkillset: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one skill must be selected.")
    .required("Primary skills are required."),
  reasonForInterest: Yup.string()
    .transform((value) => value.trim())
    .optional(),
  resumeURL: Yup.mixed<File>()
    .nullable()
    .transform((value, originalValue) => {
      // If no file is selected, originalValue might be an empty string or FileList with length 0
      if (
        !originalValue ||
        (originalValue instanceof FileList && originalValue.length === 0)
      ) {
        return null;
      }
      // If FileList is provided, return the first file
      if (originalValue instanceof FileList) {
        return originalValue.item(0);
      }
      return value;
    })
    .test("fileSize", "File Size is too large (Max 10MB).", (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("fileType", "Unsupported File Format (Only PDF).", (value) => {
      if (!value) return true;
      return value.type === "application/pdf";
    })
    .notRequired(),
}).required();

/** Derive form inputs from schema */
type EngineerFormInputs = Yup.InferType<typeof EngineerSchema>;

export function EngineerForm() {
  const { trigger, isMutating } = useEngineersSubmission();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EngineerFormInputs>({
    resolver: yupResolver(EngineerSchema),
    defaultValues: {
      primarySkillset: [],
      resumeURL: null,
    },
  });

  const onSubmit: SubmitHandler<EngineerFormInputs> = async (data) => {
    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("linkedInOrGithubURL", data.linkedInOrGithubURL);
      formData.append("primarySkillset", data.primarySkillset.join(", "));

      if (data.reasonForInterest) {
        formData.append("reasonForInterest", data.reasonForInterest);
      }

      if (data.resumeURL instanceof File) {
        formData.append("resumeURL", data.resumeURL, data.resumeURL.name);
      }

      await trigger(formData);
      toast.success("Application submitted successfully!");
      reset(); // Clear form inputs after success
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      encType="multipart/form-data"
    >
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
          id="linkedInOrGithubURL"
          label="LinkedIn Profile or Github Link"
          type="url"
          placeholder="https://"
          register={register}
          error={errors.linkedInOrGithubURL}
        />

        {/* Primary Skillset Checkboxes */}
        <div>
          <h3 className="text-sm font-medium mb-2">Primary Skillset</h3>
          {errors.primarySkillset && (
            <p className="text-sm text-red-500 mb-1">
              {errors.primarySkillset.message}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="primarySkillset"
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
          id="reasonForInterest"
          label="Reason for Interest (Optional)"
          type="textarea"
          placeholder="Tell us why you're interested in joining our team"
          register={register}
          error={errors.reasonForInterest}
        />

        <FileUpload
          id="resumeURL"
          label="Resume (Optional)"
          accept=".pdf"
          register={register}
          setValue={setValue}
          error={errors.resumeURL}
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 10MB (PDF only)
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-10 sm:h-12 rounded-full bg-black text-white hover:bg-black/90 font-normal text-sm"
        disabled={isMutating}
      >
        {isMutating ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}

export default EngineerForm;
