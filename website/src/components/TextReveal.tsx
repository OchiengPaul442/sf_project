import React, { useLayoutEffect, useMemo, useRef, useState, memo } from "react";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  progress: number;
  range?: [number, number];
  align?: "left" | "right";
  className?: string;
}

const TextReveal = memo(function TextReveal({
  text,
  progress,
  range = [0, 1],
  align = "left",
  className,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLParagraphElement>(null);
  const [lineBreaks, setLineBreaks] = useState<number[]>([]);

  const normalizedProgress = useMemo(() => {
    const [start, end] = range;
    const clamped = Math.max(
      0,
      Math.min(1, (progress - start) / (end - start))
    );
    return clamped;
  }, [progress, range]);

  // Split text into tokens (words/spaces)
  const words = useMemo(() => {
    const matches = text.match(/\S+|\s+/g) || [];
    return matches.map((word, index) => ({
      text: word,
      id: `word-${index}`,
      isSpace: /^\s+$/.test(word),
    }));
  }, [text]);

  /**
   * UseLayoutEffect to measure line breaks before the browser repaints.
   */
  useLayoutEffect(() => {
    if (!revealRef.current) return;

    const container = revealRef.current;
    const spans = container.querySelectorAll<HTMLSpanElement>(".word-span");
    const breaks: number[] = [];

    let previousTop: number | null = null;

    spans.forEach((span, index) => {
      const rect = span.getBoundingClientRect();
      if (previousTop !== null && rect.top !== previousTop) {
        // If the top position changes (new line), store the index
        breaks.push(index);
      }
      previousTop = rect.top;
    });

    // Always include the start (0) and the end (spans.length)
    setLineBreaks([0, ...breaks, spans.length]);
  }, [words]);

  const linesGrouped = useMemo(() => {
    if (lineBreaks.length < 2) return [];
    const lines = [];

    for (let i = 0; i < lineBreaks.length - 1; i++) {
      const start = lineBreaks[i];
      const end = lineBreaks[i + 1];
      const lineWords = words.slice(start, end);
      const totalLetters = lineWords.reduce(
        (acc, w) => (w.isSpace ? acc : acc + w.text.length),
        0
      );
      lines.push({ lineWords, totalLetters });
    }
    return lines;
  }, [lineBreaks, words]);

  const totalLines = linesGrouped.length || 1;
  const lineSlot = 1 / totalLines;

  /**
   * Renders the letter-by-letter reveal. If line detection fails (empty array),
   * we fall back to a simple “all at once” approach.
   */
  const renderRevealLayer = () => {
    if (linesGrouped.length === 0) {
      // Fallback: fade in all letters at once
      return words.map((word) => (
        <span
          key={`reveal-${word.id}`}
          className={cn("inline-block word-span", {
            "whitespace-pre": word.isSpace,
          })}
        >
          {word.isSpace
            ? word.text
            : word.text.split("").map((letter, j) => (
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
      ));
    }

    return linesGrouped.map((line, lineIndex) => {
      const lineProgress = Math.max(
        0,
        Math.min(1, (normalizedProgress - lineIndex * lineSlot) / lineSlot)
      );

      let letterCounter = 0;

      return (
        <span key={`line-${lineIndex}`} className="inline-block">
          {line.lineWords.map((word) => {
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

            const letters = word.text.split("");
            return (
              <span
                key={`reveal-${word.id}`}
                className="inline-block word-span"
              >
                {letters.map((letter, letterIndex) => {
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

  // Responsive typography
  const textStyles = cn(
    "text-xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[3.38rem]",
    "font-normal leading-[1.3] sm:leading-[1.35] md:leading-[1.4] lg:leading-[1.35]",
    "tracking-tight break-words"
  );

  // Apply alignment
  const containerClasses = cn(
    "relative",
    align === "right" ? "text-right" : "text-left",
    className
  );

  return (
    <div className={containerClasses} ref={containerRef}>
      {/* 
        1) Hidden “ghost” text for consistent line-wrapping measurement.
        2) Positioned absolutely and visibility: hidden so it doesn't interfere with layout. 
      */}
      <p
        className={cn(textStyles, "absolute pointer-events-none m-0 p-0", {
          "right-0": align === "right",
          "left-0": align === "left",
        })}
        style={{ visibility: "hidden", whiteSpace: "pre-wrap" }}
      >
        {text}
      </p>

      {/* Actual reveal text container */}
      <div className="relative top-0 left-0 right-0">
        <p
          className={cn(textStyles, "m-0 p-0 whitespace-pre-wrap")}
          ref={revealRef}
        >
          {/* Light “ghost” overlay to emulate the final text shape.
              We reduce the opacity so that the reveal letters overlay it. */}
          <span
            className="absolute top-0 left-0 right-0 text-white/30 md:text-white/20 pointer-events-none select-none"
            aria-hidden="true"
          >
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

          {/* The reveal layer */}
          <span className="relative">{renderRevealLayer()}</span>
        </p>
      </div>
    </div>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
