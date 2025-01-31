import React from "react";

interface ErrorDisplayProps {
  errors: Record<string, string>;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-4">
    <h2 className="text-xl mb-4">Failed to load required assets</h2>
    <ul className="text-red-500">
      {Object.entries(errors).map(([path, error]) => (
        <li key={path}>
          {path}: {error}
        </li>
      ))}
    </ul>
  </div>
);
