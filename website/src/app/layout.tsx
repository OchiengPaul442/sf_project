import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { qanelasSoft } from "@/lib/fonts/fonts";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "@/components/ThemeProvider";
import ReduxProvider from "@/components/ReduxProvider";
import React from "react";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.savingfood.ai"),
  title: {
    default: "SavingFood.AI - AI-Powered Food Waste Reduction Platform",
    template: "%s | SavingFood.AI",
  },
  description:
    "Transform your approach to food sustainability with SavingFood.AI. Our AI-powered platform helps reduce food waste, optimize resources, and create a more sustainable future for food management.",
  keywords: [
    "food waste reduction",
    "AI food management",
    "sustainable food solutions",
    "food waste AI",
    "food sustainability",
    "smart food management",
    "AI sustainability platform",
    "food waste prevention",
  ],
  authors: [{ name: "SavingFood.AI Team" }],
  creator: "SavingFood.AI",
  publisher: "SavingFood.AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "SavingFood.AI",
    title: "SavingFood.AI - Revolutionary Food Waste Reduction Through AI",
    description:
      "Join the future of sustainable food management. Our AI technology helps businesses and organizations reduce food waste, optimize resources, and contribute to a more sustainable world.",
    url: "https://www.savingfood.ai",
    // images: [
    //   {
    //     url: "https://www.savingfood.ai/og-image.jpg", // Replace with your actual OG image
    //     width: 1200,
    //     height: 630,
    //     alt: "SavingFood.AI Platform Preview",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SavingFood.AI - AI-Powered Food Sustainability",
    description:
      "Revolutionizing food waste reduction through artificial intelligence. Join us in creating a more sustainable future.",
    // images: ["https://www.savingfood.ai/twitter-image.jpg"], // Replace with your actual Twitter card image
    // creator: "@savingfoodai", // Replace with your actual Twitter handle
    // site: "@savingfoodai", // Replace with your actual Twitter handle
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: "#00FF00", // Using the green color from your logo
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  category: "Technology",
  verification: {
    google: "", // Replace with your actual verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${qanelasSoft.variable} font-sans`}>
      <body className="h-screen">
        <ReduxProvider>
          <ThemeProvider>
            <main className="overscroll-none">{children}</main>
          </ThemeProvider>
        </ReduxProvider>
        <ToastContainer position="top-center" autoClose={5000} />
      </body>
    </html>
  );
}
