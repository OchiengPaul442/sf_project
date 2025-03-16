import HomePage from "@/views/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SavingFood.ai - Revolutionizing Food Waste Management",
  description:
    "Discover how AI can transform your food waste management. Join SavingFood.AI in creating a sustainable future through innovative technology and smart solutions.",
  openGraph: {
    title: "Transform Food Waste Management with AI | SavingFood.AI",
    description:
      "Join the revolution in sustainable food management. Our AI-powered platform helps reduce waste, save costs, and protect the environment.",
  },
};

const page = () => {
  return <HomePage />;
};

export default page;
