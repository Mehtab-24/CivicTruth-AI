import { IntakeExtraction } from "@/lib/schemas/intake";
import { VerificationAudit } from "@/lib/schemas/audit";

export type TicketStatus =
  | "OPEN"
  | "ASSIGNED"
  | "UNDER_REVIEW"
  | "VERIFIED_RESOLVED"
  | "REJECTED_AUDIT_FAILED"
  | "MANUAL_INSPECTION_REQUIRED";

export type TicketCategory = IntakeExtraction["category"];
export type TicketSeverity = IntakeExtraction["severity"];

export interface TicketLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  address: string;
  wardNumber: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  contractorId?: string;
  decision: "PASS" | "FAIL" | "MANUAL_INSPECTION_REQUIRED";
  confidenceScore: number;
  verified: boolean;
  rejectionReasoning?: string | null;
  auditPayload?: VerificationAudit;
}

export interface Ticket {
  id: string;
  citizenId: string;
  category: TicketCategory;
  severity: TicketSeverity;
  summary: string;
  extractedLandmarks: string[];
  urgencyReasoning: string;
  status: TicketStatus;
  location: TicketLocation;
  originalImageUrl: string;
  originalAudioUrl?: string;
  assignedContractorId: string | null;
  contractorName?: string;
  slaDeadline: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string;
  resolutionImageUrl?: string;
  resolutionContractorGps?: { latitude: number; longitude: number; accuracy?: number };
  latestAudit?: VerificationAudit;
  auditTrail: AuditLogEntry[];
}

/**
 * 15 Authentic Municipal Tickets distributed across Bangalore Wards 84, 112, 150
 * Status Breakdown:
 * - 6 OPEN / ASSIGNED
 * - 3 VERIFIED_RESOLVED
 * - 3 REJECTED_AUDIT_FAILED
 * - 3 MANUAL_INSPECTION_REQUIRED
 */
