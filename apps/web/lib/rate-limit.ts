import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Per user: 1000 req / hour (free tier)
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1 h"),
  prefix: "fidel:api:",
});

// Pro tier: 10000 / hour
export const apiRateLimitPro = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10000, "1 h"),
  prefix: "fidel:api:pro:",
});
