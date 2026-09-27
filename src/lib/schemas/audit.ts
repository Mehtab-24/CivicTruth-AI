import { z } from "zod";

export const VerificationAuditSchema = z.object({
  verified: z
    .boolean()
    .describe(
      "True only if the hazard is completely resolved in the same physical location"
    ),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Algorithmic confidence rating between 0 and 100"),
  decision: z.enum(["PASS", "FAIL", "MANUAL_INSPECTION_REQUIRED"]),
  landmarkMatchDetails: z.object({
    matchedLandmarks: z
      .array(z.string())
      .describe("Static background elements identified in both images"),
    spatialAngleConsistency: z.enum(["HIGH", "MODERATE", "LOW", "NO_MATCH"]),
    perspectiveConfidence: z.number().min(0).max(100),
  }),
  materialAnalysis: z.object({
    repairMaterialDetected: z
      .string()
      .describe(
        "E.g., Bituminous hot-mix, concrete, cleared soil, none"
      ),
    workmanshipGrade: z.enum([
      "EXCELLENT",
      "ACCEPTABLE",
      "SUBSTANDARD_TEMPORARY",
      "NO_WORK_DONE",
    ]),
    isEphemeralFix: z
      .boolean()
      .describe(
        "True if repair is a temporary dirt fill or superficial cover"
      ),
  }),
  rejectionReasoning: z
    .string()
    .nullable()
    .describe("Explicit justification if the audit is rejected"),
});

export type VerificationAudit = z.infer<typeof VerificationAuditSchema>;
