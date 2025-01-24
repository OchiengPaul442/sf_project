"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, Suspense, useEffect } from "react";
import Loader from "./loader";
import { preloadLottieAnimations } from "./carousels/how-section-carousel";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    preloadLottieAnimations();
  }, []);
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </NextThemesProvider>
  );
};

export default ThemeProvider;
