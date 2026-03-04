# Chat Feature Plan v4

## Purpose
Build a `/chat` experience for the portfolio that is fast, neo-brutalist, policy-driven, and local-first for logged-in users.

## Product Policy
1. Guest users:
- Exactly 1 lifetime prompt.
- First prompt returns a static login instruction.
- No model invocation for that first guest prompt.
- Any additional guest prompt is blocked.

2. Logged-in users:
- 30 lifetime prompts total.
- Prompt #31 and beyond are blocked.
- On limit reached, input is disabled and `ContactFormModal` CTA is shown/opened.

3. Model routing:
- Primary: `minimax/minimax-m2.5`
- Fallback: `zai/glm-5`

4. Guardrails:
- Max input size: ~4800 chars (~1200 token estimate).
- Deterministic safety pattern checks before model call.
- Guardrail rejects do not consume lifetime prompt count.

5. Rich response:
- Stream assistant text.
- For project/blog discovery requests, include custom card widgets in-thread.

## Design and UX Constraints
1. Reuse existing neo-brutalist token system from `app/globals.css`.
2. Keep UI language consistent:
- `2px` borders
- hard shadows
- square edges
- uppercase labels
- explicit separators
3. Avoid introducing a second visual system for chat.

## Performance Constraints
1. Route isolation:
- Chat code loads only on `/chat`.
- Dexie code is client-only and not imported into server modules.

2. Streaming efficiency:
- Keep streaming state in-memory in UI.
- Persist to Dexie at checkpoints, not per token chunk.

3. Lazy loading:
- Tool widgets are dynamic client imports.

4. Non-regression:
- Existing performance budgets (`/`, `/blog`, `/blog/hello-world`) must remain green.
- Add `/chat` to the performance budget suite.

## Architecture
1. Server authority:
- Policy, identity type, acceptance, and counters are validated server-side.
- Lifetime count increments only when server accepts a prompt.

2. Client acceleration:
- Dexie stores local messages + outbox queue for logged-in users.
- Local cache is treated as untrusted and always reconciled with server decisions.

3. Sync model:
- Offline logged-in prompts enqueue in outbox with idempotency key (`clientMessageId`).
- On reconnect/foreground/interval, outbox sync sends FIFO batches.
- Server returns per-item sync outcome and current status snapshot.
- Sync stops if lifetime limit is reached mid-batch and marks remaining queued items blocked.

## API Contracts
1. `GET /api/chat/status`
- Returns:
```json
{
  "viewerType": "guest|member|owner",
  "canSend": true,
  "reason": "ok|guest_prompt_used|lifetime_limit_reached",
  "guestPromptUsed": false,
  "lifetimeUsed": 0,
  "lifetimeLimit": 30
}
```

2. `POST /api/chat`
- Request contains `messages` and optional `requestMetadata.clientMessageId`.
- Behavior:
  - guardrail failure -> static reject stream
  - guest first prompt -> static login stream (no AI model call)
  - blocked by policy -> static policy stream
  - accepted -> AI SDK streaming model response + persist assistant text

3. `POST /api/chat/sync`
- Batch sync endpoint for logged-in outbox items.
- Returns per item:
  - `accepted`
  - `duplicate`
  - `rejected_limit`
  - `rejected_guardrail`
  - `rejected_other`

## Data Model
### Runtime local fallback (in-memory server store)
- Users, threads, messages, processed idempotency keys.

### Convex scaffold
- `users`
- `threads`
- `messages`
- `chat_audit`

## Key Implementation Files
1. UI + route:
- `app/chat/page.tsx`
- `components/chat/PortfolioChatSurface.tsx`
- `components/chat/widgets/ProjectCardsWidget.tsx`
- `components/chat/widgets/BlogCardsWidget.tsx`

2. API:
- `app/api/chat/route.ts`
- `app/api/chat/status/route.ts`
- `app/api/chat/sync/route.ts`

3. Server policy + identity:
- `lib/server/chat-store.ts`
- `lib/server/viewer.ts`
- `lib/server/chat-message-utils.ts`
- `lib/guardrails/chat-guardrails.ts`

4. Model + tools:
- `lib/agents/portfolio-agent.ts`
- `lib/tools/get-projects.ts`
- `lib/tools/get-blogs.ts`

5. Dexie local-first:
- `lib/client/chat-cache/db.ts`
- `lib/client/chat-cache/repository.ts`
- `lib/client/chat-cache/sync-engine.ts`
- `lib/client/chat-cache/live.ts`

6. Convex scaffold:
- `convex/schema.ts`
- `convex/chat.ts`

7. Entry + perf:
- `components/home/HeroContent.tsx` (hero CTA to `/chat`)
- `components/home/PortfolioPageClient.tsx`
- `scripts/performance-budget-tests.mjs` (includes `/chat`)

## Verification Checklist
1. Guest first prompt -> static login line, no model call.
2. Guest second prompt -> blocked.
3. Logged-in prompts 1..30 -> accepted.
4. Prompt 31 -> blocked + contact CTA.
5. Offline logged-in prompt -> queued in outbox + optimistic local message.
6. Reconnect -> outbox sync FIFO and idempotent.
7. Guardrail reject -> blocked without consuming lifetime quota.
8. Project/blog queries -> streamed text + custom cards.
9. No SSR IndexedDB access errors.
10. Performance budgets pass including `/chat`.

## Current Status
Implemented in codebase with typecheck and performance checks passing in local run:
1. `pnpm lint` passed.
2. `pnpm build` passed.
3. `pnpm test:perf` passed and `/chat` included.

## Known Follow-up Areas
1. Clerk UX routes/components (e.g., dedicated sign-in page) are not fully scaffolded in this change.
2. Convex scaffold is present; generated Convex bindings and deployment wiring are a separate activation step.
3. Guardrail patterns are intentionally simple baseline filters and can be tightened over time.
