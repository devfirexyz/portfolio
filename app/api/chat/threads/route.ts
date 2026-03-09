import { getChatThreads } from "@/lib/server/chat-store";
import { resolveViewerIdentity } from "@/lib/server/viewer";

export async function GET(request: Request) {
  const viewer = await resolveViewerIdentity(request);
  const threads = await getChatThreads(viewer);
  return Response.json({ threads });
}
