import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    identityKey: v.string(),
    kind: v.union(v.literal("guest"), v.literal("member"), v.literal("owner")),
    clerkUserId: v.optional(v.string()),
    lifetimePromptCount: v.number(),
    guestPromptUsed: v.boolean(),
    recentPromptTimestamps: v.array(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_identityKey", ["identityKey"])
    .index("by_clerkUserId", ["clerkUserId"]),

  threads: defineTable({
    identityKey: v.string(),
    clientThreadId: v.string(),
    title: v.optional(v.string()),
    promptCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_identityKey", ["identityKey"])
    .index("by_identity_clientThreadId", ["identityKey", "clientThreadId"]),

  messages: defineTable({
    threadId: v.id("threads"),
    identityKey: v.string(),
    clientMessageId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    text: v.string(),
    model: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_identity_client", ["identityKey", "clientMessageId"]),

  chat_audit: defineTable({
    identityKey: v.string(),
    clientMessageId: v.string(),
    outcome: v.union(
      v.literal("accepted"),
      v.literal("duplicate"),
      v.literal("guest_static"),
      v.literal("rejected_limit"),
      v.literal("rejected_guardrail"),
      v.literal("rejected_other")
    ),
    reason: v.optional(v.string()),
    model: v.optional(v.string()),
    fallbackUsed: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_identity", ["identityKey"])
    .index("by_clientMessageId", ["clientMessageId"]),
});
