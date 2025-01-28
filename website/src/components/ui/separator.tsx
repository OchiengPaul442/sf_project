"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

interface GradientSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  gradientColors?: string[];
  leftThickness?: number;
  rightThickness?: number;
}

const GradientSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  GradientSeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      gradientColors = ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"],
      leftThickness = 2,
      rightThickness = 1,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <div className={cn("relative w-full", className)}>
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn("absolute inset-0", isHorizontal ? "w-full" : "h-full")}
          style={{
            background: `linear-gradient(to right, 
              ${gradientColors[0]} 0%, 
              ${gradientColors[0]} 50%, 
              ${gradientColors[1]} 100%)`,
            height: isHorizontal ? `${leftThickness}px` : "100%",
            clipPath: isHorizontal
              ? `polygon(
                  0 0, 
                  100% 0, 
                  100% ${rightThickness}px, 
                  0 ${leftThickness}px
                )`
              : undefined,
          }}
          {...props}
        />
      </div>
    );
  }
);

GradientSeparator.displayName = "GradientSeparator";

export { GradientSeparator };
