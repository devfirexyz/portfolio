import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return children;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
