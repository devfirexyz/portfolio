import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-2 text-sm text-[var(--nb-foreground)] placeholder:text-[var(--nb-foreground-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
