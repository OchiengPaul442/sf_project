import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  progress: number;
  range?: [number, number];
  align?: "left" | "right";
  className?: string;
}

/**
 * A simplified TextReveal that:
 * 1) Cleans up any newlines from the text (turns them into spaces).
 * 2) Renders a letter-by-letter reveal in one continuous paragraph.
 * 3) Lets the browser handle natural line breaks (no forced splits).
 */
const TextReveal = memo(function TextReveal({
  text,
  progress,
  range = [0, 1],
  align = "left",
  className,
}: TextRevealProps) {
  // Clamp progress to [0..1]
  const [start, end] = range;
  const t = (progress - start) / (end - start);
  const normalizedProgress = Math.max(0, Math.min(1, t));

  // Remove any embedded newlines
  const sanitizedText = useMemo(() => text.replace(/\s*\n\s*/g, " "), [text]);

  // Split into individual characters (including spaces)
  const letters = useMemo(() => sanitizedText.split(""), [sanitizedText]);

  // Count how many non-space letters we have (for letter-based reveal)
  const totalLetters = useMemo(
    () => letters.filter((ch) => !/\s/.test(ch)).length,
    [letters]
  );

  // Basic styling
  const textStyles = cn(
    "text-xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[3.38rem]",
    "font-normal leading-[1.3] sm:leading-[1.35] md:leading-[1.4] lg:leading-[1.35]",
    "tracking-tight whitespace-normal" // Let the container’s width dictate line breaks
  );

  const containerClasses = cn(
    align === "right" ? "text-right" : "text-left",
    className,
    "relative w-full"
  );

  let revealedCount = 0;

  return (
    <div className={containerClasses}>
      <div className={cn(textStyles, "relative z-10")}>
        {letters.map((char, i) => {
          if (/\s/.test(char)) {
            // For spaces, just render a space with no reveal effect
            return <span key={i}>{char}</span>;
          }

          // Each time we hit a non-space character, increment revealedCount
          revealedCount++;
          // Reveal factor for this specific letter
          const revealAmount = Math.max(
            0,
            Math.min(1, normalizedProgress * totalLetters - (revealedCount - 1))
          );

          return (
            <span key={i} className="relative inline-block">
              {/* Ghost letter behind (faded) */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.25)" }}
                aria-hidden="true"
              >
                {char}
              </span>
              {/* Actual reveal letter */}
              <span
                style={{
                  opacity: revealAmount,
                  transition: "opacity 0.3s ease-out",
                }}
              >
                {char}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
