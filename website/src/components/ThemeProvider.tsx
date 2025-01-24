"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
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
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
