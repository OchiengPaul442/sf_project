import React, { useEffect, useRef } from "react";
import { isMobileDevice } from "@/utils/deviceDetection";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  scrollYProgress: number;
  range: [number, number];
  align?: "left" | "right";
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  scrollYProgress,
  range,
  align = "left",
}) => {
  const isMobile = isMobileDevice();
  const previousProgressRef = useRef(0);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const normalizedProgress = Math.max(
    0,
    Math.min(1, (scrollYProgress - range[0]) / (range[1] - range[0]))
  );

  const letters = Array.from(text);
  const totalLetters = letters.length;

  useEffect(() => {
    const direction = scrollYProgress > previousProgressRef.current ? 1 : -1;
    previousProgressRef.current = scrollYProgress;

    lettersRef.current.forEach((letter, index) => {
      const delay = direction > 0 ? index * 20 : (totalLetters - index) * 20;
      letter.style.transitionDelay = `${delay}ms`;
    });
  }, [scrollYProgress, totalLetters]);

  const textAlignmentClasses = cn("relative", {
    "text-left sm:text-right": align === "right" && !isMobile,
    "text-left": isMobile || align === "left",
  });

  const textStyles = cn(
    "text-2xl sm:text-3xl md:text-4xl lg:text-[3.38rem]",
    "font-normal leading-[1.4] sm:leading-[1.45] md:leading-[1.35]",
    "tracking-tight whitespace-pre-wrap break-words"
  );

  const renderLetter = (char: string, index: number, isGhost: boolean) => {
    const letterProgress = Math.max(
      0,
      Math.min(
        1,
        (normalizedProgress * totalLetters - index) * (isMobile ? 1.8 : 1.5)
      )
    );

    return (
      <span
        key={`${isGhost ? "ghost" : "reveal"}-${index}`}
        ref={(el) => {
          if (el && !isGhost) lettersRef.current[index] = el;
        }}
        className="inline-block"
      >
        <span
          style={{
            opacity: isGhost ? 1 : letterProgress,
            transition: "opacity 0.3s ease-out",
          }}
          className={isGhost ? "" : "text-white"}
        >
          {char}
        </span>
      </span>
    );
  };

  return (
    <div className={textAlignmentClasses}>
      <p className={cn("invisible", textStyles)}>{letters.join("")}</p>
      <div className="absolute top-0 left-0 right-0">
        <p className={textStyles}>
          <span className="absolute top-0 left-0 right-0 text-white/20">
            {letters.map((char, i) => renderLetter(char, i, true))}
          </span>
          <span className="relative">
            {letters.map((char, i) => renderLetter(char, i, false))}
          </span>
        </p>
      </div>
    </div>
  );
};
