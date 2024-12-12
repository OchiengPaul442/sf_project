import type { Metadata } from "next";
import "../styles/globals.css";
import { heming } from "@/public/fonts/fonts";

export const metadata: Metadata = {
  title: "Saving Food",
  description:
    "A platform for restaurants to connect with customers and save food",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${heming.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
