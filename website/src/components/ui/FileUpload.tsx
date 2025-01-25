"use client";

import type React from "react";
import { useState, useRef } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Upload, X, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept,
  required = false,
  error,
  register,
  className,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      setUploadProgress(progress);

      if (progress === 100) {
        clearInterval(timer);
        setIsUploading(false);
        setUploadComplete(true);
      }
    }, interval);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      simulateUpload();
    } else {
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      setUploadComplete(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div
        className={cn(
          "h-32 relative rounded-lg sm:rounded-xl bg-[#f5f5f5] border-2 border-dashed",
          error ? "border-red-500" : "border-gray-200",
          "transition-all duration-200 ease-in-out",
          selectedFile ? "border-solid" : "hover:border-gray-300"
        )}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          required={required}
          className="hidden"
          {...register(id)}
          onChange={handleFileChange}
          ref={inputRef}
        />

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              onClick={handleButtonClick}
            >
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click or drag file to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {accept ? `Accepts ${accept}` : "Any file type"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-4"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 flex items-center">
                  <div className="w-full space-y-2">
                    <div className="h-2 relative rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          uploadComplete ? "bg-green-500" : "bg-blue-500"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {uploadComplete ? (
                          <span className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            Upload complete
                          </span>
                        ) : isUploading ? (
                          `Uploading... ${Math.round(uploadProgress)}%`
                        ) : (
                          "Ready to upload"
                        )}
                      </span>
                      <span>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};
