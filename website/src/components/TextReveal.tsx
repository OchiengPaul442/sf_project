// components/TextReveal.tsx
import React from "react";
import { isMobileDevice } from "@/utils/deviceDetection";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  /** A value between 0 and 1 representing the current scroll progress */
  scrollYProgress: number;
  /** The progress range within which the text will reveal */
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

  // Normalize progress within the specified range.
  const normalizedProgress = Math.max(
    0,
    Math.min(1, (scrollYProgress - range[0]) / (range[1] - range[0]))
  );

  // Split text into words.
  const words = text.split(" ");
  const totalWords = words.length;

  // Set text alignment (always left on mobile).
  const textAlignmentClasses = cn("relative", {
    "text-left sm:text-right": align === "right" && !isMobile,
    "text-left": isMobile || align === "left",
  });

  // Shared text styles.
  const textStyles = cn(
    "text-2xl sm:text-3xl md:text-4xl lg:text-[3.38rem]",
    "font-normal leading-[1.4] sm:leading-[1.45] md:leading-[1.35]",
    "tracking-tight whitespace-pre-wrap break-words"
  );

  const renderWord = (word: string, index: number, isGhost: boolean) => {
    if (isGhost) {
      return (
        <span key={`ghost-${index}`} className="inline-block">
          {word}
          {index < totalWords - 1 && " "}
        </span>
      );
    }

    // Calculate individual word reveal progress.
    const wordRevealProgress = Math.max(
      0,
      Math.min(
        1,
        (normalizedProgress * (totalWords + 3) - index) * (isMobile ? 2 : 1.5)
      )
    );

    return (
      <span key={`reveal-${index}`} className="inline-block">
        <span
          className="text-white"
          style={{
            opacity: wordRevealProgress,
            transition: "opacity 0.15s ease-out",
          }}
        >
          {word}
          {index < totalWords - 1 && " "}
        </span>
      </span>
    );
  };

  return (
    <div className={textAlignmentClasses}>
      {/* Hidden text for layout */}
      <p className={cn("invisible", textStyles)}>{words.join(" ")}</p>
      {/* Visible text */}
      <div className="absolute top-0 left-0 right-0">
        <p className={textStyles}>
          <span className="absolute top-0 left-0 right-0 text-white/20">
            {words.map((word, i) => renderWord(word, i, true))}
          </span>
          <span className="relative">
            {words.map((word, i) => renderWord(word, i, false))}
          </span>
        </p>
      </div>
    </div>
  );
};
