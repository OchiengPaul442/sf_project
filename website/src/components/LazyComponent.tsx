import React from "react";
const componentMap: {
  [key: string]: React.LazyExoticComponent<React.ComponentType<any>>;
} = {
  HeaderSection: React.lazy(() => import("@/views/Home/header-section")),
  RobotSection: React.lazy(() => import("@/views/Home/robotSection")),
  HowSection: React.lazy(() => import("@/views/Home/how-section")),
  WorkSection: React.lazy(() => import("@/views/Home/work-section")),
  FooterSection: React.lazy(() => import("@/views/Home/footer-section")),
};

interface LazyComponentProps {
  component: string;
  [key: string]: any;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  ...props
}) => {
  const Component = componentMap[component];

  if (!Component) {
    console.error(`Component ${component} not found`);
    return null;
  }

  return <Component {...props} />;
};

export default LazyComponent;
