import type React from "react";

import { cn } from "@/lib/utils";

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function NeoCard({
  className,
  elevated = true,
  children,
  ...props
}: NeoCardProps) {
  return (
    <div
      className={cn(
        "border-2 border-[var(--nb-border)] bg-[var(--nb-surface)]",
        elevated
          ? "shadow-[8px_8px_0px_0px_var(--nb-shadow-color)]"
          : "shadow-[4px_4px_0px_0px_var(--nb-shadow-color)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
