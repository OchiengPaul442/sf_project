import React, { useEffect, useMemo, useRef, useState } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [lineBreaks, setLineBreaks] = useState<number[]>([]);

    const normalizedProgress = useMemo(
      () =>
        Math.max(0, Math.min(1, (progress - range[0]) / (range[1] - range[0]))),
      [progress, range]
    );

    const words = useMemo(() => {
      const matches = text.match(/\S+|\s+/g) || [];
      return matches.map((word, index) => ({
        text: word,
        id: `word-${index}`,
        isSpace: /^\s+$/.test(word),
      }));
    }, [text]);

    // Improved line break detection with ResizeObserver
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
          if (previousTop !== null && Math.abs(rect.top - previousTop) > 2) {
            breaks.push(index);
          }
          previousTop = rect.top;
        });

        setLineBreaks([0, ...breaks, spans.length]);
      };

      // Use ResizeObserver for more reliable layout detection
      const resizeObserver = new ResizeObserver(detectLineBreaks);
      resizeObserver.observe(containerRef.current);

      // Initial detection
      detectLineBreaks();

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, [words]);

    const linesGrouped = useMemo(() => {
      if (lineBreaks.length < 2) return [];
      const lines = [];
      for (let i = 0; i < lineBreaks.length - 1; i++) {
        const start = lineBreaks[i];
        const end = lineBreaks[i + 1];
        const lineWords = words.slice(start, end);
        const totalLetters = lineWords.reduce(
          (acc, word) => acc + (word.isSpace ? 0 : word.text.length),
          0
        );
        lines.push({ lineWords, totalLetters });
      }
      return lines;
    }, [lineBreaks, words]);

    const totalLines = linesGrouped.length || 1;
    const lineSlot = 1 / totalLines;

    const renderRevealLayer = () => {
      if (linesGrouped.length === 0) {
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

    // Increased responsive typography for mobile.
    // Mobile base size updated from text-lg to text-xl and small breakpoint from text-2xl to text-3xl.
    const textStyles = cn(
      "text-xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[3.38rem]",
      "font-normal leading-[1.3] sm:leading-[1.35] md:leading-[1.4] lg:leading-[1.35]",
      "tracking-tight break-words"
    );

    // Apply text alignment based on the 'align' prop
    const containerClasses = cn(
      "relative",
      align === "right" ? "text-right" : "text-left",
      className
    );

    return (
      <div className={containerClasses} ref={containerRef}>
        <p className={cn("invisible", textStyles)}>{text}</p>
        <div className="absolute top-0 left-0 right-0">
          <p className={textStyles}>
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
            <span className="relative">{renderRevealLayer()}</span>
          </p>
        </div>
      </div>
    );
  }
);

TextReveal.displayName = "TextReveal";
export { TextReveal };
