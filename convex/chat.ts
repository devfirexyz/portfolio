import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

const query = queryGeneric;
const mutation = mutationGeneric;

const statusValidator = v.object({
  viewerType: v.union(v.literal("guest"), v.literal("member"), v.literal("owner")),
  canSend: v.boolean(),
  reason: v.union(v.literal("ok"), v.literal("guest_prompt_used"), v.literal("lifetime_limit_reached")),
  guestPromptUsed: v.boolean(),
  lifetimeUsed: v.union(v.number(), v.null()),
  lifetimeLimit: v.union(v.number(), v.null()),
});

const preparePromptResultValidator = v.union(
  v.object({
    type: v.literal("blocked"),
    reason: v.union(
      v.literal("ok"),
      v.literal("guest_prompt_used"),
      v.literal("lifetime_limit_reached"),
      v.literal("too_many_requests"),
      v.literal("thread_prompt_limit_reached")
    ),
    message: v.string(),
    statusCode: v.number(),
    status: statusValidator,
  }),
  v.object({
    type: v.literal("guest-static"),
    threadId: v.string(),
    status: statusValidator,
    responseText: v.string(),
  }),
  v.object({
    type: v.literal("accepted"),
    threadId: v.string(),
    status: statusValidator,
  }),
  v.object({
    type: v.literal("duplicate"),
    threadId: v.string(),
    status: statusValidator,
    assistantText: v.union(v.string(), v.null()),
    model: v.union(v.string(), v.null()),
  })
);

const historyMessageValidator = v.object({
  id: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant")),
  text: v.string(),
  clientMessageId: v.string(),
  threadClientId: v.string(),
  createdAt: v.number(),
  model: v.union(v.string(), v.null()),
});

function normalizeViewerType(args: {
  viewerType: "guest" | "member" | "owner";
  userId?: string;
  ownerIds: string[];
}): "guest" | "member" | "owner" {
  if (args.userId && args.ownerIds.includes(args.userId)) {
    return "owner";
  }
  return args.viewerType;
}

function buildStatus(params: {
  viewerType: "guest" | "member" | "owner";
  guestPromptUsed: boolean;
  lifetimePromptCount: number;
  lifetimeLimit: number;
}) {
  if (params.viewerType === "guest") {
    return {
      viewerType: "guest" as const,
      canSend: !params.guestPromptUsed,
      reason: (params.guestPromptUsed ? "guest_prompt_used" : "ok") as
        | "ok"
        | "guest_prompt_used"
        | "lifetime_limit_reached",
      guestPromptUsed: params.guestPromptUsed,
      lifetimeUsed: null,
      lifetimeLimit: null,
    };
  }

  if (params.viewerType === "owner") {
    return {
      viewerType: "owner" as const,
      canSend: true,
      reason: "ok" as const,
      guestPromptUsed: false,
      lifetimeUsed: params.lifetimePromptCount,
      lifetimeLimit: null,
    };
  }

  const reachedLimit = params.lifetimePromptCount >= params.lifetimeLimit;
  return {
    viewerType: "member" as const,
    canSend: !reachedLimit,
    reason: (reachedLimit ? "lifetime_limit_reached" : "ok") as
      | "ok"
      | "guest_prompt_used"
      | "lifetime_limit_reached",
    guestPromptUsed: false,
    lifetimeUsed: params.lifetimePromptCount,
    lifetimeLimit: params.lifetimeLimit,
  };
}

async function getOrCreateUser(ctx: any, args: {
  identityKey: string;
  viewerType: "guest" | "member" | "owner";
  userId?: string;
  now: number;
}) {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_identityKey", (q: any) => q.eq("identityKey", args.identityKey))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, {
      kind: args.viewerType,
      clerkUserId: args.userId,
      updatedAt: args.now,
    });

    return {
      ...existing,
      kind: args.viewerType,
      clerkUserId: args.userId,
      updatedAt: args.now,
    };
  }

  const userId = await ctx.db.insert("users", {
    identityKey: args.identityKey,
    kind: args.viewerType,
    clerkUserId: args.userId,
    lifetimePromptCount: 0,
    guestPromptUsed: false,
    recentPromptTimestamps: [],
    createdAt: args.now,
    updatedAt: args.now,
  });

  return await ctx.db.get(userId);
}

