import type { Metadata } from "next";
import "./globals.css";
import { qanelasSoft } from "@/lib/fonts/fonts";
import { Provider } from "@/components/Provider";

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
    <html
      lang="en"
      className={`${qanelasSoft.variable} font-sans h-[calc(100vh*5)] snap-y snap-mandatory`}
    >
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
