# Local Setup Guide for Fidel Tools

This guide walks you through the step-by-step process of setting up the **Fidel Tools** monorepo workspace for local development and testing.

---

## 1. Prerequisites

Ensure your local system has the following installed:
- **Node.js**: `v22.0.0` or higher (run `node -v` to verify).
- **pnpm**: `v10.0.0` or higher (run `pnpm -v` to verify).
- **Database**: A PostgreSQL database (e.g., a local Postgres server or a serverless instance on [Neon](https://neon.tech/)).
- **Cache**: An [Upstash Redis](https://upstash.com/) instance (for high-performance rate limiting counters).
- **Mail Service**: A [Resend](https://resend.com/) API Key for user verification/auth email dispatch.

---

## 2. Workspace Installation

1. Clone the repository and navigate into the root directory:
   ```bash
   git clone https://github.com/Yehonatal/fidel-tools.git
   cd fidel-tools
   ```

2. Install the workspace dependencies:
   ```bash
   pnpm install
   ```
   This will install all root packages and automatically link the workspace packages (`@fidel-tools/core`, `@fidel-tools/lang-am`, `@fidel-tools/db`) inside `apps/web` and `apps/api`.

---

## 3. Environment Variables Configuration

Fidel Tools utilizes environment files in individual workspaces. Create these configuration files locally:

### A. Web Console & Landing Page (`apps/web/.env.local`)
Create `apps/web/.env.local` containing:
```env
# Serverless PostgreSQL Connection String (Neon)
DATABASE_URL="postgres://user:password@ep-host.pooler.neon.tech/neondb?sslmode=require"

# Better Auth Configuration (Secret must be 32+ characters)
BETTER_AUTH_SECRET="use-a-secure-32-char-random-base64-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Email Verification (Resend)
RESEND_API_KEY="re_123456789"
EMAIL_FROM="Fidel Tools <noreply@fidel.tools>"
```

### B. Core REST API (`apps/api/.env`)
Create `apps/api/.env` containing:
```env
PORT=3001
DATABASE_URL="postgres://user:password@ep-host.pooler.neon.tech/neondb?sslmode=require"
```

---

## 4. Compile Workspace Packages

Before running the application servers, you must build the shared libraries in the monorepo:

```bash
pnpm build
```
This builds `@fidel-tools/core`, `@fidel-tools/lang-am`, and `@fidel-tools/db` so Next.js and Hono can reference the generated output directories correctly.

---

## 5. Database Schema & Migration

Fidel Tools uses Drizzle ORM to manage database structures. Perform the following steps to initialize your tables (`users`, `accounts`, `sessions`, `api_keys`, `usage_aggregates`, etc.):

### Option A: Automate using Migration Scripts (Recommended)
Execute the pre-built script which automatically pulls your connection string from `apps/web/.env.local` and applies schemas:
```bash
# From workspace root:
node packages/db/src/migrate.js
```

### Option B: Running Drizzle Kit commands directly
Navigate to `packages/db` and execute schema updates manually:
```bash
cd packages/db
DATABASE_URL="your-connection-string" pnpm generate
DATABASE_URL="your-connection-string" pnpm migrate
```

### Option C: Re-create schema from scratch
To tear down tables and apply SQL queries clean (useful for resetting local databases):
```bash
node packages/db/src/run-migration-directly.js
```

---

## 6. Running Development Servers

Once packages are built and the database migrations have been successfully applied, start the development environments:

From the workspace root, run:
```bash
pnpm dev
```

This starts the concurrent dev engines:
- **Developer UI Console & Web Portal**: Runs on `http://localhost:3000`
- **Hono NLP REST API**: Runs on `http://localhost:3001` (or your configured `PORT`)

---

## 7. Validating Language Pack Rules

Fidel Tools utilizes a custom CLI validator to ensure Amharic linguistic rule configurations (exception maps, stopword lists, prefixes/suffixes) match the required JSON schemas without circular references:

To compile and run lints on the Amharic packs, run:
```bash
pnpm --filter @fidel-tools/validate-pack build
pnpm --filter @fidel-tools/validate-pack validate
```

If you make manual alterations to Amharic JSON files, run the validator with `--fix` to automatically clean up duplicates:
```bash
pnpm --filter @fidel-tools/validate-pack validate --fix
```

---
