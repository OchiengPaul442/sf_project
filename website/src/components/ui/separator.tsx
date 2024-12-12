"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const GradientSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <div
      className={cn(
        "relative",
        orientation === "horizontal" ? "h-4 w-full" : "h-full w-4"
      )}
    >
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 absolute left-0 right-0 top-1/2 -translate-y-1/2",
          orientation === "horizontal"
            ? [
                "h-[2px] w-full rounded-l",
                "bg-gradient-to-r from-white via-white to-transparent",
              ]
            : [
                "h-full w-[2px] rounded-t",
                "bg-gradient-to-b from-white via-white to-transparent",
              ],
          className
        )}
        style={{
          clipPath:
            orientation === "horizontal"
              ? "polygon(0 0, 60% 0, 60% 100%, 0 100%, 0 0, 60% 0, 100% 50%, 60% 100%)"
              : "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)",
          backgroundSize: "100% 100%",
          backgroundPosition:
            orientation === "horizontal" ? "0% 50%" : "50% 0%",
        }}
        {...props}
      />
    </div>
  )
);
GradientSeparator.displayName = SeparatorPrimitive.Root.displayName;

export { GradientSeparator };
