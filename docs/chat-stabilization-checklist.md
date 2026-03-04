# Chat Stabilization Checklist

## Core UX Fixes
- [x] Keep chat composer anchored at bottom with independent message scroll area.
- [x] Enter sends prompt, `Shift+Enter` inserts newline.
- [x] Keep guest first prompt + assistant static login response visible in history.
- [x] Show clear auth controls in chat sidebar/header (`Log In`, `Account`, `Log Out`).
- [x] Preserve `Contact Me` CTA in sidebar.

## Thread and History Behavior
- [x] Replace mixed thread state with one thread model in `PortfolioChatSurface`.
- [x] Add explicit thread list in sidebar and active-thread prompt history.
- [x] Enforce `10` prompts per thread in UI and server policy.
- [x] Enforce `30` lifetime prompts for logged-in users.
- [x] Lock guest thread after login and require creating a new logged-in thread.
- [x] Persist and hydrate thread-aware history (`threadClientId`) from API/cache.
- [x] Build compact cross-thread memory and send it on each model request.

## Backend Consistency
- [x] Fix Convex history query to return all threads (not just first thread).
- [x] Fix Convex assistant persistence to write to the prepared thread.
- [x] Keep idempotent sync metadata (`clientMessageId`, `threadClientId`) in outbox flow.
- [x] Keep guest static response scope focused on full work persona.

## Stability and Testing
- [x] Add/keep deterministic chat E2E tests for guest/member/thread-cap scenarios.
- [x] Add explicit test for thread cap (`11th` prompt blocked with `thread_prompt_limit_reached`).
- [x] Run `pnpm lint`.
- [x] Run `pnpm build`.
- [x] Run `pnpm test:chat`.
