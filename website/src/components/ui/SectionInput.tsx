// components/ui/SectionInput.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FileUpload } from "@/components/ui/FileUpload"; // Import the FileUpload component

interface SectionInputProps {
  id: string; // This will act as the field name
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "file";
  placeholder?: string;
  required?: boolean;
  className?: string;
  accept?: string; // for file input
  error?: FieldError;
  register: UseFormRegister<any>; // react-hook-form's register function
}

export const SectionInput: React.FC<SectionInputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  className = "",
  accept,
  error,
  register,
}) => {
  return (
    <div className="space-y-2">
      {type !== "file" && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      {type === "textarea" ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          required={required}
          className={`min-h-[80px] sm:min-h-[100px] rounded-lg sm:rounded-xl bg-[#f5f5f5] border-0 font-normal placeholder:text-[#999] text-sm ${className} ${
            error ? "border-red-500 focus:ring-red-500" : ""
          }`}
          {...register(id)}
        />
      ) : type === "file" ? (
        <FileUpload
          id={id}
          label={label}
          accept={accept}
          required={required}
          error={error}
          register={register}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`h-10 sm:h-12 rounded-lg sm:rounded-xl bg-[#f5f5f5] border-0 font-normal placeholder:text-[#999] text-sm ${className} ${
            error ? "border-red-500 focus:ring-red-500" : ""
          }`}
          accept={accept}
          {...register(id)}
        />
      )}
      {type !== "file" && error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};
