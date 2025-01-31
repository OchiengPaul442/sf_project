import type React from "react";
import { isMobileDevice } from "@/utils/deviceDetection";

interface TextRevealProps {
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

  // Calculate progress within the specified range
  const progress = Math.max(
    0,
    Math.min(1, (scrollYProgress - range[0]) / (range[1] - range[0]))
  );

  const characters = text.split("");
  const totalChars = characters.length;

  return (
    <div
      className={`relative ${align === "right" ? "text-right" : "text-left"}`}
    >
      <p
        className="invisible text-2xl sm:text-3xl md:text-4xl lg:text-[4rem] 
                   font-medium leading-[1.4] sm:leading-[1.5] md:leading-[1.55] tracking-normal"
      >
        {text}
      </p>

      <div className="absolute top-0 left-0 right-0">
        <p
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[4rem] 
                     font-medium leading-[1.4] sm:leading-[1.5] md:leading-[1.55]
                     tracking-normal"
        >
          <span className="absolute top-0 left-0 right-0 text-white/20">
            {characters.map((char, i) => (
              <span
                key={`ghost-${i}`}
                className="inline-block"
                style={{
                  width: char === " " ? "0.25em" : "auto",
                }}
              >
                {char}
              </span>
            ))}
          </span>

          <span className="relative">
            {characters.map((char, i) => {
              // Calculate the reveal progress for each character
              const charRevealProgress = Math.max(
                0,
                Math.min(
                  1,
                  (progress * (totalChars + 10) - i) * (isMobile ? 2 : 1.5)
                )
              );

              return (
                <span
                  key={`reveal-${i}`}
                  className="inline-block relative"
                  style={{
                    width: char === " " ? "0.25em" : "auto",
                  }}
                >
                  <span
                    className="text-white"
                    style={{
                      opacity: charRevealProgress,
                      transition: "opacity 0.1s ease-out",
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        </p>
      </div>
    </div>
  );
};
