/**
 * Verification Test Suite for CivicTruth AI Multimodal Audit Engine
 * Run via: npx tsx scripts/test-audit.ts
 */

import sharp from "sharp";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/audit/verify/route";
import { VerificationAuditSchema } from "../src/lib/schemas/audit";
import { calculateHaversineDistanceMeters, isWithinGeofence } from "../src/lib/geo";

async function createSyntheticImage(options: {
  isRepaired: boolean;
  includeLandmark: boolean;
}): Promise<Buffer> {
  const composites = [];

  // Static Landmark (Blue Wall / Building marker)
  if (options.includeLandmark) {
    composites.push({
      input: Buffer.from(
        `<svg width="120" height="90"><rect width="120" height="90" fill="#1d4ed8" rx="8"/><text x="15" y="50" fill="white" font-family="sans-serif" font-weight="bold" font-size="14">STOREFRONT #84</text></svg>`
      ),
      top: 15,
      left: 15,
    });
  }

  // Road hazard vs Repaired patch
  if (options.isRepaired) {
    // Compacted bituminous asphalt patch
    composites.push({
      input: Buffer.from(
        `<svg width="160" height="110"><ellipse cx="80" cy="55" rx="75" ry="45" fill="#18181b" stroke="#3f3f46" stroke-width="4"/><text x="25" y="60" fill="#a1a1aa" font-family="sans-serif" font-size="12">COMPACTED ASPHALT</text></svg>`
      ),
      top: 120,
      left: 120,
    });
  } else {
    // Deep ragged pothole
    composites.push({
      input: Buffer.from(
        `<svg width="160" height="110"><ellipse cx="80" cy="55" rx="70" ry="40" fill="#09090b" stroke="#ef4444" stroke-width="2"/><text x="45" y="60" fill="#f87171" font-family="sans-serif" font-size="13">POTHOLE VOID</text></svg>`
      ),
      top: 120,
      left: 120,
    });
  }

  return sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 64, g: 64, b: 64 }, // Dark asphalt road surface
    },
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toBuffer();
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   CivicTruth AI - Phase 1 Verification Test Suite");
  console.log("=======================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  // -------------------------------------------------------------------
  // TEST 1: Haversine Geofence Unit Calculations
  // -------------------------------------------------------------------
  console.log("[TEST 1] Testing Haversine Geofence Logic...");
  totalTests++;

  // Indiranagar, Bangalore reference
  const originGps = { latitude: 12.9784, longitude: 77.6408 };
  // ~12 meters away
  const closeGps = { latitude: 12.97848, longitude: 77.64087 };
  // ~350 meters away
  const distantGps = { latitude: 12.9815, longitude: 77.6415 };

  const checkClose = isWithinGeofence(closeGps, originGps, 50);
  const checkFar = isWithinGeofence(distantGps, originGps, 50);

  if (checkClose.isWithin && !checkFar.isWithin) {
    console.log(`  ✓ Close distance check passed: ${checkClose.distanceMeters}m (≤ 50m: ${checkClose.isWithin})`);
    console.log(`  ✓ Distant breach check passed: ${checkFar.distanceMeters}m (≤ 50m: ${checkFar.isWithin})`);
    passedTests++;
  } else {
    console.error("  ✗ Geofence calculation failed assertions.");
  }

  // -------------------------------------------------------------------
  // TEST 2: Schema Validation (VerificationAuditSchema)
  // -------------------------------------------------------------------
  console.log("\n[TEST 2] Testing VerificationAuditSchema contracts...");
  totalTests++;

  const mockValidPass = {
    verified: true,
    confidenceScore: 94,
    decision: "PASS",
    landmarkMatchDetails: {
      matchedLandmarks: ["Storefront #84 blue compound wall", "Kerb alignment"],
      spatialAngleConsistency: "HIGH",
      perspectiveConfidence: 92,
    },
    materialAnalysis: {
      repairMaterialDetected: "Bituminous hot-mix asphalt",
      workmanshipGrade: "EXCELLENT",
      isEphemeralFix: false,
    },
    rejectionReasoning: null,
  };

  const schemaTest = VerificationAuditSchema.safeParse(mockValidPass);
  if (schemaTest.success) {
    console.log("  ✓ VerificationAuditSchema successfully parsed compliant payload.");
    passedTests++;
  } else {
    console.error("  ✗ VerificationAuditSchema rejected valid payload:", schemaTest.error);
  }

  // -------------------------------------------------------------------
  // TEST 3: Route Handler Geofence Violation Rejection
  // -------------------------------------------------------------------
  console.log("\n[TEST 3] Testing Route Handler Geofence Rejection (>50m breach)...");
  totalTests++;

  const dummyImage = await createSyntheticImage({ isRepaired: false, includeLandmark: true });
  const contractorFile = new File([new Uint8Array(dummyImage)], "contractor.jpg", { type: "image/jpeg" });

  const geofenceBreachFormData = new FormData();
  geofenceBreachFormData.append("ticketId", "TICKET-BLR-001");
  geofenceBreachFormData.append("originalImageUrl", `data:image/jpeg;base64,${dummyImage.toString("base64")}`);
  geofenceBreachFormData.append("contractorImage", contractorFile);
  geofenceBreachFormData.append("latitude", "12.98150"); // Far location
  geofenceBreachFormData.append("longitude", "77.64150");
  geofenceBreachFormData.append("originLatitude", "12.97840"); // Origin site
  geofenceBreachFormData.append("originLongitude", "77.64080");

  const breachReq = new NextRequest("http://localhost:3000/api/audit/verify", {
    method: "POST",
    body: geofenceBreachFormData,
  });

  const breachResponse = await POST(breachReq);
  const breachJson = await breachResponse.json();

  if (breachResponse.status === 422 && breachJson.error?.code === "GEOFENCE_VIOLATION") {
    console.log(`  ✓ Route rejected with HTTP 422 GEOFENCE_VIOLATION (${breachJson.error.distanceMeters}m > 50m)`);
    passedTests++;
  } else {
    console.error("  ✗ Route failed to enforce geofence:", breachResponse.status, breachJson);
  }

  // -------------------------------------------------------------------
  // TEST 4: Route Handler Missing Field Validation
  // -------------------------------------------------------------------
  console.log("\n[TEST 4] Testing Route Handler Missing Parameter Rejection...");
  totalTests++;

  const invalidFormData = new FormData();
  invalidFormData.append("ticketId", "TICKET-BLR-002");
  // Missing contractorImage and GPS

  const invalidReq = new NextRequest("http://localhost:3000/api/audit/verify", {
    method: "POST",
    body: invalidFormData,
  });

  const invalidResponse = await POST(invalidReq);
  const invalidJson = await invalidResponse.json();

  if (invalidResponse.status === 400 && invalidJson.error?.code === "VALIDATION_ERROR") {
    console.log(`  ✓ Route rejected with HTTP 400 VALIDATION_ERROR: "${invalidJson.error.message}"`);
    passedTests++;
  } else {
    console.error("  ✗ Route failed to enforce input validation:", invalidResponse.status, invalidJson);
  }

  // -------------------------------------------------------------------
  // TEST 5: Multimodal Image Payload & Gemini Verification
  // -------------------------------------------------------------------
  console.log("\n[TEST 5] Testing End-to-End Image Ingestion & AI Verification Pipeline...");
  totalTests++;

  const beforeBuffer = await createSyntheticImage({ isRepaired: false, includeLandmark: true });
  const afterBuffer = await createSyntheticImage({ isRepaired: true, includeLandmark: true });

  const resolvedContractorFile = new File([new Uint8Array(afterBuffer)], "repair_proof.jpg", {
    type: "image/jpeg",
  });

  const validAuditFormData = new FormData();
  validAuditFormData.append("ticketId", "TICKET-BLR-84-001");
  validAuditFormData.append("originalImageUrl", `data:image/jpeg;base64,${beforeBuffer.toString("base64")}`);
  validAuditFormData.append("contractorImage", resolvedContractorFile);
  validAuditFormData.append("latitude", "12.97843"); // within ~5m
  validAuditFormData.append("longitude", "77.64082");
  validAuditFormData.append("originLatitude", "12.97840");
  validAuditFormData.append("originLongitude", "77.64080");

  const validReq = new NextRequest("http://localhost:3000/api/audit/verify", {
    method: "POST",
    body: validAuditFormData,
  });

  const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here");

  if (hasApiKey) {
    console.log("  → Live GEMINI_API_KEY detected. Dispatching multimodal request to Gemini 1.5 Pro...");
    const auditResponse = await POST(validReq);
    const auditJson = await auditResponse.json();

    if (auditResponse.status === 200 && auditJson.success) {
      console.log(`  ✓ Live Gemini Multimodal Audit Result:`);
      console.log(`    - Decision: ${auditJson.audit.decision}`);
      console.log(`    - Confidence Score: ${auditJson.audit.confidenceScore}%`);
      console.log(`    - Verified: ${auditJson.audit.verified}`);
      console.log(`    - Landmarks: ${auditJson.audit.landmarkMatchDetails.matchedLandmarks.join(", ")}`);
      console.log(`    - Workmanship: ${auditJson.audit.materialAnalysis.workmanshipGrade}`);
      passedTests++;
    } else {
      console.error("  ✗ Audit API returned error:", auditResponse.status, auditJson);
    }
  } else {
    console.log("  ℹ No GEMINI_API_KEY provided in environment.");
    console.log("  → Verifying pipeline error boundary when GEMINI_API_KEY is not defined...");
    const auditResponse = await POST(validReq);
    const auditJson = await auditResponse.json();

    if (auditResponse.status === 500 && auditJson.error?.code === "AUDIT_ENGINE_ERROR") {
      console.log(`  ✓ Graceful API key boundary check verified: "${auditJson.error.message}"`);
      console.log(`  ℹ To test live Gemini 1.5 Pro inference, execute:`);
      console.log(`    $env:GEMINI_API_KEY="your-key"; npx tsx scripts/test-audit.ts`);
      passedTests++;
    } else {
      console.error("  ✗ Unexpected response without API key:", auditResponse.status, auditJson);
    }
  }

  // -------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`   Verification Summary: ${passedTests}/${totalTests} Tests Passed`);
  console.log("=======================================================\n");

  if (passedTests === totalTests) {
    console.log("All Phase 1 tasks verified and operational.\n");
    process.exit(0);
  } else {
    console.error(`Only ${passedTests} of ${totalTests} tests passed.`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Unhandled error in test runner:", err);
  process.exit(1);
});
