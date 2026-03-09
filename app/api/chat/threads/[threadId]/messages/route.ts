import { getChatThreadMessages } from "@/lib/server/chat-store";
import { resolveViewerIdentity } from "@/lib/server/viewer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const viewer = await resolveViewerIdentity(request);
  const messages = await getChatThreadMessages(viewer, threadId);
  return Response.json({ messages });
}
