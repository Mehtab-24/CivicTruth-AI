/**
 * CivicTruth AI: Concurrency & State Resilience Verification Script
 * Validates thread safety, atomic ticket store updates, sliding-window rate limiting,
 * and Sharp image optimization under 5+ concurrent requests.
 *
 * Usage:
 *   npx tsx scripts/test-concurrency.ts
 */

import {
  createTicket,
  updateTicketAudit,
  getTicketById,
  getTickets,
  getStoreSize,
  resetTickets,
  Ticket,
} from "../src/lib/store";
import { checkRateLimit, resetRateLimits } from "../src/lib/rate-limit";
import { optimizeImageBuffer } from "../src/lib/image";
import { sanitizeData } from "../src/lib/logger";
import { NextRequest } from "next/server";
import sharp from "sharp";

const CONCURRENCY_LEVEL = 5;

// Color helpers
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function logStep(title: string) {
  console.log(`\n${CYAN}=== [TEST STEP] ${title} ===${RESET}`);
}

function logSuccess(message: string) {
  console.log(`  ${GREEN}✓ ${message}${RESET}`);
}

function logFailure(message: string) {
  console.error(`  ${RED}✗ ${message}${RESET}`);
}

async function testConcurrentTicketCreation() {
  logStep(`1. Testing ${CONCURRENCY_LEVEL} Concurrent Ticket Creations in In-Memory Store`);
  resetTickets();
  const initialSize = getStoreSize();

  const creationTasks = Array.from({ length: CONCURRENCY_LEVEL }, (_, i) => {
    const ticketId = `TICKET-CONCURRENT-${i + 1}`;
    return new Promise<Ticket>((resolve) => {
      // Simulate slight microtask jitter
      setTimeout(() => {
        const ticket = createTicket({
          id: ticketId,
          citizenId: `CITIZEN-CONC-${i + 1}`,
          category: "POTHOLE_ROAD_DAMAGE",
          severity: "HIGH",
          summary: `Concurrent simulated stress ticket #${i + 1}`,
          extractedLandmarks: [`Concurrent Landmark A-${i + 1}`, `Pillar #${100 + i}`],
          urgencyReasoning: "Stress testing concurrent municipal DPI grievance intake.",
          location: {
            latitude: 12.9715 + i * 0.001,
            longitude: 77.6410 + i * 0.001,
            accuracy: 8,
            address: `Ward 84 Stress Test Street #${i + 1}`,
            wardNumber: 84,
          },
          originalImageUrl: "data:image/svg+xml;utf8,<svg></svg>",
          assignedContractorId: `CONTR-CONC-${i + 1}`,
          contractorName: `Stress Test Infra Team ${i + 1}`,
          slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        });
        resolve(ticket);
      }, Math.random() * 20);
    });
  });

  const createdTickets = await Promise.all(creationTasks);

  if (createdTickets.length !== CONCURRENCY_LEVEL) {
    throw new Error(`Expected ${CONCURRENCY_LEVEL} created tickets, got ${createdTickets.length}`);
  }

  const finalSize = getStoreSize();
  if (finalSize !== initialSize + CONCURRENCY_LEVEL) {
    throw new Error(
      `Store size mismatch: expected ${initialSize + CONCURRENCY_LEVEL}, got ${finalSize}`
    );
  }

  // Verify all tickets are uniquely and correctly stored
  for (let i = 0; i < CONCURRENCY_LEVEL; i++) {
    const id = `TICKET-CONCURRENT-${i + 1}`;
    const retrieved = getTicketById(id);
    if (!retrieved || retrieved.id !== id) {
      throw new Error(`State corruption: ticket ${id} not found in store`);
    }
  }

  logSuccess(`All ${CONCURRENCY_LEVEL} concurrent tickets created atomically without collision`);
}

