import { Ticket } from "@/lib/store";

export interface AdminMetrics {
  totalGrievances: number;
  verifiedCount: number;
  failedAuditCount: number;
  manualInspectionCount: number;
  openTicketsCount: number;
  autonomousVerificationRate: number; // percentage (0 - 100)
  activeSlaBreaches: number;
  wardBreakdown: Array<{
    wardNumber: number;
    wardName: string;
    total: number;
    resolved: number;
    open: number;
  }>;
}

export type ContractorTier = "TIER_A_TRUSTED" | "TIER_B_PROBATIONARY" | "TIER_C_FLAGGED";

export interface ContractorIntegrityScore {
  contractorId: string;
  contractorName: string;
  totalAssigned: number;
  totalSubmissions: number;
  verifiedCount: number;
  failedCount: number;
  integrityScore: number; // percentage (0 - 100)
  slaComplianceRate: number; // percentage (0 - 100)
  tier: ContractorTier;
}

const WARD_NAMES: Record<number, string> = {
  84: "Indiranagar",
  112: "Domlur",
  150: "Bellandur",
};

/**
 * Computes high-level municipal telemetry metrics for the Executive Dashboard.
 */
export function calculateAdminMetrics(tickets: Ticket[]): AdminMetrics {
  const now = Date.now();
  let verifiedCount = 0;
  let failedAuditCount = 0;
  let manualInspectionCount = 0;
  let openTicketsCount = 0;
  let activeSlaBreaches = 0;

  const wardMap = new Map<number, { total: number; resolved: number; open: number }>();

  for (const t of tickets) {
    // Ward Aggregation
    const wardNum = t.location.wardNumber || 84;
    const wardData = wardMap.get(wardNum) || { total: 0, resolved: 0, open: 0 };
    wardData.total += 1;

    // Status counts
    if (t.status === "VERIFIED_RESOLVED") {
      verifiedCount += 1;
      wardData.resolved += 1;
    } else if (t.status === "REJECTED_AUDIT_FAILED") {
      failedAuditCount += 1;
      wardData.open += 1;
    } else if (t.status === "MANUAL_INSPECTION_REQUIRED") {
      manualInspectionCount += 1;
      wardData.open += 1;
    } else {
      openTicketsCount += 1;
      wardData.open += 1;
    }

    wardMap.set(wardNum, wardData);

    // SLA Breach count
    const isPastDeadline = new Date(t.slaDeadline).getTime() < now;
    if (isPastDeadline && t.status !== "VERIFIED_RESOLVED") {
      activeSlaBreaches += 1;
    }
  }

  const totalAudited = verifiedCount + failedAuditCount + manualInspectionCount;
  const autonomousVerificationRate =
    totalAudited > 0 ? Math.round((verifiedCount / totalAudited) * 1000) / 10 : 0;

  const wardBreakdown = Array.from(wardMap.entries()).map(([wardNumber, data]) => ({
    wardNumber,
    wardName: WARD_NAMES[wardNumber] || `Ward ${wardNumber}`,
    total: data.total,
    resolved: data.resolved,
    open: data.open,
  }));

  return {
    totalGrievances: tickets.length,
    verifiedCount,
    failedAuditCount,
    manualInspectionCount,
    openTicketsCount,
    autonomousVerificationRate,
    activeSlaBreaches,
    wardBreakdown,
  };
}

/**
 * Computes contractor integrity score according to PRD FR-4.1:
 * Integrity Score = (Verified Tickets / Total Submissions) * 100
 */
export function calculateContractorIntegrityScores(
  tickets: Ticket[]
): ContractorIntegrityScore[] {
  const groups = new Map<
    string,
    {
      name: string;
      assigned: number;
      audited: number;
      verified: number;
      failed: number;
      slaMetCount: number;
    }
  >();

  for (const t of tickets) {
    const id = t.assignedContractorId || "UNASSIGNED";
    const name = t.contractorName || (id === "UNASSIGNED" ? "Unassigned Pool" : id);

    const entry = groups.get(id) || {
      name,
      assigned: 0,
      audited: 0,
      verified: 0,
      failed: 0,
      slaMetCount: 0,
    };

    entry.assigned += 1;

    // Check if ticket was audited
    const isAudited =
      t.status === "VERIFIED_RESOLVED" ||
      t.status === "REJECTED_AUDIT_FAILED" ||
      t.status === "MANUAL_INSPECTION_REQUIRED" ||
      t.auditTrail.length > 0;

    if (isAudited) {
      entry.audited += 1;

      if (t.status === "VERIFIED_RESOLVED") {
        entry.verified += 1;
      } else if (t.status === "REJECTED_AUDIT_FAILED") {
        entry.failed += 1;
      }

      // Check SLA adherence
      const deadline = new Date(t.slaDeadline).getTime();
      const resolvedAt = new Date(t.updatedAt).getTime();
      if (t.status === "VERIFIED_RESOLVED" && resolvedAt <= deadline) {
        entry.slaMetCount += 1;
      }
    }

    groups.set(id, entry);
  }

  const scores: ContractorIntegrityScore[] = [];

  for (const [id, data] of groups.entries()) {
    // If no submissions yet, default baseline is 100% until evaluated
    const integrityScore =
      data.audited > 0
        ? Math.round((data.verified / data.audited) * 100)
        : 100;

    const slaComplianceRate =
      data.verified > 0
        ? Math.round((data.slaMetCount / data.verified) * 100)
        : 100;

    let tier: ContractorTier = "TIER_A_TRUSTED";
    if (integrityScore < 70) {
      tier = "TIER_C_FLAGGED";
    } else if (integrityScore < 85) {
      tier = "TIER_B_PROBATIONARY";
    }

    scores.push({
      contractorId: id,
      contractorName: data.name,
      totalAssigned: data.assigned,
      totalSubmissions: data.audited,
      verifiedCount: data.verified,
      failedCount: data.failed,
      integrityScore,
      slaComplianceRate,
      tier,
    });
  }

  // Sort by highest integrity score first
  return scores.sort((a, b) => b.integrityScore - a.integrityScore);
}
