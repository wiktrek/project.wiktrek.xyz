import * as React from "react";

import { cn } from "~/app/_components/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-border/60 bg-muted/40 placeholder:text-muted-foreground/70 hover:border-border focus-visible:border-primary focus-visible:ring-primary/40 flex h-10 w-full rounded-lg border px-3.5 text-base transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
