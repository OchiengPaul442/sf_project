"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, useSpring } from "framer-motion";

export const usePageSlideEffect = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(Date.now());

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 200,
    damping: 25,
    mass: 0.5,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime.current;

      if (timeDiff < 50) return;

      lastScrollTime.current = currentTime;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const maxScroll = containerRef.current.scrollHeight - windowHeight;

      if (scrollPosition < 0 || scrollPosition > maxScroll) return;

      const newPage = Math.floor(scrollPosition / windowHeight);

      if (newPage !== currentPage) {
        setIsScrolling(true);
        setCurrentPage(newPage);

        // Only smooth scroll for animated sections
        if (newPage > 0) {
          window.scrollTo({
            top: newPage * windowHeight,
            behavior: "smooth",
          });
        }

        setTimeout(() => {
          setIsScrolling(false);
        }, 600);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
    };
  }, [currentPage]);

  // Prevent scroll beyond last section
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (containerRef.current && currentPage === 3 && e.deltaY > 0) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    return () => window.removeEventListener("wheel", preventScroll);
  }, [currentPage]);

  return {
    currentPage,
    containerRef,
    smoothY,
    isScrolling,
  };
};
