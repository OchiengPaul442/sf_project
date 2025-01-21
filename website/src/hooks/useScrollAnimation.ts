"use client";
import { useEffect, useState, useRef } from "react";

interface ScrollAnimationOptions {
  threshold?: number | number[];
}

export const useScrollAnimation = ({
  threshold = 0.1,
}: ScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ratio, setRatio] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update intersection ratio continuously
        setRatio(entry.intersectionRatio);
        // Update visibility flag based on intersection
        setIsVisible(entry.isIntersecting);
      },
      { threshold: Array.isArray(threshold) ? threshold : [threshold] }
    );

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible, ratio };
};
