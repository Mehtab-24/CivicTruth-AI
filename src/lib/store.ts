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

// Initial realistic seed tickets for municipal demonstration (Bangalore wards 84, 112, 150)
const INITIAL_SEEDED_TICKETS: Ticket[] = [
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
    slaDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hrs remaining
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    auditTrail: [],
  },
  {
    id: "TICKET-BLR-84-102",
    citizenId: "CITIZEN-9845019999",
    category: "GARBAGE_DUMP",
    severity: "MEDIUM",
    summary: "Overflowing unauthorized solid waste dump along stormwater curb next to park fence.",
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
    slaDeadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hrs remaining (Critical)
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