async function testConcurrentAuditUpdates() {
  logStep(`2. Testing ${CONCURRENCY_LEVEL} Concurrent Ticket Audit Status Transitions`);

  const updateTasks = Array.from({ length: CONCURRENCY_LEVEL }, (_, i) => {
    const ticketId = `TICKET-CONCURRENT-${i + 1}`;
    return new Promise<Ticket | null>((resolve) => {
      setTimeout(() => {
        const isPass = i % 2 === 0;
        const updated = updateTicketAudit(ticketId, {
          status: isPass ? "VERIFIED_RESOLVED" : "REJECTED_AUDIT_FAILED",
          resolutionImageUrl: "data:image/jpeg;base64,mockResolution",
          resolutionContractorGps: { latitude: 12.9715, longitude: 77.6410 },
          auditResult: {
            verified: isPass,
            confidenceScore: isPass ? 92 : 25,
            decision: isPass ? "PASS" : "FAIL",
            landmarkMatchDetails: {
              matchedLandmarks: [`Landmark #${i + 1}`],
              spatialAngleConsistency: isPass ? "HIGH" : "NO_MATCH",
              perspectiveConfidence: isPass ? 90 : 20,
            },
            materialAnalysis: {
              repairMaterialDetected: isPass ? "Compacted asphalt" : "Loose dirt",
              workmanshipGrade: isPass ? "EXCELLENT" : "SUBSTANDARD_TEMPORARY",
              isEphemeralFix: !isPass,
            },
            rejectionReasoning: isPass ? null : "Mismatched surface materials.",
          },
        });
        resolve(updated);
      }, Math.random() * 20);
    });
  });

  const updatedResults = await Promise.all(updateTasks);

  for (let i = 0; i < CONCURRENCY_LEVEL; i++) {
    const ticket = updatedResults[i];
    if (!ticket) {
      throw new Error(`Update returned null for ticket #${i + 1}`);
    }
    const expectedStatus = i % 2 === 0 ? "VERIFIED_RESOLVED" : "REJECTED_AUDIT_FAILED";
    if (ticket.status !== expectedStatus) {
      throw new Error(
        `Ticket #${i + 1} status mismatch: expected ${expectedStatus}, got ${ticket.status}`
      );
    }
    if (ticket.auditTrail.length !== 1) {
      throw new Error(`Audit trail missing for ticket #${i + 1}`);
    }
  }

  logSuccess(`All ${CONCURRENCY_LEVEL} tickets transitioned status concurrently with intact audit trails`);
}

async function testConcurrentRateLimiting() {
  logStep("3. Testing Sliding-Window Rate Limiter Under Concurrent Load");
  resetRateLimits();

  // Test intake limit: 10 requests per minute
  // We send 15 concurrent requests from the same IP (192.168.1.100)
  const fakeIp = "192.168.1.100";
  const TOTAL_BURST = 15;
  const INTAKE_LIMIT = 10;

  const burstRequests = Array.from({ length: TOTAL_BURST }, () => {
    const req = new NextRequest("http://localhost:3000/api/tickets/intake", {
      headers: { "x-forwarded-for": fakeIp },
    });
    return checkRateLimit(req, "intake_test", INTAKE_LIMIT, 60000);
  });

  const allowedCount = burstRequests.filter((r) => r.allowed).length;
  const blockedCount = burstRequests.filter((r) => !r.allowed).length;

  if (allowedCount !== INTAKE_LIMIT) {
    throw new Error(`Expected exactly ${INTAKE_LIMIT} allowed requests, got ${allowedCount}`);
  }

  if (blockedCount !== TOTAL_BURST - INTAKE_LIMIT) {
    throw new Error(`Expected exactly ${TOTAL_BURST - INTAKE_LIMIT} blocked requests, got ${blockedCount}`);
  }

  // Ensure blocked response returns HTTP 429 and structured JSON
  const blockedRecord = burstRequests.find((r) => !r.allowed);
  if (!blockedRecord || !blockedRecord.response) {
    throw new Error("Blocked record missing 429 response object");
  }

  if (blockedRecord.response.status !== 429) {
    throw new Error(`Expected status 429, got ${blockedRecord.response.status}`);
  }

  logSuccess(
    `Rate limiter allowed exactly ${allowedCount}/${INTAKE_LIMIT} requests and blocked ${blockedCount} with HTTP 429`
  );
}

