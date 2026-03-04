import { getChatStatus } from "@/lib/server/chat-store";
import { resolveViewerIdentity } from "@/lib/server/viewer";

export async function GET(request: Request) {
  const viewer = await resolveViewerIdentity(request);
  const status = await getChatStatus(viewer);

  return Response.json({ ...status, identityKey: viewer.identityKey });
}
