import { GoogleGenAI } from "@google/genai";
import { logger } from "@/lib/logger";

let genAIInstance: GoogleGenAI | null = null;

export const DEFAULT_GEMINI_TIMEOUT_MS = 15000;

export class GeminiTimeoutError extends Error {
  code = "GATEWAY_TIMEOUT";
  status = 504;

  constructor(message = "Gemini API request timed out after 15 seconds. Please retry shortly.") {
    super(message);
    this.name = "GeminiTimeoutError";
  }
}

/**
 * Returns a singleton instance of the GoogleGenAI client.
 * Throws an explicit error if GEMINI_API_KEY is not defined.
 */
export function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({ apiKey });
  }
  return genAIInstance;
}

/**
 * Executes a Gemini operation with a strict 15-second AbortSignal timeout.
 * Gracefully translates AbortError/TimeoutError into a structured GeminiTimeoutError.
 */
export async function withGeminiTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = DEFAULT_GEMINI_TIMEOUT_MS
): Promise<T> {
  const signal = AbortSignal.timeout(timeoutMs);

  return new Promise<T>((resolve, reject) => {
    let completed = false;

    const onAbort = () => {
      if (!completed) {
        completed = true;
        logger.warn("Gemini API invocation aborted due to 15s timeout", { timeoutMs });
        reject(new GeminiTimeoutError());
      }
    };

    signal.addEventListener("abort", onAbort, { once: true });

    operation(signal)
      .then((res) => {
        if (!completed) {
          completed = true;
          signal.removeEventListener("abort", onAbort);
          resolve(res);
        }
      })
      .catch((err) => {
        if (!completed) {
          completed = true;
          signal.removeEventListener("abort", onAbort);

          const isAbort =
            err?.name === "AbortError" ||
            err?.name === "TimeoutError" ||
            signal.aborted ||
            err?.message?.includes("aborted") ||
            err?.message?.includes("timed out");

          if (isAbort) {
            logger.warn("Gemini API invocation aborted or timed out", { error: err });
            reject(new GeminiTimeoutError());
          } else {
            reject(err);
          }
        }
      });
  });
}

/**
 * Checks if an unknown error was caused by a timeout or abort.
 */
export function isTimeoutError(err: unknown): boolean {
  if (err instanceof GeminiTimeoutError) return true;
  if (err instanceof Error) {
    return (
      err.name === "AbortError" ||
      err.name === "TimeoutError" ||
      err.message.includes("timed out") ||
      err.message.includes("aborted")
    );
  }
  return false;
}

/**
 * Direct ai client instance proxy matching BUILD.md specifications,
 * ensuring lazy instantiation and strict environment variable validation.
 */
export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop: string | symbol) {
    const client = getGenAIClient();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});
