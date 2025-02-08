import HomePage from "@/views/Home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SavingFood.AI - Revolutionizing Food Waste Management",
  description:
    "Discover how AI can transform your food waste management. Join SavingFood.AI in creating a sustainable future through innovative technology and smart solutions.",
  openGraph: {
    title: "Transform Food Waste Management with AI | SavingFood.AI",
    description:
      "Join the revolution in sustainable food management. Our AI-powered platform helps reduce waste, save costs, and protect the environment.",
    // images: [
    //   {
    //     url: "/images/og/home-og.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "SavingFood.AI Platform Preview",
    //   },
    // ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Transform Food Waste Management with AI | SavingFood.AI",
  //   description:
  //     "Join the revolution in sustainable food management. Our AI-powered platform helps reduce waste, save costs, and protect the environment.",
  //   images: ["/images/og/home-twitter.jpg"],
  // },
};

const page = () => {
  return <HomePage />;
};

export default page;
