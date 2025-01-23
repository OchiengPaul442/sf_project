import { useState, useEffect, useRef } from "react";

export const usePageSlideEffect = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const newPage = Math.round(scrollPosition / windowHeight);

      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    containerRef,
  };
};
