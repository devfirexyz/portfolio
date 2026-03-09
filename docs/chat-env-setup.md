# Chat Env Setup (Clerk + Convex + AI)

## 1) Create `.env.local`
Add these values in `/Users/piyushraj/Desktop/portfolio/.env.local`:

```bash
# AI Gateway key (required for model ids like minimax/minimax-m2.5 and zai/glm-5)
AI_GATEWAY_API_KEY=agw_xxx

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/chat
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/chat

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment-name

# Optional owner bypass (comma-separated Clerk user ids)
CHAT_OWNER_IDS=user_abc123,user_def456

# Optional for local-only fallback store path when Convex is not configured
# CHAT_STORE_FILE_PATH=/tmp/portfolio-chat-store.json
```

## 2) Clerk setup
1. Create a Clerk app in dashboard.
2. Copy publishable and secret keys into `.env.local`.
3. Enable at least one sign-in method (email/password or OAuth).
4. In this project, auth UI is scoped to `/chat` via `app/chat/layout.tsx`.

## 3) Convex setup
1. Run:
```bash
pnpm dlx convex dev
```
2. Link/create a deployment when prompted.
3. Keep the dev process running while testing chat server authority.
4. Ensure `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` are set from Convex output.

## 4) Run app
```bash
pnpm dev
```
Open:
- `http://localhost:3000/chat`

## 5) Verify auth + policy
1. Signed out (guest):
- First message returns static login line.
- Further messages blocked.

2. Signed in:
- Messages allowed until lifetime count reaches 30.
- At 30, input disabled and contact CTA opens.

## 6) Notes
1. If Clerk keys are missing, chat still works in guest/fallback mode.
2. If Convex env is missing, runtime falls back to in-memory policy store.
3. For production reliability, set up Convex before launch.
4. The AI model routing in code is `minimax/minimax-m2.5` (primary) and `zai/glm-5` (fallback), both resolved through AI Gateway.
