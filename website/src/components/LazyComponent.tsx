import type React from "react";
import dynamic from "next/dynamic";

const componentMap: {
  [key: string]: React.ComponentType<any>;
} = {
  HeaderSection: dynamic(() => import("@/views/Home/header-section"), {
    ssr: false,
  }),
  RobotSection: dynamic(() => import("@/views/Home/robotSection"), {
    ssr: false,
  }),
  HowSection: dynamic(() => import("@/views/Home/how-section"), { ssr: false }),
  WorkSection: dynamic(() => import("@/views/Home/work-section"), {
    ssr: false,
  }),
};

interface LazyComponentProps {
  component: string;
  isActive: boolean;
  [key: string]: any;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  isActive,
  ...props
}) => {
  const Component = componentMap[component];

  if (!Component) {
    console.error(`Component ${component} not found`);
    return null;
  }

  return (
    <div style={{ display: isActive ? "block" : "none" }}>
      <Component {...props} isActive={isActive} />
    </div>
  );
};

export default LazyComponent;
