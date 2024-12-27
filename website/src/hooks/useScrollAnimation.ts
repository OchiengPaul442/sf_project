import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return {
    ref,
    style: {
      opacity: isInView ? 1 : 0,
      transform: isInView ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.1s",
    },
  };
}
