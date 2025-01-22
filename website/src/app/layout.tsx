import type { Metadata } from "next";
import "./globals.css";
import { qanelasSoft } from "@/lib/fonts/fonts";
import { Provider } from "@/components/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ThemeProvider from "@/components/ThemeProvider";

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
    <html lang="en" className={`${qanelasSoft.variable} font-sans`}>
      <body className="h-screen">
        <Provider>
          <ThemeProvider>
            <main className="h-[calc(100vh*5)] overscroll-none">
              {children}
            </main>
          </ThemeProvider>
        </Provider>
        <ToastContainer position="top-center" autoClose={5000} />
      </body>
    </html>
  );
}
