import React, { useEffect, useMemo, useRef, useState } from "react";
import { isMobileDevice } from "@/utils/deviceDetection";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  progress: number;
  range?: [number, number];
  align?: "left" | "right";
  className?: string;
}

const TextReveal = React.memo(
  ({
    text,
    progress,
    range = [0, 1],
    align = "left",
    className,
  }: TextRevealProps) => {
    const isMobile = isMobileDevice();
    const containerRef = useRef<HTMLDivElement>(null);
    const [lineBreaks, setLineBreaks] = useState<number[]>([]);

    // Normalize the progress value based on the provided range.
    const normalizedProgress = useMemo(
      () =>
        Math.max(0, Math.min(1, (progress - range[0]) / (range[1] - range[0]))),
      [progress, range]
    );

    // Split text into words and spaces while preserving whitespace.
    const words = useMemo(() => {
      const matches = text.match(/\S+|\s+/g) || [];
      return matches.map((word, index) => ({
        text: word,
        id: `word-${index}`,
        isSpace: /^\s+$/.test(word),
      }));
    }, [text]);

    // Detect line breaks by checking the top position of each word span.
    useEffect(() => {
      if (!containerRef.current) return;

      const detectLineBreaks = () => {
        const container = containerRef.current;
        if (!container) return;

        const spans = container.querySelectorAll<HTMLSpanElement>(".word-span");
        const breaks: number[] = [];
        let previousTop: number | null = null;

        spans.forEach((span, index) => {
          const rect = span.getBoundingClientRect();
          if (previousTop !== null && rect.top > previousTop + 1) {
            // A new line has started.
            breaks.push(index);
          }
          previousTop = rect.top;
        });

        // Include 0 and the total word count as breakpoints.
        setLineBreaks([0, ...breaks, spans.length]);
      };

      // Run initial detection.
      detectLineBreaks();

      // Re-run detection on window resize.
      window.addEventListener("resize", detectLineBreaks);
      return () => window.removeEventListener("resize", detectLineBreaks);
    }, [words]);

    /**
     * Group the words into lines based on lineBreaks.
     * Each group represents a line and contains the words in that line.
     */
    const linesGrouped = useMemo(() => {
      if (lineBreaks.length < 2) return [];
      const lines = [];
      for (let i = 0; i < lineBreaks.length - 1; i++) {
        const start = lineBreaks[i];
        const end = lineBreaks[i + 1];
        const lineWords = words.slice(start, end);
        // Calculate the total number of letters (ignoring whitespace) in the line.
        const totalLetters = lineWords.reduce((acc, word) => {
          return acc + (word.isSpace ? 0 : word.text.length);
        }, 0);
        lines.push({ lineWords, totalLetters });
      }
      return lines;
    }, [lineBreaks, words]);

    // Determine the total number of lines.
    const totalLines = linesGrouped.length || 1;
    // Each line occupies an equal fraction of the normalized progress.
    const lineSlot = 1 / totalLines;

    /**
     * Renders the reveal layer by grouping letters per line.
     * For each line, the reveal is computed so that as lineProgress increases
     * (from 0 to 1), letters are revealed sequentially from left to right.
     */
    const renderRevealLayer = () => {
      if (linesGrouped.length === 0) {
        // Fallback: if no grouping is available yet, simply render words.
        return words.map((word) => {
          // For whitespace, just show the text.
          if (word.isSpace) {
            return (
              <span
                key={`reveal-${word.id}`}
                className="inline-block word-span whitespace-pre"
              >
                {word.text}
              </span>
            );
          }
          // Otherwise, split into letters with a basic reveal.
          const letters = word.text.split("");
          return (
            <span key={`reveal-${word.id}`} className="inline-block word-span">
              {letters.map((letter, j) => (
                <span
                  key={`reveal-${word.id}-letter-${j}`}
                  style={{
                    opacity: normalizedProgress,
                    transition: "opacity 0.3s ease-out",
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          );
        });
      }

      return linesGrouped.map((line, lineIndex) => {
        // Calculate the reveal progress for this line.
        const lineProgress = Math.max(
          0,
          Math.min(1, (normalizedProgress - lineIndex * lineSlot) / lineSlot)
        );
        // For each line, we need a running counter of letters (ignoring whitespace)
        let letterCounter = 0;
        return (
          // Use a span for each line.
          <span key={`line-${lineIndex}`} className="inline-block">
            {line.lineWords.map((word) => {
              if (word.isSpace) {
                // Render spaces normally.
                return (
                  <span
                    key={`reveal-${word.id}`}
                    className="inline-block word-span whitespace-pre"
                  >
                    {word.text}
                  </span>
                );
              }
              // Split the word into letters.
              const letters = word.text.split("");
              return (
                <span
                  key={`reveal-${word.id}`}
                  className="inline-block word-span"
                >
                  {letters.map((letter, letterIndex) => {
                    // Compute a reveal value that starts at the first letter and progresses smoothly.
                    // Here, we treat the entire line as a sequence of letters.
                    const revealAmount = Math.max(
                      0,
                      Math.min(
                        1,
                        lineProgress * line.totalLetters - letterCounter
                      )
                    );
                    letterCounter++;
                    return (
                      <span
                        key={`reveal-${word.id}-letter-${letterIndex}`}
                        style={{
                          opacity: revealAmount,
                          transition: "opacity 0.3s ease-out",
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </span>
        );
      });
    };

    // Base text styles.
    const textStyles = cn(
      "text-2xl sm:text-3xl md:text-4xl lg:text-[3.38rem]",
      "font-normal leading-[1.4] sm:leading-[1.45] md:leading-[1.35]",
      "tracking-tight break-words"
    );

    // Container alignment classes.
    const containerClasses = cn(
      "relative",
      {
        "text-left sm:text-right": align === "right" && !isMobile,
        "text-left": isMobile || align === "left",
      },
      className
    );

    return (
      <div className={containerClasses} ref={containerRef}>
        {/*
          Render an invisible placeholder to preserve layout.
        */}
        <p className={cn("invisible", textStyles)}>{text}</p>
        <div className="absolute top-0 left-0 right-0">
          <p className={textStyles}>
            {/*
              Ghost Layer: Shows the full text in low opacity.
            */}
            <span className="absolute top-0 left-0 right-0 text-white/20">
              {words.map((word) => (
                <span
                  key={`ghost-${word.id}`}
                  className={cn("inline-block word-span", {
                    "whitespace-pre": word.isSpace,
                  })}
                >
                  {word.text}
                </span>
              ))}
            </span>
            {/*
              Reveal Layer: Animates letters by line.
            */}
            <span className="relative">{renderRevealLayer()}</span>
          </p>
        </div>
      </div>
    );
  }
);

TextReveal.displayName = "TextReveal";
export { TextReveal };
