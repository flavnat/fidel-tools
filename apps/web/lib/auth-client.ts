import { createAuthClient } from "better-auth/react";
import { sentinelClient } from "@better-auth/infra/client";

const rawUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
const baseURL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

export const authClient = createAuthClient({
  baseURL,
  plugins: [sentinelClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
