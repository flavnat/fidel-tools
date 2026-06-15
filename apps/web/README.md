# @fidel-tools/web

The official web portal, developer cloud console, and interactive playground for the **Fidel Tools** Amharic NLP suite. 

This Next.js 16 application serves as the user-facing entrypoint for the Fidel Tools developer ecosystem, providing credential management, usage analytics, API reference documents, and a client-side execution sandbox for testing Amharic natural language processing pipelines.

---

## Technical Stack & Architecture

- **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) utilizing React 19 and Turbopack for compilation.
- **Styling**: Vanilla Tailwind CSS v4 featuring CSS-variable based styling tokens.
- **Visual Design**: Built following the **"Ethiopic Editorial Minimalism"** design system (sleek dark mode backgrounds, parchment styling for light-mode elements, Outfit/Plus Jakarta typography, clean outlines, and complete absence of heavy shadows in favor of minimal borders).
- **Authentication**: Powered by [Better Auth](https://www.better-auth.com/) (Drizzle adapter) handling credentials, sessions, and email verifications.
- **Database**: Drizzle ORM querying a serverless PostgreSQL instance (Neon).
- **Rate Limiting**: [Upstash Redis](https://upstash.com/) for high-throughput client ratelimit counters, with fallback mechanisms.
- **Email Delivery**: Resend integrations for password recovery and account verifications.

---

## Folder Structure

```
apps/web/
├── app/                  # Next.js App Router (Layouts & Pages)
│   ├── (auth)/           # Sign-in, sign-up, verification, password recovery routes
│   ├── (marketing)/      # Public landing, pricing, infrastructure, changelog, and packages pages
│   ├── dashboard/        # Authenticated console (API keys, settings, playground, usage charts)
│   ├── api/              # Route handlers for auth, api keys CRUD, and NLP proxy endpoints
│   ├── globals.css       # Core styling & custom animations
│   └── layout.tsx        # HTML root layout (dark/light theme toggle initialization)
├── components/           # Reusable UI components
│   ├── ui/               # Core design components (buttons, input fields, badges)
│   ├── aos-provider.tsx  # Scroll animations wrapper (Animate On Scroll)
│   ├── marketing-footer.tsx # Shared footer for all public pages
│   └── theme-toggle.tsx  # Light/Dark mode switcher
├── lib/                  # Shared utilities & configurations
│   ├── auth.ts           # Better Auth server configuration
│   ├── auth-client.ts    # Better Auth client-side hook handlers
│   └── utils.ts          # Class merging and utility helpers
├── public/               # Static icons, vector assets, and brand logos
├── postcss.config.mjs    # PostCSS configurations
└── tailwind.config.ts    # Tailwind themes & extension rules
```

---

## Core Features

### 1. Interactive Execution Console (Playground)
An IDE-inspired code editor and visualization sandbox built at `app/dashboard/playground`.
- **Zero-Latency Processing**: Imports `@fidel-tools/core` and `@fidel-tools/lang-am` directly into the client-side bundle to execute normalization, stopword filtering, transliteration, and stemming on-the-fly without sending network request payloads.
- **Tabs Matrix**: Toggle output views between a visual mapping tree, a raw JSON object string, and a copyable TypeScript/JavaScript SDK code snippet.
- **Diagnostics log**: Console log mimicking runtime compiler diagnostics and execution speeds.

### 2. API Key Management Console
Found at `app/dashboard/api-keys`. Developers can:
- Generate unique, secure API keys prefixed with `fidel_`.
- Toggle between active and inactive states.
- Monitor request counts per key, metadata labels, and creation times.

### 3. System Usage & Analytics
Visual dashboard showing total request volumes, rate limiting status, average response latency, and usage distribution across the NLP endpoints (`/normalize`, `/stem`, `/tokenize`, `/transliterate`).

---

## Getting Started

### Prerequisites
Ensure you have the following installed locally:
- Node.js >= 22.0.0
- pnpm >= 10.0.0
- A PostgreSQL database (or a Neon database instance url)
- Upstash Redis credentials (for rate limiter)
- Resend API key (for verification emails)

### Environment Variables
Configure a `.env.local` inside `apps/web/` (refer to `.env.example`):

```env
# Database Credentials
DATABASE_URL="postgres://user:password@host:port/db?sslmode=require"

# Better Auth Secret
BETTER_AUTH_SECRET="your-32-char-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Redis Cache (Upstash)
UPSTASH_REDIS_REST_URL="https://your-upstash-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Email Configuration (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="Fidel Tools <noreply@fidel.tools>"
```

### Scripts

Run the workspace commands from the root directory using pnpm filters, or navigate to `apps/web/` directly.

- **Development Server**:
  ```bash
  pnpm --filter @fidel-tools/web dev
  ```
- **Build Production Bundle**:
  ```bash
  pnpm --filter @fidel-tools/web build
  ```
- **Start Production Server**:
  ```bash
  pnpm --filter @fidel-tools/web start
  ```
- **Lint Codebase**:
  ```bash
  pnpm --filter @fidel-tools/web lint
  ```

---

## UX Design Guide: Ethiopic Editorial Minimalism
All new views, widgets, or sections added to `@fidel-tools/web` must comply with these rules:
1. **No Dropshadows**: Replace drop shadows with fine `1px` borders matching `border-slate-200` (light) and `border-zinc-900` (dark).
2. **Typography Hierarchy**: Use Outfit for display headers, Plus Jakarta Sans for body content, and JetBrains Mono for system components or logs.
3. **Monochrome Colors**: Prioritize off-black (`#030303`), charcoal, and pure white (`#fafafa`) for components. Accent hues should use deep cobalt blue (`#2563eb`) or emerald green only when communicating actions or statuses.
4. **Theme Parity**: Ensure every page behaves consistently and beautifully in both light and dark modes. Use Next.js layout toggling safely to avoid hydration discrepancies.