export const INITIAL_SEEDED_TICKETS: Ticket[] = [
  // --- WARD 84 (INDIRANAGAR) ---
  {
    id: "TICKET-BLR-84-101",
    citizenId: "CITIZEN-9845012345",
    category: "POTHOLE_ROAD_DAMAGE",
    severity: "HIGH",
    summary: "Large crater near 100ft Road junction causing severe motorcycle skid hazard in front of blue commercial storefront.",
    extractedLandmarks: ["Blue Storefront #84 compound wall", "Indiranagar Metro Pillar #42", "Concrete utility pole"],
    urgencyReasoning: "High traffic intersection; exposed sharp aggregate risk to two-wheelers.",
    status: "OPEN",
    location: {
      latitude: 12.9784,
      longitude: 77.6408,
      accuracy: 8,
      address: "100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
      wardNumber: 84,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='120' height='90' fill='%231d4ed8' rx='8'/><text x='35' y='70' fill='white' font-family='sans-serif' font-weight='bold' font-size='14'>STORE #84</text><ellipse cx='200' cy='200' rx='80' ry='45' fill='%2318181b' stroke='%23ef4444' stroke-width='3'/><text x='150' y='205' fill='%23ef4444' font-family='sans-serif' font-size='14'>CRATER</text></svg>",
    assignedContractorId: "CONTR-IND-01",
    contractorName: "Shree Lakshmi Road Infra Ltd.",
    slaDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-84-102",
    citizenId: "CITIZEN-9845019999",
    category: "GARBAGE_DUMP",
    severity: "MEDIUM",
    summary: "Overflowing unauthorized solid waste dump along stormwater curb next to park perimeter fence.",
    extractedLandmarks: ["Green park perimeter fencing", "Indiranagar Ward 84 Water Kiosk"],
    urgencyReasoning: "Pedestrian walkway obstructed; sanitary odor affecting neighborhood.",
    status: "OPEN",
    location: {
      latitude: 12.9752,
      longitude: 77.6435,
      accuracy: 12,
      address: "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008",
      wardNumber: 84,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='140' height='60' fill='%2315803d' rx='6'/><text x='35' y='55' fill='white' font-family='sans-serif' font-size='13'>PARK FENCE</text><polygon points='160,240 220,150 280,240' fill='%2378350f'/><text x='180' y='220' fill='white' font-family='sans-serif' font-size='12'>WASTE</text></svg>",
    assignedContractorId: "CONTR-SWM-04",
    contractorName: "CleanGreen Solid Waste Services",
    slaDeadline: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-84-103",
    citizenId: "CITIZEN-9845023311",
    category: "POTHOLE_ROAD_DAMAGE",
    severity: "HIGH",
    summary: "Deep asphalt cavity in front of commercial retail complex on 100 Feet Road.",
    extractedLandmarks: ["Blue Storefront #84 compound wall", "Indiranagar Metro Pillar #42"],
    urgencyReasoning: "Heavy evening bus corridor.",
    status: "VERIFIED_RESOLVED",
    location: {
      latitude: 12.9786,
      longitude: 77.6409,
      accuracy: 6,
      address: "100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038",
      wardNumber: 84,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='120' height='90' fill='%231d4ed8' rx='8'/><ellipse cx='200' cy='200' rx='80' ry='45' fill='%2318181b' stroke='%23ef4444' stroke-width='3'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='120' height='90' fill='%231d4ed8' rx='8'/><ellipse cx='200' cy='200' rx='85' ry='48' fill='%2327272a' stroke='%2310b981' stroke-width='3'/><text x='140' y='205' fill='%2334d399' font-family='sans-serif' font-weight='bold' font-size='12'>ASPHALT PATCH</text></svg>",
    resolutionContractorGps: { latitude: 12.97862, longitude: 77.64092, accuracy: 5 },
    assignedContractorId: "CONTR-IND-01",
    contractorName: "Shree Lakshmi Road Infra Ltd.",
    slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: true,
      confidenceScore: 94,
      decision: "PASS",
      landmarkMatchDetails: {
        matchedLandmarks: ["Blue Storefront #84 compound wall", "Indiranagar Metro Pillar #42"],
        spatialAngleConsistency: "HIGH",
        perspectiveConfidence: 95,
      },
      materialAnalysis: {
        repairMaterialDetected: "Bituminous hot-mix asphalt (compacted)",
        workmanshipGrade: "EXCELLENT",
        isEphemeralFix: false,
      },
      rejectionReasoning: null,
    },
    auditTrail: [
      {
        id: "AUDIT-84-103",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-IND-01",
        decision: "PASS",
        confidenceScore: 94,
        verified: true,
        rejectionReasoning: null,
      },
    ],
  },
  {
    id: "TICKET-BLR-84-104",
    citizenId: "CITIZEN-9845034422",
    category: "GARBAGE_DUMP",
    severity: "HIGH",
    summary: "CMH Road intersection solid waste accumulation near drainage corner.",
    extractedLandmarks: ["Yellow bakery awning", "Bescom transformer fence"],
    urgencyReasoning: "Sanitation hazard near food establishments.",
    status: "REJECTED_AUDIT_FAILED",
    location: {
      latitude: 12.9789,
      longitude: 77.6382,
      accuracy: 8,
      address: "CMH Road, Indiranagar, Bengaluru, Karnataka 560038",
      wardNumber: 84,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='120' height='60' fill='%23eab308'/><polygon points='160,240 220,150 280,240' fill='%2378350f'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='300' y='20' width='80' height='60' fill='%233b82f6'/><text x='140' y='200' fill='%23ef4444' font-family='sans-serif' font-size='12'>COSMETIC COVER</text></svg>",
    resolutionContractorGps: { latitude: 12.97893, longitude: 77.63825, accuracy: 6 },
    assignedContractorId: "CONTR-SWM-04",
    contractorName: "CleanGreen Solid Waste Services",
    slaDeadline: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Breached!
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: false,
      confidenceScore: 16,
      decision: "FAIL",
      landmarkMatchDetails: {
        matchedLandmarks: [],
        spatialAngleConsistency: "NO_MATCH",
        perspectiveConfidence: 15,
      },
      materialAnalysis: {
        repairMaterialDetected: "Superficial tarpaulin cover; uncollected waste behind frame",
        workmanshipGrade: "SUBSTANDARD_TEMPORARY",
        isEphemeralFix: true,
      },
      rejectionReasoning: "Contractor submitted photo with mismatched background landmarks and uncollected waste piles still visible behind frame.",
    },
    auditTrail: [
      {
        id: "AUDIT-84-104",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-SWM-04",
        decision: "FAIL",
        confidenceScore: 16,
        verified: false,
        rejectionReasoning: "Mismatched background landmarks. Uncollected waste piles remain.",
      },
    ],
  },
  {
    id: "TICKET-BLR-84-105",
    citizenId: "CITIZEN-9845045533",
    category: "BROKEN_STREETLIGHT",
    severity: "LOW",
    summary: "Street fixture flickering intermittently on Indiranagar Club road cross.",
    extractedLandmarks: ["Club boundary hedge", "Lamp Post #IND-88"],
    urgencyReasoning: "Nighttime safety.",
    status: "MANUAL_INSPECTION_REQUIRED",
    location: {
      latitude: 12.9721,
      longitude: 77.6412,
      accuracy: 9,
      address: "Indiranagar Club Rd, HAL 2nd Stage, Bengaluru, Karnataka 560008",
      wardNumber: 84,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='100' cy='100' r='30' fill='%23eab308' opacity='0.3'/><line x1='100' y1='100' x2='100' y2='280' stroke='%2394a3b8' stroke-width='6'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='100' cy='100' r='45' fill='%23fef08a' opacity='0.7'/><line x1='100' y1='100' x2='100' y2='280' stroke='%2394a3b8' stroke-width='6'/></svg>",
    resolutionContractorGps: { latitude: 12.97214, longitude: 77.64124, accuracy: 7 },
    assignedContractorId: "CONTR-IND-01",
    contractorName: "Shree Lakshmi Road Infra Ltd.",
    slaDeadline: new Date(Date.now() + 40 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: false,
      confidenceScore: 62,
      decision: "MANUAL_INSPECTION_REQUIRED",
      landmarkMatchDetails: {
        matchedLandmarks: ["Lamp Post #IND-88"],
        spatialAngleConsistency: "MODERATE",
        perspectiveConfidence: 65,
      },
      materialAnalysis: {
        repairMaterialDetected: "LED fixture replacement (optical verification partial)",
        workmanshipGrade: "ACCEPTABLE",
        isEphemeralFix: false,
      },
      rejectionReasoning: "Dusk sunlight reflection on lens impedes unambiguous lumen level verification. Routed to Assistant Executive Engineer.",
    },
    auditTrail: [
      {
        id: "AUDIT-84-105",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-IND-01",
        decision: "MANUAL_INSPECTION_REQUIRED",
        confidenceScore: 62,
        verified: false,
        rejectionReasoning: "Dusk glare on fixture lens; requires engineering signoff.",
      },
    ],
  },

  // --- WARD 112 (DOMLUR) ---
  {
    id: "TICKET-BLR-112-201",
    citizenId: "CITIZEN-9811022334",
    category: "OPEN_DRAIN_SEWAGE",
    severity: "CRITICAL",
    summary: "Collapsed drainage slab with raw wastewater overflowing onto primary vehicular carriageway.",
    extractedLandmarks: ["Red brick boundary wall", "Bescom Transformer Box #D-12"],
    urgencyReasoning: "Immediate public health emergency and vehicular hazard during monsoon runoff.",
    status: "OPEN",
    location: {
      latitude: 12.9611,
      longitude: 77.6387,
      accuracy: 6,
      address: "Intermediate Ring Rd, Domlur Layout, Bengaluru, Karnataka 560071",
      wardNumber: 112,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='100' height='100' fill='%23991b1b'/><text x='30' y='70' fill='white' font-family='sans-serif' font-size='12'>TRANSFORMER</text><rect x='140' y='180' width='180' height='80' fill='%23064e3b'/><text x='170' y='225' fill='%2334d399' font-family='sans-serif' font-size='14'>OPEN SEWAGE</text></svg>",
    assignedContractorId: "CONTR-DOM-02",
    contractorName: "Apex Urban Drainage Infra",
    slaDeadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-112-202",
    citizenId: "CITIZEN-9822033445",
    category: "BROKEN_STREETLIGHT",
    severity: "LOW",
    summary: "Flickering high-mast street fixture on 2nd Stage cross road leaving pedestrian crossing dark.",
    extractedLandmarks: ["Yellow building corner", "Street pole #DL-48"],
    urgencyReasoning: "Reduced nighttime visibility for pedestrians.",
    status: "OPEN",
    location: {
      latitude: 12.9644,
      longitude: 77.6355,
      accuracy: 10,
      address: "2nd Stage, Domlur, Bengaluru, Karnataka 560071",
      wardNumber: 112,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='80' cy='80' r='40' fill='%23eab308' opacity='0.4'/><line x1='80' y1='80' x2='80' y2='280' stroke='%2394a3b8' stroke-width='6'/><text x='110' y='85' fill='%23fef08a' font-family='sans-serif' font-size='14'>LAMP #DL-48</text></svg>",
    assignedContractorId: "CONTR-DOM-02",
    contractorName: "Apex Urban Drainage Infra",
    slaDeadline: new Date(Date.now() + 54 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-112-203",
    citizenId: "CITIZEN-9822044556",
    category: "POTHOLE_ROAD_DAMAGE",
    severity: "HIGH",
    summary: "Domlur flyover descent carriageway fractured asphalt crater.",
    extractedLandmarks: ["Domlur Flyover Pillar #12", "Green direction overhead sign"],
    urgencyReasoning: "High descent velocity collision hazard.",
    status: "VERIFIED_RESOLVED",
    location: {
      latitude: 12.9628,
      longitude: 77.6391,
      accuracy: 5,
      address: "Domlur Flyover Descent, Bengaluru, Karnataka 560071",
      wardNumber: 112,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='80' height='260' fill='%2364748b'/><text x='30' y='140' fill='white' font-family='sans-serif' font-size='12'>PILLAR 12</text><ellipse cx='220' cy='200' rx='70' ry='35' fill='%2318181b' stroke='%23ef4444' stroke-width='3'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='80' height='260' fill='%2364748b'/><text x='30' y='140' fill='white' font-family='sans-serif' font-size='12'>PILLAR 12</text><ellipse cx='220' cy='200' rx='75' ry='38' fill='%2327272a' stroke='%2310b981' stroke-width='3'/></svg>",
    resolutionContractorGps: { latitude: 12.96284, longitude: 77.63915, accuracy: 4 },
    assignedContractorId: "CONTR-DOM-02",
    contractorName: "Apex Urban Drainage Infra",
    slaDeadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: true,
      confidenceScore: 91,
      decision: "PASS",
      landmarkMatchDetails: {
        matchedLandmarks: ["Domlur Flyover Pillar #12", "Concrete lane abutment"],
        spatialAngleConsistency: "HIGH",
        perspectiveConfidence: 92,
      },
      materialAnalysis: {
        repairMaterialDetected: "Bituminous hot-mix asphalt (machine rolled)",
        workmanshipGrade: "EXCELLENT",
        isEphemeralFix: false,
      },
      rejectionReasoning: null,
    },
    auditTrail: [
      {
        id: "AUDIT-112-203",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-DOM-02",
        decision: "PASS",
        confidenceScore: 91,
        verified: true,
      },
    ],
  },
  {
    id: "TICKET-BLR-112-204",
    citizenId: "CITIZEN-9822055667",
    category: "OPEN_DRAIN_SEWAGE",
    severity: "CRITICAL",
    summary: "Domlur BDA complex culvert blockage with black effluent flooding walkway.",
    extractedLandmarks: ["Domlur BDA Arch", "Subway staircase railing"],
    urgencyReasoning: "Severe pedestrian obstruction.",
    status: "REJECTED_AUDIT_FAILED",
    location: {
      latitude: 12.9635,
      longitude: 77.6372,
      accuracy: 7,
      address: "Domlur BDA Complex Rd, Bengaluru, Karnataka 560071",
      wardNumber: 112,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='40' y='20' width='120' height='70' fill='%237c3aed'/><text x='50' y='60' fill='white' font-family='sans-serif' font-size='12'>BDA ARCH</text><rect x='100' y='180' width='240' height='90' fill='%23064e3b'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='80' height='50' fill='%2314b8a6'/><rect x='80' y='180' width='220' height='80' fill='%23064e3b'/></svg>",
    resolutionContractorGps: { latitude: 12.96353, longitude: 77.63724, accuracy: 5 },
    assignedContractorId: "CONTR-DOM-02",
    contractorName: "Apex Urban Drainage Infra",
    slaDeadline: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Breached!
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: false,
      confidenceScore: 22,
      decision: "FAIL",
      landmarkMatchDetails: {
        matchedLandmarks: [],
        spatialAngleConsistency: "LOW",
        perspectiveConfidence: 20,
      },
      materialAnalysis: {
        repairMaterialDetected: "Untreated raw sewage effluent still flowing",
        workmanshipGrade: "NO_WORK_DONE",
        isEphemeralFix: true,
      },
      rejectionReasoning: "Contractor submitted photo of different drain section. Blackwater effluent remains actively discharging across walkway.",
    },
    auditTrail: [
      {
        id: "AUDIT-112-204",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-DOM-02",
        decision: "FAIL",
        confidenceScore: 22,
        verified: false,
        rejectionReasoning: "No work done; effluent actively escaping.",
      },
    ],
  },
  {
    id: "TICKET-BLR-112-205",
    citizenId: "CITIZEN-9822066778",
    category: "WATER_LEAKAGE",
    severity: "MEDIUM",
    summary: "BWSSB potable water distribution pipeline joint rupture near EGL back gate.",
    extractedLandmarks: ["EGL Tech Park boundary fence", "Valve Chamber #V-4"],
    urgencyReasoning: "Potable water loss; road base erosion.",
    status: "MANUAL_INSPECTION_REQUIRED",
    location: {
      latitude: 12.9585,
      longitude: 77.6442,
      accuracy: 8,
      address: "Embassy GolfLinks Access Rd, Domlur, Bengaluru, Karnataka 560071",
      wardNumber: 112,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='160' height='60' fill='%230284c7'/><circle cx='220' cy='200' r='50' fill='%2338bdf8' opacity='0.7'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='160' height='60' fill='%230284c7'/><rect x='160' y='180' width='120' height='60' fill='%2352525b'/></svg>",
    resolutionContractorGps: { latitude: 12.95854, longitude: 77.64425, accuracy: 6 },
    assignedContractorId: "CONTR-DOM-02",
    contractorName: "Apex Urban Drainage Infra",
    slaDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: false,
      confidenceScore: 58,
      decision: "MANUAL_INSPECTION_REQUIRED",
      landmarkMatchDetails: {
        matchedLandmarks: ["EGL Tech Park boundary fence"],
        spatialAngleConsistency: "MODERATE",
        perspectiveConfidence: 60,
      },
      materialAnalysis: {
        repairMaterialDetected: "Excavation backfilled with stone dust; pipeline weld obscured underground",
        workmanshipGrade: "ACCEPTABLE",
        isEphemeralFix: false,
      },
      rejectionReasoning: "Underground pipeline weld is concealed beneath gravel backfill. Requires pressure gauge confirmation from BWSSB engineer.",
    },
    auditTrail: [
      {
        id: "AUDIT-112-205",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-DOM-02",
        decision: "MANUAL_INSPECTION_REQUIRED",
        confidenceScore: 58,
        verified: false,
        rejectionReasoning: "Underground weld concealed; pressure test required.",
      },
    ],
  },

  // --- WARD 150 (BELLANDUR) ---
  {
    id: "TICKET-BLR-150-301",
    citizenId: "CITIZEN-9833044556",
    category: "POTHOLE_ROAD_DAMAGE",
    severity: "HIGH",
    summary: "Deep double pothole on Bellandur service road right before flyover ramp.",
    extractedLandmarks: ["Flyover pillar #P-18", "Commercial glass facade"],
    urgencyReasoning: "High speed merge zone; abrupt swerving causes frequent bumper collisions.",
    status: "OPEN",
    location: {
      latitude: 12.9304,
      longitude: 77.6784,
      accuracy: 5,
      address: "Bellandur Outer Ring Road, Bengaluru, Karnataka 560103",
      wardNumber: 150,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='300' y='20' width='80' height='260' fill='%2364748b'/><text x='310' y='140' fill='white' font-family='sans-serif' font-size='12'>PILLAR</text><ellipse cx='140' cy='180' rx='60' ry='30' fill='%2318181b' stroke='%23f59e0b' stroke-width='3'/></svg>",
    assignedContractorId: "CONTR-BEL-09",
    contractorName: "Vanguard Infra Projects",
    slaDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-150-302",
    citizenId: "CITIZEN-9833055667",
    category: "GARBAGE_DUMP",
    severity: "MEDIUM",
    summary: "Illegal debris dumping on Bellandur lake wetland buffer boundary.",
    extractedLandmarks: ["Lake catchment barbed fence", "Wetland boundary stone #W-14"],
    urgencyReasoning: "Environmental protection order zone.",
    status: "OPEN",
    location: {
      latitude: 12.9342,
      longitude: 77.6721,
      accuracy: 11,
      address: "Bellandur Lake Perimeter Rd, Bengaluru, Karnataka 560103",
      wardNumber: 150,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><line x1='0' y1='100' x2='400' y2='100' stroke='%2316a34a' stroke-width='6'/><polygon points='140,240 200,160 260,240' fill='%2378350f'/></svg>",
    assignedContractorId: "CONTR-BEL-09",
    contractorName: "Vanguard Infra Projects",
    slaDeadline: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-150-303",
    citizenId: "CITIZEN-9833066778",
    category: "POTHOLE_ROAD_DAMAGE",
    severity: "HIGH",
    summary: "Bellandur Central commercial approach road asphalt rupture.",
    extractedLandmarks: ["Commercial glass entrance canopy", "Bus shelter #BEL-04"],
    urgencyReasoning: "Heavy peak hour bus congestion.",
    status: "VERIFIED_RESOLVED",
    location: {
      latitude: 12.9288,
      longitude: 77.6765,
      accuracy: 5,
      address: "Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103",
      wardNumber: 150,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='140' height='80' fill='%230284c7'/><ellipse cx='220' cy='200' rx='65' ry='35' fill='%2318181b' stroke='%23ef4444' stroke-width='3'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='140' height='80' fill='%230284c7'/><ellipse cx='220' cy='200' rx='70' ry='38' fill='%2327272a' stroke='%2310b981' stroke-width='3'/></svg>",
    resolutionContractorGps: { latitude: 12.92883, longitude: 77.67653, accuracy: 4 },
    assignedContractorId: "CONTR-BEL-09",
    contractorName: "Vanguard Infra Projects",
    slaDeadline: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: true,
      confidenceScore: 95,
      decision: "PASS",
      landmarkMatchDetails: {
        matchedLandmarks: ["Commercial glass entrance canopy", "Bus shelter #BEL-04"],
        spatialAngleConsistency: "HIGH",
        perspectiveConfidence: 96,
      },
      materialAnalysis: {
        repairMaterialDetected: "Grade-A compacted bituminous asphalt",
        workmanshipGrade: "EXCELLENT",
        isEphemeralFix: false,
      },
      rejectionReasoning: null,
    },
    auditTrail: [
      {
        id: "AUDIT-150-303",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-BEL-09",
        decision: "PASS",
        confidenceScore: 95,
        verified: true,
      },
    ],
  },
  {
    id: "TICKET-BLR-150-304",
    citizenId: "CITIZEN-9833077889",
    category: "OPEN_DRAIN_SEWAGE",
    severity: "HIGH",
    summary: "Outer Ring Road storm runoff culvert blocked by loose construction rubble.",
    extractedLandmarks: ["Pedestrian overpass pillar #P-04", "Advertising billboard support"],
    urgencyReasoning: "Severe monsoon waterlogging hazard.",
    status: "REJECTED_AUDIT_FAILED",
    location: {
      latitude: 12.9321,
      longitude: 77.6744,
      accuracy: 6,
      address: "ORR Junction, Bellandur, Bengaluru, Karnataka 560103",
      wardNumber: 150,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='20' y='20' width='80' height='260' fill='%23475569'/><rect x='140' y='180' width='160' height='80' fill='%230f766e'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23333333'/><rect x='140' y='180' width='160' height='80' fill='%2378350f'/><text x='150' y='220' fill='%23ef4444' font-family='sans-serif' font-size='12'>LOOSE DIRT</text></svg>",
    resolutionContractorGps: { latitude: 12.93215, longitude: 77.67445, accuracy: 5 },
    assignedContractorId: "CONTR-BEL-09",
    contractorName: "Vanguard Infra Projects",
    slaDeadline: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // Breached!
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: false,
      confidenceScore: 14,
      decision: "FAIL",
      landmarkMatchDetails: {
        matchedLandmarks: [],
        spatialAngleConsistency: "LOW",
        perspectiveConfidence: 15,
      },
      materialAnalysis: {
        repairMaterialDetected: "Uncompacted soil and loose aggregate backfill",
        workmanshipGrade: "SUBSTANDARD_TEMPORARY",
        isEphemeralFix: true,
      },
      rejectionReasoning: "Contractor filled blocked stormwater culvert with loose uncompacted mud instead of clearing silt and installing reinforced precast slab.",
    },
    auditTrail: [
      {
        id: "AUDIT-150-304",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-BEL-09",
        decision: "FAIL",
        confidenceScore: 14,
        verified: false,
        rejectionReasoning: "Loose mud fill instead of unblocking culvert.",
      },
    ],
  },
  {
    id: "TICKET-BLR-150-305",
    citizenId: "CITIZEN-9833088990",
    category: "BROKEN_STREETLIGHT",
    severity: "LOW",
    summary: "Green Glen Layout 4th Cross sodium vapor fixture unlit at night.",
    extractedLandmarks: ["Green Glen archway", "Street post #GGL-19"],
    urgencyReasoning: "Pedestrian dark spot.",
    status: "MANUAL_INSPECTION_REQUIRED",
    location: {
      latitude: 12.9262,
      longitude: 77.6715,
      accuracy: 9,
      address: "Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103",
      wardNumber: 150,
    },
    originalImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><line x1='120' y1='80' x2='120' y2='280' stroke='%2394a3b8' stroke-width='6'/><circle cx='120' cy='80' r='25' fill='%23475569'/></svg>",
    resolutionImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%2360a5fa'/><line x1='120' y1='80' x2='120' y2='280' stroke='%2394a3b8' stroke-width='6'/><circle cx='120' cy='80' r='25' fill='%23cbd5e1'/></svg>",
    resolutionContractorGps: { latitude: 12.92623, longitude: 77.67155, accuracy: 8 },
    assignedContractorId: "CONTR-BEL-09",
    contractorName: "Vanguard Infra Projects",
    slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    latestAudit: {
      verified: false,
      confidenceScore: 65,
      decision: "MANUAL_INSPECTION_REQUIRED",
      landmarkMatchDetails: {
        matchedLandmarks: ["Street post #GGL-19", "Green Glen archway"],
        spatialAngleConsistency: "HIGH",
        perspectiveConfidence: 80,
      },
      materialAnalysis: {
        repairMaterialDetected: "New luminaire bulb physically installed",
        workmanshipGrade: "ACCEPTABLE",
        isEphemeralFix: false,
      },
      rejectionReasoning: "Contractor submitted daytime photograph showing bulb installation, but illumination lumens cannot be validated until night timer activates.",
    },
    auditTrail: [
      {
        id: "AUDIT-150-305",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        contractorId: "CONTR-BEL-09",
        decision: "MANUAL_INSPECTION_REQUIRED",
        confidenceScore: 65,
        verified: false,
        rejectionReasoning: "Daytime photo submitted; night illumination test required.",
      },
    ],
  },
];

// Global in-memory singleton pattern across Next.js dev server reloads
interface GlobalTicketStore {
  tickets: Map<string, Ticket>;
}

const globalForTickets = globalThis as unknown as {
  civicTruthTicketStore?: GlobalTicketStore;
};

if (!globalForTickets.civicTruthTicketStore) {
  const storeMap = new Map<string, Ticket>();
  for (const ticket of INITIAL_SEEDED_TICKETS) {
    storeMap.set(ticket.id, ticket);
  }
  globalForTickets.civicTruthTicketStore = { tickets: storeMap };
}

const ticketStore = globalForTickets.civicTruthTicketStore;

/**
 * Resets the in-memory ticket store to the fresh 15 seeded municipal tickets.
 */
export function resetTickets(): void {
  ticketStore.tickets.clear();
  for (const ticket of INITIAL_SEEDED_TICKETS) {
    ticketStore.tickets.set(ticket.id, ticket);
  }
}

/**
 * Returns all tickets with optional filtering.
 */
export function getTickets(filters?: {
  wardNumber?: number;
  status?: TicketStatus;
  category?: TicketCategory;
}): Ticket[] {
  let list = Array.from(ticketStore.tickets.values());

  if (filters?.wardNumber !== undefined) {
    list = list.filter((t) => t.location.wardNumber === filters.wardNumber);
  }

  if (filters?.status) {
    list = list.filter((t) => t.status === filters.status);
  }

  if (filters?.category) {
    list = list.filter((t) => t.category === filters.category);
  }

  // Sort: open/critical first, newest first
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Returns single ticket by ID.
 */
export function getTicketById(id: string): Ticket | null {
  return ticketStore.tickets.get(id) || null;
}

/**
 * Appends a new citizen submission ticket.
 */
export function createTicket(
  ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "auditTrail"> & {
    id?: string;
  }
): Ticket {
  const newId =
    ticketData.id ||
    `TICKET-BLR-${ticketData.location.wardNumber || 84}-${Math.floor(100 + Math.random() * 900)}`;

  const now = new Date().toISOString();

  const newTicket: Ticket = {
    ...ticketData,
    id: newId,
    status: "OPEN",
    createdAt: now,
    updatedAt: now,
    auditTrail: [],
  };

  ticketStore.tickets.set(newId, newTicket);
  return newTicket;
}

/**
 * Updates a ticket with new audit verification results and transitions status.
 */
export function updateTicketAudit(
  id: string,
  update: {
    status: TicketStatus;
    resolutionImageUrl?: string;
    resolutionContractorGps?: { latitude: number; longitude: number; accuracy?: number };
    auditResult: VerificationAudit;
  }
): Ticket | null {
  const existing = ticketStore.tickets.get(id);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();
  const auditEntry: AuditLogEntry = {
    id: `AUDIT-${Date.now()}`,
    timestamp: now,
    contractorId: existing.assignedContractorId || "CONTR-UNKNOWN",
    decision: update.auditResult.decision,
    confidenceScore: update.auditResult.confidenceScore,
    verified: update.auditResult.verified,
    rejectionReasoning: update.auditResult.rejectionReasoning,
    auditPayload: update.auditResult,
  };

  const updated: Ticket = {
    ...existing,
    status: update.status,
    resolutionImageUrl: update.resolutionImageUrl || existing.resolutionImageUrl,
    resolutionContractorGps: update.resolutionContractorGps || existing.resolutionContractorGps,
    latestAudit: update.auditResult,
    updatedAt: now,
    auditTrail: [auditEntry, ...existing.auditTrail],
  };

  ticketStore.tickets.set(id, updated);
  return updated;
}

/**
 * Returns the total count of tickets in the active ticket store.
 */
export function getStoreSize(): number {
  return ticketStore.tickets.size;
}
