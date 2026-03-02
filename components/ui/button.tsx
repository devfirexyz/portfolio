import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-accent)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-[var(--nb-border)] bg-[var(--nb-accent)] text-[var(--nb-foreground)] shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]",
        destructive:
          "border-[var(--nb-border)] bg-[var(--nb-danger)] text-white shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]",
        outline:
          "border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-foreground)] shadow-[6px_6px_0px_0px_var(--nb-shadow-color)] hover:bg-[var(--nb-surface-alt)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]",
        secondary:
          "border-[var(--nb-border)] bg-[var(--nb-surface-strong)] text-[var(--nb-foreground-inverse)] shadow-[6px_6px_0px_0px_var(--nb-shadow-accent)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--nb-shadow-accent)]",
        ghost: "border-[var(--nb-border)] bg-transparent text-[var(--nb-foreground)] hover:bg-[var(--nb-surface-alt)]",
        link: "border-transparent p-0 text-[var(--nb-accent-ink)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
