import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("./LandingPage"));

const page = () => {
  return <LandingPage />;
};

export default page;
