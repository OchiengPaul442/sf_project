import HomePage from "@/views/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SavingFood.ai - Revolutionizing Food Waste Management",
  description:
    "Discover how AI transforms food waste management. Join SavingFood.ai to reduce waste, cut costs, and promote sustainability with innovative, smart solutions.",
  keywords: [
    "Food Waste Management",
    "AI",
    "Sustainability",
    "Food Technology",
    "Waste Reduction",
    "Smart Solutions",
    "Environmental Impact",
    "SavingFood.ai",
  ],
  openGraph: {
    title: "Transform Food Waste Management with AI | SavingFood.ai",
    description:
      "Join the revolution in sustainable food management. Our AI-powered platform helps reduce waste, save costs, and protect the environment.",
    url: "https://www.savingfood.ai/",
    siteName: "SavingFood.ai",
    images: [
      {
        url: "https://www.savingfood.ai/logo-white.png",
        width: 1200,
        height: 630,
        alt: "SavingFood.ai - Revolutionizing Food Waste Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.savingfood.ai/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const page = () => {
  return <HomePage />;
};

export default page;
