import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { IntakeExtractionSchema, IntakeExtraction } from "@/lib/schemas/intake";
import { createTicket, Ticket, TicketCategory, TicketSeverity } from "@/lib/store";

export const dynamic = "force-dynamic";

const INTAKE_SYSTEM_INSTRUCTION = `You are the Civic Grievance Triage Agent for Digital Public Infrastructure (DPI) in Indian municipalities.
You process citizen voice notes and grievances (which may be in Hindi, Tamil, Telugu, Kannada, or English).
Extract accurate issue categorization, severity, concise English summary, landmark descriptors, and urgency reasoning.

Return strictly valid JSON conforming to the requested schema.
Schema definitions:
- category: one of ["POTHOLE_ROAD_DAMAGE", "GARBAGE_DUMP", "OPEN_DRAIN_SEWAGE", "BROKEN_STREETLIGHT", "WATER_LEAKAGE", "OTHER"]
- severity: one of ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
- summary: concise summary (max 280 characters)
- extractedLandmarks: permanent physical objects mentioned (e.g. "Metro pillar 42", "Bescom transformer", "blue storefront")
- urgencyReasoning: justification of the assigned severity`;

function calculateSlaDeadline(severity: TicketSeverity): string {
  const hoursMap: Record<TicketSeverity, number> = {
    CRITICAL: 12,
    HIGH: 24,
    MEDIUM: 48,
    LOW: 72,
  };
  const hours = hoursMap[severity] || 48;
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function heuristicFallbackExtraction(text: string): IntakeExtraction {
  const lower = text.toLowerCase();
  let category: TicketCategory = "OTHER";
  let severity: TicketSeverity = "MEDIUM";

  if (lower.includes("pothole") || lower.includes("crater") || lower.includes("road") || lower.includes("asphalt")) {
    category = "POTHOLE_ROAD_DAMAGE";
    severity = lower.includes("deep") || lower.includes("accident") || lower.includes("danger") ? "HIGH" : "MEDIUM";
  } else if (lower.includes("garbage") || lower.includes("trash") || lower.includes("waste") || lower.includes("dump")) {
    category = "GARBAGE_DUMP";
    severity = lower.includes("overflow") || lower.includes("hospital") ? "HIGH" : "MEDIUM";
  } else if (lower.includes("drain") || lower.includes("sewage") || lower.includes("gutter") || lower.includes("manhole")) {
    category = "OPEN_DRAIN_SEWAGE";
    severity = lower.includes("overflow") || lower.includes("flood") || lower.includes("open") ? "CRITICAL" : "HIGH";
  } else if (lower.includes("light") || lower.includes("lamp") || lower.includes("dark") || lower.includes("street light")) {
    category = "BROKEN_STREETLIGHT";
    severity = "LOW";
  } else if (lower.includes("leak") || lower.includes("pipe") || lower.includes("tap") || lower.includes("water supply")) {
    category = "WATER_LEAKAGE";
    severity = "MEDIUM";
  }

  return {
    category,
    severity,
    summary: text.slice(0, 280) || "Civic hazard reported by citizen.",
    extractedLandmarks: ["Immediate roadside vicinity"],
    urgencyReasoning: `Assigned ${severity} based on primary keyword heuristics.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const audioFile = formData.get("audio") as File | null;
    const imageFile = formData.get("image") as File | null;
    const textDescription = (formData.get("textDescription") as string | null) || "";
    const citizenId = (formData.get("citizenId") as string | null) || `CITIZEN-${Date.now().toString().slice(-6)}`;
    const wardNumberStr = (formData.get("wardNumber") as string | null) || "84";
    const wardNumber = parseInt(wardNumberStr, 10) || 84;

    const latStr = formData.get("latitude") as string | null;
    const lngStr = formData.get("longitude") as string | null;
    const accuracyStr = formData.get("accuracy") as string | null;

    const latitude = latStr ? parseFloat(latStr) : 12.9784; // Default Indiranagar
    const longitude = lngStr ? parseFloat(lngStr) : 77.6408;
    const accuracy = accuracyStr ? parseFloat(accuracyStr) : 10;
    const address = (formData.get("address") as string | null) || `Ward ${wardNumber}, Bengaluru, Karnataka`;

    // Hazard photo resolution
    let originalImageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
      const mime = imageFile.type || "image/jpeg";
      originalImageUrl = `data:${mime};base64,${imgBuffer.toString("base64")}`;
    } else {
      // Fallback synthetic SVG if image capture was skipped
      originalImageUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='200' cy='150' r='60' fill='%23f59e0b'/><text x='130' y='155' fill='white' font-family='sans-serif' font-weight='bold' font-size='16'>CIVIC HAZARD</text></svg>`;
    }

    let extraction: IntakeExtraction | null = null;

    // Process audio via Gemini 1.5 Flash if provided
    if (audioFile && audioFile.size > 0 && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
      try {
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
        const audioMime = audioFile.type || "audio/webm";

        const modelResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "Analyze the attached citizen voice recording and extract the required grievance information:",
                },
                {
                  inlineData: {
                    mimeType: audioMime,
                    data: audioBuffer.toString("base64"),
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction: INTAKE_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
          },
        });

        const rawText = modelResponse.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());
          const validation = IntakeExtractionSchema.safeParse(parsed);
          if (validation.success) {
            extraction = validation.data;
          }
        }
      } catch (geminiError) {
        console.warn("Gemini audio extraction fallback engaged:", geminiError);
      }
    }

    // Fallback if audio was absent or failed
    if (!extraction) {
      extraction = heuristicFallbackExtraction(
        textDescription || "Citizen reported road or sanitation hazard requiring field municipal inspection."
      );
    }

    const slaDeadline = calculateSlaDeadline(extraction.severity);

    // Commit to Ticket Store
    const newTicket: Ticket = createTicket({
      citizenId,
      category: extraction.category,
      severity: extraction.severity,
      summary: extraction.summary,
      extractedLandmarks: extraction.extractedLandmarks,
      urgencyReasoning: extraction.urgencyReasoning,
      location: {
        latitude,
        longitude,
        accuracy,
        address,
        wardNumber,
      },
      originalImageUrl,
      assignedContractorId: `CONTR-WARD-${wardNumber}-01`,
      contractorName: `Ward ${wardNumber} Rapid Response Works`,
      slaDeadline,
    });

    return NextResponse.json(
      {
        success: true,
        ticket: newTicket,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error processing grievance intake";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTAKE_PROCESSING_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
