import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Global limit for standard traffic (e.g., 50 requests per 10 seconds)
export const globalRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "10 s"),
});

// Strict limit for sensitive actions like checkouts and emails (e.g., 5 requests per minute)
export const strictRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});