import { resetTickets, getTickets } from "../src/lib/store";

async function main() {
  console.log("================================================================================");
  console.log("🏛️  CIVICTRUTH AI — MUNICIPAL DATA SEEDER");
  console.log("   Populating BBMP Bangalore Wards (84 Indiranagar, 112 Domlur, 150 Bellandur)");
  console.log("================================================================================\n");

  resetTickets();
  const tickets = getTickets();

  console.log(`✅ Successfully seeded ${tickets.length} municipal tickets.\n`);

  // Ward Breakdown
  const ward84 = tickets.filter((t) => t.location.wardNumber === 84);
  const ward112 = tickets.filter((t) => t.location.wardNumber === 112);
  const ward150 = tickets.filter((t) => t.location.wardNumber === 150);

  console.log("📍 WARD DISTRIBUTION:");
  console.log(`   • Ward 84 (Indiranagar):  ${ward84.length} tickets`);
  console.log(`   • Ward 112 (Domlur):      ${ward112.length} tickets`);
  console.log(`   • Ward 150 (Bellandur):   ${ward150.length} tickets\n`);

  // Status Breakdown
  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "ASSIGNED");
  const verifiedTickets = tickets.filter((t) => t.status === "VERIFIED_RESOLVED");
  const rejectedTickets = tickets.filter((t) => t.status === "REJECTED_AUDIT_FAILED");
  const manualTickets = tickets.filter((t) => t.status === "MANUAL_INSPECTION_REQUIRED");

  console.log("📊 STATUS DISTRIBUTION:");
  console.log(`   • OPEN / ASSIGNED:             ${openTickets.length} tickets (awaiting contractor repair)`);
  console.log(`   • VERIFIED_RESOLVED:          ${verifiedTickets.length} tickets (forensic audit passed >88%)`);
  console.log(`   • REJECTED_AUDIT_FAILED:      ${rejectedTickets.length} tickets (contractor fraud caught)`);
  console.log(`   • MANUAL_INSPECTION_REQUIRED: ${manualTickets.length} tickets (occlusion / borderline score)\n`);

  console.log("--------------------------------------------------------------------------------");
  console.log("📋 DETAILED AUDIT DOSSIERS OF SEEDED TICKETS:");
  console.log("--------------------------------------------------------------------------------");

  for (const t of tickets) {
    const statusIcon =
      t.status === "VERIFIED_RESOLVED"
        ? "🟢 PASS"
        : t.status === "REJECTED_AUDIT_FAILED"
        ? "🔴 FRAUD CAUGHT"
        : t.status === "MANUAL_INSPECTION_REQUIRED"
        ? "🟠 MANUAL"
        : "🔵 OPEN";

    console.log(`\n[${t.id}] Ward ${t.location.wardNumber} | ${statusIcon} | ${t.category.toUpperCase()} (${t.severity})`);
    console.log(`   Location:   ${t.location.address} (${t.location.latitude.toFixed(4)}, ${t.location.longitude.toFixed(4)})`);
    console.log(`   Summary:    ${t.summary}`);
    console.log(`   Landmarks:  ${t.extractedLandmarks.join(", ")}`);

    if (t.latestAudit) {
      const material = t.latestAudit.materialAnalysis?.repairMaterialDetected || "N/A";
      const grade = t.latestAudit.materialAnalysis?.workmanshipGrade || "N/A";
      console.log(`   Audit:      Decision: ${t.latestAudit.decision} | Confidence: ${t.latestAudit.confidenceScore}% | Material: ${material} (${grade})`);
      if (t.latestAudit.rejectionReasoning) {
        console.log(`   Rejection:  ⚠️  ${t.latestAudit.rejectionReasoning}`);
      }
    }
  }

  console.log("\n================================================================================");
  console.log("✨ Data seeding complete. Store is primed for demo and administrative analytics.");
  console.log("================================================================================");
}

main().catch((err) => {
  console.error("Seeder failed:", err);
  process.exit(1);
});
