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
 * An improved TextReveal that:
 * 1) Cleans up any newlines from the text (turns them into spaces).
 * 2) Preserves whole words to prevent awkward line breaks.
 * 3) Renders a letter-by-letter reveal while maintaining word integrity.
 * 4) Lets the browser handle natural line breaks at word boundaries.
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

  // Remove any embedded newlines and standardize spaces
  const sanitizedText = useMemo(() => text.replace(/\s*\n\s*/g, " "), [text]);

  // Split into words (preserving spaces as separate items)
  const words = useMemo(() => {
    return sanitizedText.split(/(\s+)/).filter(Boolean);
  }, [sanitizedText]);

  // Count total non-space characters for progress calculation
  const totalChars = useMemo(() => {
    return sanitizedText.replace(/\s+/g, "").length;
  }, [sanitizedText]);

  // Basic styling
  const textStyles = cn(
    "text-xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[3.38rem]",
    "font-normal leading-[1.3] sm:leading-[1.35] md:leading-[1.4] lg:leading-[1.35]",
    "tracking-tight"
  );

  const containerClasses = cn(
    align === "right" ? "text-right" : "text-left",
    className,
    "relative w-full"
  );

  // Track how many characters we've processed so far
  let processedChars = 0;

  return (
    <div className={containerClasses}>
      <div className={cn(textStyles, "relative z-10")}>
        {words.map((word, wordIndex) => {
          // If it's a space, just render it directly
          if (/^\s+$/.test(word)) {
            return <span key={`space-${wordIndex}`}>{word}</span>;
          }

          // For actual words, we need to do the character-by-character reveal
          const letters = word.split("");

          return (
            // This wrapper prevents words from breaking across lines
            <span
              key={`word-${wordIndex}`}
              className="inline-block whitespace-nowrap"
            >
              {letters.map((char, charIndex) => {
                processedChars++;
                const revealAmount = Math.max(
                  0,
                  Math.min(
                    1,
                    normalizedProgress * totalChars - (processedChars - 1)
                  )
                );

                return (
                  <span
                    key={`char-${charIndex}`}
                    className="relative inline-block"
                  >
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
            </span>
          );
        })}
      </div>
    </div>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
