/**
 * Phase 3 Automated Verification Test Suite
 * Tests:
 * 1. Admin Telemetry Metrics Calculation (Grievances, Verification Rate, SLA Breaches)
 * 2. Contractor Integrity Scoreboard & PRD FR-4.1 Formula Conformance
 * 3. Municipal Accountability Tier Classification (Tier A, Tier B, Tier C)
 * 4. Geospatial Coordinate Integrity for Bangalore Municipal Wards
 * Run via: npx tsx scripts/test-phase3.ts
 */

import { Ticket, getTickets } from "../src/lib/store";
import {
  calculateAdminMetrics,
  calculateContractorIntegrityScores,
} from "../src/lib/metrics";

async function runPhase3Tests() {
  console.log("\n=======================================================");
  console.log("   CivicTruth AI - Phase 3 Verification Test Suite");
  console.log("=======================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  // -------------------------------------------------------------------
  // TEST 1: Admin Telemetry Aggregation
  // -------------------------------------------------------------------
  console.log("[TEST 1] Testing calculateAdminMetrics algorithm...");
  totalTests++;

  const mockTickets: Ticket[] = [
    {
      id: "T-01",
      citizenId: "C-1",
      category: "POTHOLE_ROAD_DAMAGE",
      severity: "HIGH",
      summary: "Pothole Indiranagar",
      extractedLandmarks: ["Pillar 1"],
      urgencyReasoning: "Traffic hazard",
      status: "VERIFIED_RESOLVED",
      location: { latitude: 12.978, longitude: 77.64, accuracy: 5, address: "Ward 84", wardNumber: 84 },
      originalImageUrl: "data:image/svg+xml;utf8,<svg></svg>",
      assignedContractorId: "CONTR-A",
      contractorName: "Agency Alpha",
      slaDeadline: new Date(Date.now() + 1000000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [],
    },
    {
      id: "T-02",
      citizenId: "C-2",
      category: "GARBAGE_DUMP",
      severity: "MEDIUM",
      summary: "Garbage dump Domlur",
      extractedLandmarks: ["Wall 2"],
      urgencyReasoning: "Sanitation",
      status: "REJECTED_AUDIT_FAILED",
      location: { latitude: 12.964, longitude: 77.635, accuracy: 5, address: "Ward 112", wardNumber: 112 },
      originalImageUrl: "data:image/svg+xml;utf8,<svg></svg>",
      assignedContractorId: "CONTR-B",
      contractorName: "Agency Beta",
      slaDeadline: new Date(Date.now() - 500000).toISOString(), // Breached!
      createdAt: new Date(Date.now() - 1000000).toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [],
    },
    {
      id: "T-03",
      citizenId: "C-3",
      category: "OPEN_DRAIN_SEWAGE",
      severity: "CRITICAL",
      summary: "Open drain Bellandur",
      extractedLandmarks: ["Transformer 3"],
      urgencyReasoning: "Flooding risk",
      status: "OPEN",
      location: { latitude: 12.93, longitude: 77.67, accuracy: 5, address: "Ward 150", wardNumber: 150 },
      originalImageUrl: "data:image/svg+xml;utf8,<svg></svg>",
      assignedContractorId: "CONTR-A",
      contractorName: "Agency Alpha",
      slaDeadline: new Date(Date.now() - 200000).toISOString(), // Breached!
      createdAt: new Date(Date.now() - 1000000).toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [],
    },
  ];

  const metrics = calculateAdminMetrics(mockTickets);

  if (
    metrics.totalGrievances === 3 &&
    metrics.verifiedCount === 1 &&
    metrics.failedAuditCount === 1 &&
    metrics.openTicketsCount === 1 &&
    metrics.activeSlaBreaches === 2 && // T-02 and T-03 breached
    metrics.autonomousVerificationRate === 50 // 1 verified / 2 audited = 50%
  ) {
    console.log("  ✓ Total grievances calculated: 3");
    console.log("  ✓ Verified count: 1 | Failed audits: 1 | Open: 1");
    console.log("  ✓ Autonomous Verification Rate: 50.0%");
    console.log("  ✓ Active SLA Breaches identified: 2");
    passedTests++;
  } else {
    console.error("  ✗ Admin metrics calculation mismatch:", metrics);
  }

  // -------------------------------------------------------------------
  // TEST 2: Contractor Integrity Scoring (PRD FR-4.1)
  // -------------------------------------------------------------------
  console.log("\n[TEST 2] Testing Contractor Integrity Scoring (PRD FR-4.1 Formula)...");
  totalTests++;

  const scores = calculateContractorIntegrityScores(mockTickets);
  const alphaScore = scores.find((s) => s.contractorId === "CONTR-A");
  const betaScore = scores.find((s) => s.contractorId === "CONTR-B");

  if (alphaScore && betaScore) {
    // Agency Alpha: 1 audit, 1 verified -> 100%
    // Agency Beta: 1 audit, 0 verified, 1 failed -> 0%
    if (alphaScore.integrityScore === 100 && betaScore.integrityScore === 0) {
      console.log(`  ✓ Agency Alpha Integrity Score: ${alphaScore.integrityScore}% (1/1 verified)`);
      console.log(`  ✓ Agency Beta Integrity Score: ${betaScore.integrityScore}% (0/1 verified, 1 failed)`);
      passedTests++;
    } else {
      console.error("  ✗ Contractor integrity score formula mismatch:", alphaScore, betaScore);
    }
  } else {
    console.error("  ✗ Failed to find contractor scores in result:", scores);
  }

  // -------------------------------------------------------------------
  // TEST 3: Municipal Accountability Tier Classification
  // -------------------------------------------------------------------
  console.log("\n[TEST 3] Testing Municipal Accountability Tier Classification...");
  totalTests++;

  if (
    alphaScore?.tier === "TIER_A_TRUSTED" &&
    betaScore?.tier === "TIER_C_FLAGGED"
  ) {
    console.log("  ✓ Agency Alpha classified as TIER_A_TRUSTED (≥ 85%)");
    console.log("  ✓ Agency Beta classified as TIER_C_FLAGGED (< 70%)");
    passedTests++;
  } else {
    console.error("  ✗ Tier classification failed:", alphaScore?.tier, betaScore?.tier);
  }

  // -------------------------------------------------------------------
  // TEST 4: Geospatial Ticket Coordinates Integrity
  // -------------------------------------------------------------------
  console.log("\n[TEST 4] Testing Geospatial Coordinates for Bangalore Municipal Wards...");
  totalTests++;

  const seededTickets = getTickets();
  let allCoordsValid = true;

  for (const t of seededTickets) {
    const { latitude, longitude, wardNumber } = t.location;
    // Bangalore urban bounding box: Lat: 12.80 to 13.15, Lon: 77.45 to 77.80
    const isWithinBangalore =
      latitude >= 12.8 && latitude <= 13.15 && longitude >= 77.45 && longitude <= 77.8;

    if (!isWithinBangalore || ![84, 112, 150].includes(wardNumber)) {
      allCoordsValid = false;
      console.error(`  ✗ Invalid coordinates or ward for ${t.id}: ${latitude}, ${longitude}, Ward ${wardNumber}`);
    }
  }

  if (allCoordsValid && seededTickets.length >= 5) {
    console.log(`  ✓ All ${seededTickets.length} seeded municipal tickets have valid GPS coordinates within Bangalore wards.`);
    passedTests++;
  } else {
    console.error("  ✗ Geospatial ticket coordinates test failed.");
  }

  // -------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`   Phase 3 Verification Summary: ${passedTests}/${totalTests} Tests Passed`);
  console.log("=======================================================\n");

  if (passedTests === totalTests) {
    console.log("All Phase 3 requirements successfully verified.\n");
    process.exit(0);
  } else {
    console.error(`Only ${passedTests} of ${totalTests} tests passed.`);
    process.exit(1);
  }
}

runPhase3Tests().catch((err) => {
  console.error("Unhandled test suite error:", err);
  process.exit(1);
});