async function getOrCreateThreadByClientId(
  ctx: any,
  params: { identityKey: string; clientThreadId: string; now: number; title?: string }
) {
  const existing = await ctx.db
    .query("threads")
    .withIndex("by_identity_clientThreadId", (q: any) =>
      q.eq("identityKey", params.identityKey).eq("clientThreadId", params.clientThreadId)
    )
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, { updatedAt: params.now });
    return existing;
  }

  const threadId = await ctx.db.insert("threads", {
    identityKey: params.identityKey,
    clientThreadId: params.clientThreadId,
    title: params.title,
    promptCount: 0,
    createdAt: params.now,
    updatedAt: params.now,
  });

  return await ctx.db.get(threadId);
}

export const getThreads = query({
  args: {
    identityKey: v.string(),
  },
  returns: v.array(
    v.object({
      clientThreadId: v.string(),
      title: v.string(),
      promptCount: v.number(),
      lastPreview: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_identityKey", (q) => q.eq("identityKey", args.identityKey))
      .collect();

    const threadResults = await Promise.all(
      threads.map(async (thread) => {
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_thread", (q) => q.eq("threadId", thread._id))
          .order("desc")
          .first();

        return {
          clientThreadId: thread.clientThreadId,
          title: thread.title ?? thread.clientThreadId.slice(0, 20),
          promptCount: thread.promptCount,
          lastPreview: lastMessage ? lastMessage.text.slice(0, 80).trim() : "",
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
        };
      })
    );

    return threadResults.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getThreadMessages = query({
  args: {
    identityKey: v.string(),
    clientThreadId: v.string(),
  },
  returns: v.array(historyMessageValidator),
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_identity_clientThreadId", (q: any) =>
        q.eq("identityKey", args.identityKey).eq("clientThreadId", args.clientThreadId)
      )
      .first();

    if (!thread) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", thread._id))
      .collect();

    return messages
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((message) => ({
        id: String(message._id),
        role: message.role,
        text: message.text,
        clientMessageId: message.clientMessageId,
        threadClientId: thread.clientThreadId,
        createdAt: message.createdAt,
        model: message.model ?? null,
      }));
  },
});

export const getStatus = query({
  args: {
    identityKey: v.string(),
    viewerType: v.union(v.literal("guest"), v.literal("member"), v.literal("owner")),
    userId: v.optional(v.string()),
    ownerIds: v.array(v.string()),
  },
  returns: statusValidator,
  handler: async (ctx, args) => {
    const effectiveViewerType = normalizeViewerType({
      viewerType: args.viewerType,
      userId: args.userId,
      ownerIds: args.ownerIds,
    });

    const user = await ctx.db
      .query("users")
      .withIndex("by_identityKey", (q) => q.eq("identityKey", args.identityKey))
      .first();

    if (!user) {
      return buildStatus({
        viewerType: effectiveViewerType,
        guestPromptUsed: false,
        lifetimePromptCount: 0,
        lifetimeLimit: 30,
      });
    }

    return buildStatus({
      viewerType: effectiveViewerType,
      guestPromptUsed: Boolean(user.guestPromptUsed),
      lifetimePromptCount: Number(user.lifetimePromptCount ?? 0),
      lifetimeLimit: 30,
    });
  },
});

export const getHistory = query({
  args: {
    identityKey: v.string(),
  },
  returns: v.array(historyMessageValidator),
  handler: async (ctx, args) => {
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_identityKey", (q) => q.eq("identityKey", args.identityKey))
      .collect();

    if (threads.length === 0) {
      return [];
    }

    const messageGroups = await Promise.all(
      threads.map(async (thread) => {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_thread", (q) => q.eq("threadId", thread._id))
          .collect();
        return messages.map((message) => ({ message, threadClientId: thread.clientThreadId }));
      })
    );

    return messageGroups
      .flat()
      .sort((left, right) => left.message.createdAt - right.message.createdAt)
      .map(({ message, threadClientId }) => ({
        id: String(message._id),
        role: message.role,
        text: message.text,
        clientMessageId: message.clientMessageId,
        threadClientId,
        createdAt: message.createdAt,
        model: message.model ?? null,
      }));
  },
});

export const preparePrompt = mutation({
  args: {
    identityKey: v.string(),
    viewerType: v.union(v.literal("guest"), v.literal("member"), v.literal("owner")),
    userId: v.optional(v.string()),
    prompt: v.string(),
    clientMessageId: v.string(),
    threadClientId: v.string(),
    now: v.number(),
    ownerIds: v.array(v.string()),
    lifetimeLimit: v.number(),
    threadPromptLimit: v.number(),
    burstLimit: v.number(),
    burstWindowMs: v.number(),
    guestStaticResponse: v.string(),
  },
  returns: preparePromptResultValidator,
  handler: async (ctx, args) => {
    const effectiveViewerType = normalizeViewerType({
      viewerType: args.viewerType,
      userId: args.userId,
      ownerIds: args.ownerIds,
    });

    const user = await getOrCreateUser(ctx, {
      identityKey: args.identityKey,
      viewerType: effectiveViewerType,
      userId: args.userId,
      now: args.now,
    });
    const thread = await getOrCreateThreadByClientId(ctx, {
      identityKey: args.identityKey,
      clientThreadId: args.threadClientId,
      now: args.now,
      title: args.prompt.trim().slice(0, 60),
    });

    const existingMessages = await ctx.db
      .query("messages")
      .withIndex("by_identity_client", (q: any) =>
        q.eq("identityKey", args.identityKey).eq("clientMessageId", args.clientMessageId)
      )
      .collect();

    const assistantDuplicate = existingMessages.find((message: any) => message.role === "assistant");
    if (assistantDuplicate) {
      return {
        type: "duplicate" as const,
        threadId: String(thread._id),
        status: buildStatus({
          viewerType: effectiveViewerType,
          guestPromptUsed: Boolean(user.guestPromptUsed),
          lifetimePromptCount: Number(user.lifetimePromptCount ?? 0),
          lifetimeLimit: args.lifetimeLimit,
        }),
        assistantText: String(assistantDuplicate.text ?? ""),
        model: assistantDuplicate.model ?? null,
      };
    }

    const recentPromptTimestamps = (user.recentPromptTimestamps ?? []).filter(
      (timestamp: number) => args.now - timestamp <= args.burstWindowMs
    );

    if (recentPromptTimestamps.length >= args.burstLimit) {
      return {
        type: "blocked" as const,
        reason: "too_many_requests" as const,
        message: "Too many requests in a short time. Please wait a few seconds and retry.",
        statusCode: 429,
        status: buildStatus({
          viewerType: effectiveViewerType,
          guestPromptUsed: Boolean(user.guestPromptUsed),
          lifetimePromptCount: Number(user.lifetimePromptCount ?? 0),
          lifetimeLimit: args.lifetimeLimit,
        }),
      };
    }

    if (effectiveViewerType === "guest") {
      if (user.guestPromptUsed) {
        return {
          type: "blocked" as const,
          reason: "guest_prompt_used" as const,
          message: "Guest prompt already used. Please log in to continue.",
          statusCode: 403,
          status: buildStatus({
            viewerType: effectiveViewerType,
            guestPromptUsed: true,
            lifetimePromptCount: 0,
            lifetimeLimit: args.lifetimeLimit,
          }),
        };
      }

      await ctx.db.patch(user._id, {
        guestPromptUsed: true,
        recentPromptTimestamps: [...recentPromptTimestamps, args.now],
        updatedAt: args.now,
      });
      await ctx.db.patch(thread._id, {
        promptCount: Number(thread.promptCount ?? 0) + 1,
        updatedAt: args.now,
      });

      await ctx.db.insert("messages", {
        threadId: thread._id,
        identityKey: args.identityKey,
        clientMessageId: args.clientMessageId,
        role: "user",
        text: args.prompt,
        createdAt: args.now,
      });

      await ctx.db.insert("messages", {
        threadId: thread._id,
        identityKey: args.identityKey,
        clientMessageId: args.clientMessageId,
        role: "assistant",
        text: args.guestStaticResponse,
        createdAt: args.now,
      });

      await ctx.db.insert("chat_audit", {
        identityKey: args.identityKey,
        clientMessageId: args.clientMessageId,
        outcome: "guest_static",
        reason: "guest_prompt_used",
        createdAt: args.now,
      });

      return {
        type: "guest-static" as const,
        threadId: String(thread._id),
        status: buildStatus({
          viewerType: "guest",
          guestPromptUsed: true,
          lifetimePromptCount: 0,
          lifetimeLimit: args.lifetimeLimit,
        }),
        responseText: args.guestStaticResponse,
      };
    }

    const currentLifetimeCount = Number(user.lifetimePromptCount ?? 0);
    if (effectiveViewerType === "member" && currentLifetimeCount >= args.lifetimeLimit) {
      await ctx.db.insert("chat_audit", {
        identityKey: args.identityKey,
        clientMessageId: args.clientMessageId,
        outcome: "rejected_limit",
        reason: "lifetime_limit_reached",
        createdAt: args.now,
      });

      return {
        type: "blocked" as const,
        reason: "lifetime_limit_reached" as const,
        message: "You have reached the 30-message lifetime limit. Please contact me via email.",
        statusCode: 403,
        status: buildStatus({
          viewerType: effectiveViewerType,
          guestPromptUsed: false,
          lifetimePromptCount: currentLifetimeCount,
          lifetimeLimit: args.lifetimeLimit,
        }),
      };
    }

    const currentThreadPromptCount = Number(thread.promptCount ?? 0);
    if (currentThreadPromptCount >= args.threadPromptLimit) {
      await ctx.db.insert("chat_audit", {
        identityKey: args.identityKey,
        clientMessageId: args.clientMessageId,
        outcome: "rejected_other",
        reason: "thread_prompt_limit_reached",
        createdAt: args.now,
      });

      return {
        type: "blocked" as const,
        reason: "thread_prompt_limit_reached" as const,
        message: `This chat thread reached the ${args.threadPromptLimit}-prompt limit. Please create a new chat thread.`,
        statusCode: 403,
        status: buildStatus({
          viewerType: effectiveViewerType,
          guestPromptUsed: false,
          lifetimePromptCount: currentLifetimeCount,
          lifetimeLimit: args.lifetimeLimit,
        }),
      };
    }

    const nextCount = effectiveViewerType === "member" ? currentLifetimeCount + 1 : currentLifetimeCount;

    await ctx.db.patch(user._id, {
      lifetimePromptCount: nextCount,
      recentPromptTimestamps: [...recentPromptTimestamps, args.now],
      updatedAt: args.now,
    });
    await ctx.db.patch(thread._id, {
      promptCount: currentThreadPromptCount + 1,
      updatedAt: args.now,
    });

    await ctx.db.insert("messages", {
      threadId: thread._id,
      identityKey: args.identityKey,
      clientMessageId: args.clientMessageId,
      role: "user",
      text: args.prompt,
      createdAt: args.now,
    });

    await ctx.db.insert("chat_audit", {
      identityKey: args.identityKey,
      clientMessageId: args.clientMessageId,
      outcome: "accepted",
      createdAt: args.now,
    });

    return {
      type: "accepted" as const,
      threadId: String(thread._id),
      status: buildStatus({
        viewerType: effectiveViewerType,
        guestPromptUsed: false,
        lifetimePromptCount: nextCount,
        lifetimeLimit: args.lifetimeLimit,
      }),
    };
  },
});

export const persistAssistant = mutation({
  args: {
    identityKey: v.string(),
    viewerType: v.union(v.literal("guest"), v.literal("member"), v.literal("owner")),
    userId: v.optional(v.string()),
    threadId: v.string(),
    clientMessageId: v.string(),
    text: v.string(),
    model: v.string(),
    usedFallbackModel: v.boolean(),
    now: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingAssistant = await ctx.db
      .query("messages")
      .withIndex("by_identity_client", (q: any) =>
        q.eq("identityKey", args.identityKey).eq("clientMessageId", args.clientMessageId)
      )
      .collect();

    if (existingAssistant.some((message) => message.role === "assistant")) {
      return null;
    }

    const normalizedThreadId = ctx.db.normalizeId("threads", args.threadId);
    const thread = normalizedThreadId ? await ctx.db.get(normalizedThreadId) : null;
    if (!thread) {
      return null;
    }
    await ctx.db.insert("messages", {
      threadId: thread._id,
      identityKey: args.identityKey,
      clientMessageId: args.clientMessageId,
      role: "assistant",
      text: args.text,
      model: args.model,
      createdAt: args.now,
    });

    await ctx.db.insert("chat_audit", {
      identityKey: args.identityKey,
      clientMessageId: args.clientMessageId,
      outcome: "accepted",
      model: args.model,
      fallbackUsed: args.usedFallbackModel,
      createdAt: args.now,
    });

    return null;
  },
});
