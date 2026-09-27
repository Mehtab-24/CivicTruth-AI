/**
 * Phase 2 Automated Verification Test Suite
 * Tests:
 * 1. Shared Ticket Store & Seed Data retrieval
 * 2. GET /api/tickets and GET /api/tickets/[id]
 * 3. POST /api/tickets/intake (Citizen intake pipeline)
 * 4. Ticket Lifecycle Transition upon verification
 * Run via: npx tsx scripts/test-phase2.ts
 */

import { NextRequest } from "next/server";
import { GET as getTicketsRoute } from "../src/app/api/tickets/route";
import { GET as getSingleTicketRoute } from "../src/app/api/tickets/[id]/route";
import { POST as intakeRoute } from "../src/app/api/tickets/intake/route";
import { getTicketById } from "../src/lib/store";

async function runPhase2Tests() {
  console.log("\n=======================================================");
  console.log("   CivicTruth AI - Phase 2 Verification Test Suite");
  console.log("=======================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  // -------------------------------------------------------------------
  // TEST 1: Retrieve Seeded Municipal Work Orders
  // -------------------------------------------------------------------
  console.log("[TEST 1] Testing GET /api/tickets...");
  totalTests++;

  const listReq = new NextRequest("http://localhost:3000/api/tickets");
  const listRes = await getTicketsRoute(listReq);
  const listData = await listRes.json();

  if (listRes.status === 200 && listData.success && listData.count >= 5) {
    console.log(`  ✓ Successfully loaded ${listData.count} seeded municipal tickets.`);
    console.log(`  ✓ Sample tickets verified: ${listData.tickets.slice(0, 3).map((t: { id: string }) => t.id).join(", ")}`);
    passedTests++;
  } else {
    console.error("  ✗ Failed to list tickets:", listRes.status, listData);
  }

  // -------------------------------------------------------------------
  // TEST 2: Retrieve Single Ticket by ID
  // -------------------------------------------------------------------
  console.log("\n[TEST 2] Testing GET /api/tickets/[id] for 'TICKET-BLR-84-101'...");
  totalTests++;

  const singleReq = new NextRequest("http://localhost:3000/api/tickets/TICKET-BLR-84-101");
  const singleRes = await getSingleTicketRoute(singleReq, {
    params: { id: "TICKET-BLR-84-101" },
  });
  const singleData = await singleRes.json();

  if (
    singleRes.status === 200 &&
    singleData.success &&
    singleData.ticket.id === "TICKET-BLR-84-101" &&
    singleData.ticket.location.wardNumber === 84
  ) {
    console.log(`  ✓ Found ticket: ${singleData.ticket.summary}`);
    console.log(`  ✓ Category: ${singleData.ticket.category} | Severity: ${singleData.ticket.severity}`);
    passedTests++;
  } else {
    console.error("  ✗ Failed to fetch single ticket:", singleRes.status, singleData);
  }

  // -------------------------------------------------------------------
  // TEST 3: Citizen Grievance Intake Pipeline
  // -------------------------------------------------------------------
  console.log("\n[TEST 3] Testing POST /api/tickets/intake (New Grievance Registration)...");
  totalTests++;

  const intakeForm = new FormData();
  intakeForm.append(
    "textDescription",
    "Deep asphalt pothole near Indiranagar 100ft road metro pillar causing vehicle swerving"
  );
  intakeForm.append("wardNumber", "84");
  intakeForm.append("latitude", "12.97845");
  intakeForm.append("longitude", "77.64085");
  intakeForm.append("accuracy", "8");
  intakeForm.append("citizenPhone", "9876543210");

  const intakeReq = new NextRequest("http://localhost:3000/api/tickets/intake", {
    method: "POST",
    body: intakeForm,
  });

  const intakeRes = await intakeRoute(intakeReq);
  const intakeData = await intakeRes.json();

  if (intakeRes.status === 201 && intakeData.success && intakeData.ticket) {
    const created = intakeData.ticket;
    console.log(`  ✓ Created New Grievance Ticket: ${created.id}`);
    console.log(`  ✓ Category classified: ${created.category}`);
    console.log(`  ✓ Severity assigned: ${created.severity}`);
    console.log(`  ✓ SLA Deadline computed: ${created.slaDeadline}`);
    passedTests++;

    // -----------------------------------------------------------------
    // TEST 4: Verify Persistence in Store
    // -----------------------------------------------------------------
    console.log("\n[TEST 4] Testing Persistence Store Consistency...");
    totalTests++;

    const retrieved = getTicketById(created.id);
    if (retrieved && retrieved.id === created.id && retrieved.status === "OPEN") {
      console.log(`  ✓ Ticket ${created.id} persisted and confirmed in server store.`);
      passedTests++;
    } else {
      console.error("  ✗ Newly created ticket not found in memory store.");
    }
  } else {
    console.error("  ✗ Intake route failed:", intakeRes.status, intakeData);
  }

  // -------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`   Phase 2 Verification Summary: ${passedTests}/${totalTests} Tests Passed`);
  console.log("=======================================================\n");

  if (passedTests === totalTests) {
    console.log("All Phase 2 requirements successfully verified.\n");
    process.exit(0);
  } else {
    console.error(`Only ${passedTests} of ${totalTests} tests passed.`);
    process.exit(1);
  }
}

runPhase2Tests().catch((err) => {
  console.error("Unhandled test suite error:", err);
  process.exit(1);
});
