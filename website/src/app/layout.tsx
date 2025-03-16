import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { qanelasSoft } from "@/lib/fonts/fonts";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "@/components/ThemeProvider";
import ReduxProvider from "@/components/ReduxProvider";
import React from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${qanelasSoft.variable} font-sans`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Saving Food" />

        {/* GA snippet must appear in <head> for Search Console verification */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="beforeInteractive"
            />
            <Script id="ga-init" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
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
