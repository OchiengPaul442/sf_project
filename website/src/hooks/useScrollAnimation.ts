import { useEffect, useState, useRef } from "react";

interface ScrollAnimationOptions {
  threshold?: number | number[];
  snapAlign?: "start" | "center" | "end";
}

export const useScrollAnimation = ({
  threshold = 0.1,
  snapAlign = "start",
}: ScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ratio, setRatio] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRatio(entry.intersectionRatio);
        setIsVisible(entry.isIntersecting);

        // Add smooth scrolling when element comes into view
        if (entry.isIntersecting) {
          entry.target.scrollIntoView({
            behavior: "smooth",
            block: snapAlign,
          });
        }
      },
      {
        threshold: Array.isArray(threshold) ? threshold : [threshold],
        rootMargin: "0px",
      }
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
  }, [threshold, snapAlign]);

  return { ref, isVisible, ratio };
};
