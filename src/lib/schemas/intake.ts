import { z } from "zod";

export const IntakeExtractionSchema = z.object({
  category: z.enum([
    "POTHOLE_ROAD_DAMAGE",
    "GARBAGE_DUMP",
    "OPEN_DRAIN_SEWAGE",
    "BROKEN_STREETLIGHT",
    "WATER_LEAKAGE",
    "OTHER",
  ]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  summary: z.string().max(280),
  extractedLandmarks: z
    .array(z.string())
    .describe("Key permanent physical objects mentioned in voice notes"),
  urgencyReasoning: z.string(),
});

export type IntakeExtraction = z.infer<typeof IntakeExtractionSchema>;
