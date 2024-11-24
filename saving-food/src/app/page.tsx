"use client";

import React, { Suspense } from "react";
import Loader from "../components/loader";
import LandingPage from "./LandingPage";

const Page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <LandingPage />
    </Suspense>
  );
};

export default Page;
