import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const neoButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border-2 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--nb-border)] bg-[var(--nb-accent)] text-white shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] hover:bg-[var(--nb-accent-hover)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)]",
        secondary:
          "border-[var(--nb-border)] bg-[var(--nb-surface-strong)] text-[var(--nb-foreground-inverse)] shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] hover:bg-[var(--nb-background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)]",
        ghost:
          "border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] hover:bg-[var(--nb-surface-alt)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_var(--nb-shadow-color)]",
      },
      size: {
        sm: "h-10 px-4 text-[10px]",
        md: "h-12 px-6 text-xs",
        lg: "h-14 px-8 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface NeoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
  asChild?: boolean;
}

export const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(neoButtonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

NeoButton.displayName = "NeoButton";
