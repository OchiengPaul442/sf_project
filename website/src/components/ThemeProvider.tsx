"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, Suspense } from "react";
import Loader from "./loader";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </NextThemesProvider>
  );
};

export default ThemeProvider;
