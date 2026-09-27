import { GoogleGenAI } from "@google/genai";

let genAIInstance: GoogleGenAI | null = null;

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