async function testConcurrentImageOptimization() {
  logStep(`4. Testing ${CONCURRENCY_LEVEL} Concurrent Sharp Image Optimizations`);

  // Generate a valid 200x200 PNG image buffer using sharp
  const samplePngBuffer = await sharp({
    create: {
      width: 200,
      height: 200,
      channels: 3,
      background: { r: 16, g: 185, b: 129 },
    },
  })
    .png()
    .toBuffer();

  const optimizationTasks = Array.from({ length: CONCURRENCY_LEVEL }, () => {
    return optimizeImageBuffer(samplePngBuffer, "image/png");
  });

  const results = await Promise.all(optimizationTasks);

  if (results.length !== CONCURRENCY_LEVEL) {
    throw new Error(`Expected ${CONCURRENCY_LEVEL} optimization results, got ${results.length}`);
  }

  for (let i = 0; i < CONCURRENCY_LEVEL; i++) {
    const res = results[i];
    if (res.mimeType !== "image/jpeg") {
      throw new Error(`Result #${i + 1} mimeType should be image/jpeg, got ${res.mimeType}`);
    }
    if (!res.data || res.data.length === 0) {
      throw new Error(`Result #${i + 1} returned empty base64 string`);
    }
  }

  logSuccess(`All ${CONCURRENCY_LEVEL} concurrent Sharp image optimizations completed successfully`);
}

async function testLogSanitization() {
  logStep("5. Testing PII & Credential Sanitization Engine");

  const sensitiveSample = {
    apiKey: "AIzaSyD-fakeKeyForTestingPurposes12345678",
    authHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    citizenPhone: "9845012345",
    citizenEmail: "citizen.bangalore@gmail.com",
    normalMessage: "Large crater identified on 100ft road near Metro Pillar 42",
  };

  const sanitized = sanitizeData(sensitiveSample) as typeof sensitiveSample;

  if (sanitized.apiKey !== "[REDACTED_FIELD]") {
    throw new Error(`apiKey was not redacted: ${sanitized.apiKey}`);
  }
  if (sanitized.authHeader.includes("eyJ")) {
    throw new Error(`authHeader token was not redacted: ${sanitized.authHeader}`);
  }
  if (sanitized.citizenPhone.includes("9845012345")) {
    throw new Error(`citizenPhone was not redacted: ${sanitized.citizenPhone}`);
  }
  if (sanitized.citizenEmail.includes("citizen.bangalore@gmail.com")) {
    throw new Error(`citizenEmail was not redacted: ${sanitized.citizenEmail}`);
  }
  if (!sanitized.normalMessage.includes("100ft road")) {
    throw new Error("Normal message content was incorrectly altered");
  }

  logSuccess("Sensitive API keys, bearer tokens, phone numbers, and emails safely redacted");
}

async function runAllConcurrencyTests() {
  console.log(`\n${YELLOW}╔════════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${YELLOW}║  CivicTruth AI: Concurrency & Resilience Verification Suite   ║${RESET}`);
  console.log(`${YELLOW}╚════════════════════════════════════════════════════════════════╝${RESET}`);

  const start = performance.now();

  try {
    await testConcurrentTicketCreation();
    await testConcurrentAuditUpdates();
    await testConcurrentRateLimiting();
    await testConcurrentImageOptimization();
    await testLogSanitization();

    // Reset tickets back to pristine initial seeded dataset
    resetTickets();
    resetRateLimits();

    const duration = ((performance.now() - start) / 1000).toFixed(2);

    console.log(`\n${GREEN}================================================================${RESET}`);
    console.log(
      `${GREEN}✓ ALL CONCURRENCY & RESILIENCE TESTS PASSED (${duration}s) | 0 CORRUPTIONS | 0 REJECTIONS${RESET}`
    );
    console.log(`${GREEN}================================================================${RESET}\n`);
    process.exit(0);
  } catch (error) {
    console.error(`\n${RED}================================================================${RESET}`);
    logFailure(`Concurrency verification failed: ${error instanceof Error ? error.message : error}`);
    console.error(`${RED}================================================================${RESET}\n`);
    process.exit(1);
  }
}

runAllConcurrencyTests();
