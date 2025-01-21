"use client";

import React from "react";
import ReduxProvider from "@/redux-store/ReduxProvider";

/**
 * Provider component that wraps the application with ReduxProvider.
 */
export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};
