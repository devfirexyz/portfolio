# Portfolio Monorepo

A Turborepo monorepo containing multiple portfolio applications.

## Structure

```
portfolio/
├── apps/
│   ├── next-portfolio/      # Next.js 15 portfolio app
│   └── tanstack-portfolio/  # TanStack Start portfolio app
├── packages/
│   └── shared/              # Shared utilities and config
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 9.0.0

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev:next
pnpm dev:tanstack
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build:next
pnpm build:tanstack
```

### Start (Production)

```bash
# Start specific app
pnpm start:next
pnpm start:tanstack
```

## Deployment to Railway

### Option 1: GitHub Actions (Recommended)

1. **Generate Railway Token**
   ```bash
   railway login
   railway token
   ```

2. **Add Secret to GitHub**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add `RAILWAY_TOKEN` with the token from step 1

3. **Create Services in Railway**
   - Create a new project in Railway
   - Create two empty services: `next-portfolio` and `tanstack-portfolio`
   - DO NOT set root directory (leave empty for monorepo)

4. **Deploy**
   - Push to `main` branch
   - GitHub Actions will automatically deploy based on changed paths:
     - `apps/next-portfolio/**` changes → deploys Next.js portfolio
     - `apps/tanstack-portfolio/**` changes → deploys TanStack portfolio

### Option 2: Railway Dashboard (Auto-detect)

1. Go to Railway → New Project → Deploy from GitHub repo
2. Railway will auto-detect the monorepo structure
3. It will suggest creating multiple services for each app in `apps/`
4. Accept the suggestions and deploy

### Option 3: Manual CLI Deploy

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link and deploy next-portfolio
railway link  # Select your project and next-portfolio service
railway up

# Link and deploy tanstack-portfolio
railway link  # Select your project and tanstack-portfolio service
railway up
```

### Setting Custom Domains

1. Go to each service in Railway dashboard
2. Settings → Domains → Add custom domain
3. Configure DNS records as instructed

## Tech Stack

### Next Portfolio
- Next.js 15
- React 19
- Tailwind CSS
- Radix UI
- Framer Motion

### TanStack Portfolio
- TanStack Start
- TanStack Router
- React 19
- Tailwind CSS

## License

MIT
