import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding-window store across hot serverless / node processes
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic garbage collection to prevent memory leaks from inactive IPs
const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < windowMs);
    if (valid.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

/**
 * Extracts client IP safely from reverse proxy headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
  response?: NextResponse;
}

/**
 * Evaluates sliding-window rate limit for a given endpoint and client IP.
 *
 * @param request NextRequest instance
 * @param endpointIdentifier E.g. "intake" or "audit_verify"
 * @param limit Maximum requests allowed within windowMs (e.g. 10 or 20)
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  request: NextRequest,
  endpointIdentifier: string,
  limit: number,
  windowMs: number = 60000
): RateLimitResult {
  cleanupStaleEntries(windowMs);

  const ip = getClientIp(request);
  const key = `${endpointIdentifier}:${ip}`;
  const now = Date.now();

  let record = rateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter out expired timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterMs = oldestTimestamp + windowMs - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    const resetSeconds = Math.ceil((now + retryAfterMs) / 1000);

    logger.warn("Sliding-window rate limit exceeded", {
      endpoint: endpointIdentifier,
      ip,
      limit,
      retryAfterSeconds,
    });

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `Rate limit of ${limit} requests per minute exceeded. Please try again in ${retryAfterSeconds} seconds.`,
          retryAfterSeconds,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfterSeconds.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetSeconds.toString(),
        },
      }
    );

    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds,
      retryAfterSeconds,
      response: errorResponse,
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetSeconds = Math.ceil((now + windowMs) / 1000);

  return {
    allowed: true,
    limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Resets the in-memory rate limit store (useful for automated testing).
 */
export function resetRateLimits(): void {
  rateLimitMap.clear();
}
