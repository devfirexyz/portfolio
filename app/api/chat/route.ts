import { randomUUID } from "node:crypto";

import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { streamPortfolioResponse } from "@/lib/agents/portfolio-agent";
import { validatePromptInput } from "@/lib/guardrails/chat-guardrails";
import {
  persistAssistantResponse,
  preparePromptRequest,
  type ChatStatusReason,
} from "@/lib/server/chat-store";
import {
  extractAssistantTextFromMessage,
  extractLastUserPrompt,
} from "@/lib/server/chat-message-utils";
import { resolveViewerIdentity } from "@/lib/server/viewer";

export const maxDuration = 30;
const TEST_STATIC_ASSISTANT = "Test assistant response.";

const requestSchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
  requestMetadata: z
    .object({
      clientMessageId: z.string().optional(),
      threadClientId: z.string().optional(),
      threadMemory: z.string().max(1200).optional(),
    })
    .optional(),
});

function staticAssistantStream(params: {
  messages: UIMessage[];
  text: string;
  reason:
    | ChatStatusReason
    | "too_many_requests"
    | "unsafe_input"
    | "input_too_long"
    | "thread_prompt_limit_reached";
}) {
  return createUIMessageStreamResponse({
    headers: {
      "x-chat-reason": params.reason,
    },
    stream: createUIMessageStream({
      originalMessages: params.messages,
      execute: ({ writer }) => {
        const textId = `static-${randomUUID()}`;
        writer.write({ type: "text-start", id: textId });
        writer.write({ type: "text-delta", id: textId, delta: params.text });
        writer.write({ type: "text-end", id: textId });
      },
    }),
  });
}

export async function POST(request: Request) {
  const parsedBody = requestSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return Response.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const { messages, requestMetadata } = parsedBody.data;
  const prompt = extractLastUserPrompt(messages);
  const clientMessageId = requestMetadata?.clientMessageId ?? randomUUID();
  const threadClientId = requestMetadata?.threadClientId ?? "default";

  const guardrail = validatePromptInput(prompt);
  if (!guardrail.ok) {
    return staticAssistantStream({
      messages,
      text: guardrail.message ?? "Prompt rejected by guardrails.",
      reason: guardrail.reason,
    });
  }

  const viewer = await resolveViewerIdentity(request);

  const prepareResult = await preparePromptRequest({
    viewer,
    prompt,
    clientMessageId,
    threadClientId,
    now: Date.now(),
  });

  if (prepareResult.type === "blocked") {
    return staticAssistantStream({
      messages,
      text: prepareResult.message,
      reason: prepareResult.reason,
    });
  }

  if (prepareResult.type === "guest-static") {
    return staticAssistantStream({
      messages,
      text: prepareResult.responseText,
      reason: "guest_prompt_used",
    });
  }

  if (prepareResult.type === "duplicate" && prepareResult.assistantText) {
    return staticAssistantStream({
      messages,
      text: prepareResult.assistantText,
      reason: "ok",
    });
  }

  if (process.env.CHAT_TEST_STATIC_ASSISTANT === "1") {
    const text = TEST_STATIC_ASSISTANT;
    await persistAssistantResponse({
      viewer,
      threadId: prepareResult.threadId,
      clientMessageId,
      text,
      model: "test/static",
      usedFallbackModel: false,
      now: Date.now(),
    });

    return staticAssistantStream({
      messages,
      text,
      reason: "ok",
    });
  }

  const { result, usedFallbackModel, model } = await streamPortfolioResponse(messages, {
    memoryContext: requestMetadata?.threadMemory,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ responseMessage, isAborted }) => {
      if (isAborted) {
        return;
      }

      const assistantText = extractAssistantTextFromMessage(responseMessage);

      await persistAssistantResponse({
        viewer,
        threadId: prepareResult.threadId,
        clientMessageId,
        text: assistantText,
        model,
        usedFallbackModel,
        now: Date.now(),
      });
    },
  });
}
