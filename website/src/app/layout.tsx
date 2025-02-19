import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { qanelasSoft } from "@/lib/fonts/fonts";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "@/components/ThemeProvider";
import ReduxProvider from "@/components/ReduxProvider";
import React from "react";

// TODO:Remove this analytics later
import { Analytics } from "@vercel/analytics/react";

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
        <Analytics />
      </body>
    </html>
  );
}
