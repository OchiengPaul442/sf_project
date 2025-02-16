import React, { useEffect, useMemo, useRef, useState } from "react";
import { isMobileDevice } from "@/utils/deviceDetection";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  progress: number;
  range?: [number, number]; // Optional reveal range.
  align?: "left" | "right";
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  progress,
  range = [0, 1],
  align = "left",
}) => {
  const isMobile = isMobileDevice();

  // Normalize the progress value based on the provided range.
  const normalizedProgress = Math.max(
    0,
    Math.min(1, (progress - range[0]) / (range[1] - range[0]))
  );

  // Prepare an array of letters from the text.
  const letters = useMemo(() => Array.from(text), [text]);
  const totalLetters = letters.length;

  // Track previous progress to determine scroll direction.
  const previousProgressRef = useRef(0);

  // Compute an array of delay values (in ms) for each letter.
  const [letterDelays, setLetterDelays] = useState<number[]>([]);
  useEffect(() => {
    const direction = progress > previousProgressRef.current ? 1 : -1;
    previousProgressRef.current = progress;
    const delays = letters.map((_, index) =>
      direction > 0 ? index * 20 : (totalLetters - index) * 20
    );
    setLetterDelays(delays);
  }, [progress, totalLetters, letters]);

  // CSS classes for text alignment.
  const textAlignmentClasses = cn("relative", {
    "text-left sm:text-right": align === "right" && !isMobile,
    "text-left": isMobile || align === "left",
  });

  // Base text styles.
  const textStyles = cn(
    "text-2xl sm:text-3xl md:text-4xl lg:text-[3.38rem]",
    "font-normal leading-[1.4] sm:leading-[1.45] md:leading-[1.35]",
    "tracking-tight whitespace-pre-wrap break-words"
  );

  // Render a single letter with the appropriate delay and opacity.
  const renderLetter = (char: string, index: number, isGhost: boolean) => {
    // Compute the letter's opacity progress.
    // We multiply by a factor (1.8 on mobile, 1.5 on desktop) to adjust the speed of the reveal.
    const factor = isMobile ? 1.8 : 1.5;
    const letterProgress = Math.max(
      0,
      Math.min(1, (normalizedProgress * totalLetters - index) * factor)
    );

    return (
      <span
        key={`${isGhost ? "ghost" : "reveal"}-${index}`}
        className="inline-block"
        style={{ transitionDelay: `${letterDelays[index] ?? 0}ms` }}
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
      {/* A hidden placeholder to maintain layout */}
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
