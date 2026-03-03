import { randomUUID } from "node:crypto";

import type { UIMessage } from "ai";
import { z } from "zod";

import { generatePortfolioResponse } from "@/lib/agents/portfolio-agent";
import { validatePromptInput } from "@/lib/guardrails/chat-guardrails";
import {
  getChatStatus,
  persistAssistantResponse,
  preparePromptRequest,
} from "@/lib/server/chat-store";
import { resolveViewerIdentity } from "@/lib/server/viewer";

const syncRequestSchema = z.object({
  items: z
    .array(
      z.object({
        clientMessageId: z.string(),
        text: z.string(),
        threadClientId: z.string().optional(),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  const payload = syncRequestSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: "Invalid sync payload." }, { status: 400 });
  }

  const viewer = await resolveViewerIdentity(request);
  if (viewer.viewerType === "guest") {
    return Response.json({ error: "Offline sync is available for logged in users only." }, { status: 403 });
  }

  const results: Array<
    | {
        clientMessageId: string;
        status: "accepted";
        assistantText: string;
      }
    | {
        clientMessageId: string;
        status: "duplicate";
        assistantText: string;
      }
    | {
        clientMessageId: string;
        status: "rejected_limit" | "rejected_guardrail" | "rejected_other";
        reason: string;
      }
  > = [];

  for (const item of payload.data.items) {
    const guardrail = validatePromptInput(item.text);
    if (!guardrail.ok) {
      results.push({
        clientMessageId: item.clientMessageId,
        status: "rejected_guardrail",
        reason: guardrail.reason,
      });
      continue;
    }

    const prepareResult = await preparePromptRequest({
      viewer,
      prompt: item.text,
      clientMessageId: item.clientMessageId,
      threadClientId: item.threadClientId ?? "default",
      now: Date.now(),
    });

    if (prepareResult.type === "blocked") {
      const status = prepareResult.reason === "lifetime_limit_reached" ? "rejected_limit" : "rejected_other";
      results.push({
        clientMessageId: item.clientMessageId,
        status,
        reason: prepareResult.reason,
      });

      if (prepareResult.reason === "lifetime_limit_reached") {
        break;
      }

      continue;
    }

    if (prepareResult.type === "duplicate") {
      results.push({
        clientMessageId: item.clientMessageId,
        status: "duplicate",
        assistantText: prepareResult.assistantText ?? "This message was already synced.",
      });
      continue;
    }

    if (prepareResult.type === "guest-static") {
      results.push({
        clientMessageId: item.clientMessageId,
        status: "rejected_other",
        reason: "guest_prompt_used",
      });
      continue;
    }

    if (process.env.CHAT_TEST_STATIC_ASSISTANT === "1") {
      const assistantText = "Test assistant sync response.";
      await persistAssistantResponse({
        viewer,
        threadId: prepareResult.threadId,
        clientMessageId: item.clientMessageId,
        text: assistantText,
        model: "test/static",
        usedFallbackModel: false,
        now: Date.now(),
      });

      results.push({
        clientMessageId: item.clientMessageId,
        status: "accepted",
        assistantText,
      });
      continue;
    }

    const generated = await generatePortfolioResponse([
      {
        id: randomUUID(),
        role: "user",
        parts: [{ type: "text", text: item.text }],
      } as UIMessage,
    ]);

    await persistAssistantResponse({
      viewer,
      threadId: prepareResult.threadId,
      clientMessageId: item.clientMessageId,
      text: generated.text,
      model: generated.model,
      usedFallbackModel: generated.usedFallbackModel,
      now: Date.now(),
    });

    results.push({
      clientMessageId: item.clientMessageId,
      status: "accepted",
      assistantText: generated.text,
    });
  }

  const status = await getChatStatus(viewer);
  return Response.json({ results, status });
}
