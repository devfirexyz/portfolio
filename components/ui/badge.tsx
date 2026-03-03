import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border-2 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--nb-accent)]",
  {
    variants: {
      variant: {
        default: "border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground)]",
        secondary: "border-[var(--nb-border)] bg-[var(--nb-surface-strong)] text-[var(--nb-foreground-inverse)]",
        destructive: "border-[var(--nb-border)] bg-[var(--nb-danger)] text-white",
        outline: "border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
