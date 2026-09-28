/**
 * Structured, PII-sanitized logger for CivicTruth AI server environments.
 * Prevents credential leakage (Gemini API keys, auth tokens) and citizen PII
 * (phone numbers, email addresses) in server console output.
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const PII_PATTERNS = [
  // Gemini API Keys (AIzaSy...)
  { regex: /AIzaSy[A-Za-z0-9_-]{33}/g, replacement: "[REDACTED_GEMINI_KEY]" },
  // Bearer / Authorization tokens
  { regex: /Bearer\s+[A-Za-z0-9_\-\.]+/gi, replacement: "Bearer [REDACTED_TOKEN]" },
  // Indian phone numbers (10 digits starting with 6, 7, 8, 9 with optional +91 prefix)
  { regex: /(?:\+91[\s\-]?)?[6-9]\d{9}\b/g, replacement: "[REDACTED_PHONE]" },
  // Email addresses
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[REDACTED_EMAIL]" },
  // High-entropy secret params in URLs
  { regex: /key=[A-Za-z0-9_\-]{20,}/gi, replacement: "key=[REDACTED_KEY]" },
];

/**
 * Recursively sanitizes any primitive, array, or object to strip sensitive data.
 */
export function sanitizeData(data: unknown): unknown {
  if (typeof data === "string") {
    let sanitized = data;
    for (const { regex, replacement } of PII_PATTERNS) {
      sanitized = sanitized.replace(regex, replacement);
    }
    return sanitized;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  if (data !== null && typeof data === "object") {
    // Handle Error instances specially
    if (data instanceof Error) {
      return {
        name: data.name,
        message: sanitizeData(data.message),
        stack: data.stack ? sanitizeData(data.stack) : undefined,
      };
    }

    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("key") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("token") ||
        lowerKey.includes("password") ||
        lowerKey.includes("auth")
      ) {
        sanitizedObj[key] = "[REDACTED_FIELD]";
      } else {
        sanitizedObj[key] = sanitizeData(value);
      }
    }
    return sanitizedObj;
  }

  return data;
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown> | unknown) {
  const timestamp = new Date().toISOString();
  const sanitizedMsg = sanitizeData(message);
  const sanitizedCtx = context !== undefined ? sanitizeData(context) : undefined;

  const logPayload = {
    timestamp,
    level,
    message: sanitizedMsg,
    ...(sanitizedCtx ? { context: sanitizedCtx } : {}),
  };

  const formatted = JSON.stringify(logPayload);

  switch (level) {
    case "DEBUG":
      if (process.env.NODE_ENV !== "production") {
        console.debug(formatted);
      }
      break;
    case "INFO":
      console.info(formatted);
      break;
    case "WARN":
      console.warn(formatted);
      break;
    case "ERROR":
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: unknown) => formatLog("DEBUG", message, context),
  info: (message: string, context?: unknown) => formatLog("INFO", message, context),
  warn: (message: string, context?: unknown) => formatLog("WARN", message, context),
  error: (message: string, context?: unknown) => formatLog("ERROR", message, context),
};
