# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (uses CHOKIDAR_USEPOLLING=true)
pnpm build        # Production build (TS errors suppressed via next.config.mjs)
pnpm lint         # Type-check only via tsc --noEmit (no ESLint)
pnpm test         # Run all test suites (smoke + theme contrast + regression)
pnpm test:smoke   # Architecture/config smoke tests
pnpm test:theme   # Theme token and no-hardcoded-colors checks
pnpm test:chat    # Chat E2E tests
pnpm test:regression  # Node native test runner (--experimental-strip-types)
pnpm test:perf    # Lighthouse Core Web Vitals budgets (requires running server)
```

For Convex (when working on chat persistence):
```bash
pnpm dlx convex dev   # Run Convex dev server alongside Next.js
```

## Environment Variables

Copy `.env.local` with these keys (see `docs/chat-env-setup.md` for full setup):
- `AI_GATEWAY_API_KEY` — required for AI model routing (minimax/zai via AI Gateway)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — optional; chat falls back to guest-only mode without Clerk
- `NEXT_PUBLIC_CONVEX_URL` / `CONVEX_DEPLOYMENT` — optional; falls back to in-memory + disk store without Convex
- `CHAT_OWNER_IDS` — comma-separated Clerk user IDs granted owner-tier unlimited chat access

Dev-only overrides:
- `CHAT_ALLOW_DEV_VIEWER_HEADER=1` — enables `x-chat-dev-viewer` header to spoof viewer type
- `CHAT_TEST_STATIC_ASSISTANT=1` — bypasses AI model, returns static response
- `CHAT_TEST_DISABLE_BURST=1` — disables burst rate limiting in tests

## Architecture

### Stack
- **Next.js 16 App Router** with React 19
- **Vercel AI SDK** (`ai` package) for streaming — uses `streamText` / `createUIMessageStreamResponse`
- **Convex** for persistent chat storage (optional; falls back to in-memory)
- **Clerk** for authentication (optional; falls back to guest mode)
- **Dexie.js** (IndexedDB) for client-side chat cache
- **shadcn/ui** + Tailwind CSS with custom neo-brutalist design system
- **pnpm** as package manager (enforced via `.npmrc` and `engines`)

### Design System
All components use CSS custom properties from `app/globals.css` prefixed `--nb-*` (neo-brutalist). **Never use hardcoded Tailwind color classes** (e.g., `text-gray-*`, `dark:` prefix). Always use `var(--nb-*)` tokens. The smoke tests enforce this. Theme switching uses `data-theme` attribute on `<html>`, not a class.

### Chat Feature Architecture

The chat system at `/chat` has a layered architecture:

1. **Viewer identity** (`lib/server/viewer.ts`): Resolves `guest | member | owner` from Clerk auth or guest ID header. Owner IDs come from `CHAT_OWNER_IDS` env var.

2. **Policy store** (`lib/server/chat-store.ts`): Dual-backend — tries Convex first, falls back to in-memory + disk JSON. Enforces: guests get 1 static response; members get 30 lifetime prompts; owners are unlimited. Thread limit is 10 prompts per thread.

3. **Guardrails** (`lib/guardrails/chat-guardrails.ts`): Deterministic input validation (length, unsafe patterns) before any model call. Rejections do not count against prompt limits.

4. **AI agent** (`lib/agents/portfolio-agent.ts`): Uses Vercel AI SDK with primary model `minimax/minimax-m2.5` and fallback `zai/glm-5`, both via AI Gateway. Has two tools: `get_projects` and `get_blogs`.

5. **Client cache** (`lib/client/chat-cache/`): Dexie.js IndexedDB with 7-day TTL. Handles offline-first message display and outbox sync.

6. **Convex schema** (`convex/schema.ts`): Tables — `users`, `threads`, `messages`, `chat_audit`. All queries/mutations are in `convex/chat.ts`.

### API Route
`app/api/chat/route.ts` — POST endpoint, 30s max duration. Flow: parse → guardrail → resolve viewer → prepare prompt (Convex/local) → stream or return static response → persist assistant on finish.

### Home Page
`app/page.tsx` → `components/home/PortfolioPageClient.tsx`. Uses intersection observer for lazy-loading the projects section (`NeoProjectsSection`) and idle callback preloading for non-critical chunks. The Discord-style interactive console loads on demand.

### Content Data
Static content lives in `lib/data/`:
- `resume-data.ts` — personal info, skills, experience used by chat system prompt
- `home-content.ts` — `ABOUT_ME_DESCRIPTION`, `SOCIAL_LINKS`
- `neo-home.ts` — projects section data
- `discord-portfolio.ts` — Discord UI replica content

### Middleware
`middleware.ts` guards `/chat` and `/api/chat` with Clerk auth. If Clerk env vars are absent, middleware is a no-op passthrough.

## Test Conventions

Tests are plain Node.js `.mjs` scripts (no test framework). `scripts/feedback-smoke-tests.mjs` reads source files and asserts patterns (no hardcoded colors, correct theme variable usage). `scripts/regression-tests.mjs` uses Node's native `--test` runner. Add new smoke test assertions directly in the script files.
