import { getChatHistory } from "@/lib/server/chat-store";
import { resolveViewerIdentity } from "@/lib/server/viewer";

export async function GET(request: Request) {
  const viewer = await resolveViewerIdentity(request);
  const history = await getChatHistory(viewer);
  return Response.json({ messages: history });
}
