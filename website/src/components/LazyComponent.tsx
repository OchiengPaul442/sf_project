"use client";

import React from "react";
import dynamic from "next/dynamic";

// Map the string-based component keys to actual dynamic imports
const componentMap: Record<string, React.ComponentType<any>> = {
  HeaderSection: dynamic(() => import("@/views/Home/header-section"), {
    ssr: false,
  }),
  RobotSection: dynamic(() => import("@/views/Home/robotSection"), {
    ssr: false,
  }),
  HowSection: dynamic(() => import("@/views/Home/how-section"), {
    ssr: false,
  }),
  WorkSection: dynamic(() => import("@/views/Home/work-section"), {
    ssr: false,
  }),
};

interface LazyComponentProps {
  component: string;
  isActive: boolean;
  [key: string]: any; // allow additional props
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  isActive,
  ...props
}) => {
  const DynamicComponent = componentMap[component];

  if (!DynamicComponent) {
    console.error(`Dynamic component for "${component}" not found.`);
    return null;
  }

  // Only render if it's active (emulating snap)
  return (
    <div style={{ display: isActive ? "block" : "none" }}>
      <DynamicComponent {...props} isActive={isActive} />
    </div>
  );
};

export default LazyComponent;
