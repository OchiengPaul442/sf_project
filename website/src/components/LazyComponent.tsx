import React, { Suspense } from "react";

import Loader from "@/components/loader";
import { motion } from "framer-motion";

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

  return (
    <Suspense
      fallback={
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <Loader />
        </motion.div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default LazyComponent;
