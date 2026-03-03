import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const hasClerkConfig = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const authMiddleware = hasClerkConfig ? clerkMiddleware() : null;
const bypassAuthMiddleware = process.env.CHAT_ALLOW_DEV_VIEWER_HEADER === "1";

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (bypassAuthMiddleware || !authMiddleware) {
    return NextResponse.next();
  }
  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/chat(.*)", "/api/chat(.*)"],
};
