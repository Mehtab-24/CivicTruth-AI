import fs from "fs";
import path from "path";
import sharp from "sharp";

async function generateDemoAssets() {
  console.log("================================================================================");
  console.log("🎨 CIVICTRUTH AI — DEMO ASSET GENERATOR");
  console.log("   Creating high-fidelity before/after image pairs for Gemini forensic audits");
  console.log("================================================================================\n");

  const demoDir = path.join(process.cwd(), "public", "demo");
  if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir, { recursive: true });
    console.log(`📁 Created directory: ${demoDir}`);
  }

  // 1. GENUINE BEFORE: Severe pothole on asphalt road with invariant landmarks
  // Invariant Landmarks:
  // - Yellow & Black municipal curb at y=100..140
  // - BESCOM Red Utility Transformer Post at x=620, y=60..300
  // - Blue compound wall at top x=50..500
  // - Center: deep crater with jagged dark edges, exposed stones, water puddle
  const genuineBeforeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <!-- Road asphalt texture base -->
      <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="40%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <!-- Deep crater gradient -->
      <radialGradient id="crater" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="60%" stop-color="#1e1b4b"/>
        <stop offset="85%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#475569"/>
      </radialGradient>
      <!-- Pothole water puddle -->
      <radialGradient id="water" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
        <stop offset="70%" stop-color="#0284c7" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0369a1" stop-opacity="0.1"/>
      </radialGradient>
      <!-- Wall pattern -->
      <linearGradient id="blueWall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>

    <!-- Sky / distant background -->
    <rect width="800" height="180" fill="#94a3b8"/>

    <!-- Invariant Landmark 1: Blue Compound Wall -->
    <rect x="0" y="80" width="600" height="100" fill="url(#blueWall)"/>
    <text x="30" y="140" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff" letter-spacing="2">INDIRANAGAR WARD 84 - 100FT RD</text>
    <rect x="0" y="175" width="600" height="8" fill="#1e293b"/>

    <!-- Invariant Landmark 2: BESCOM Transformer Box / Post -->
    <rect x="620" y="50" width="130" height="170" rx="8" fill="#dc2626" stroke="#991b1b" stroke-width="4"/>
    <rect x="635" y="70" width="100" height="40" fill="#fef2f2"/>
    <text x="645" y="95" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#991b1b">BESCOM D-12</text>
    <polygon points="685,120 670,150 682,150 678,175 700,140 688,140" fill="#eab308"/>
    <!-- Steel pole support -->
    <rect x="675" y="220" width="20" height="160" fill="#64748b"/>

    <!-- Invariant Landmark 3: Municipal Kerb / Curb (Black & Yellow diagonal stripes) -->
    <rect x="0" y="180" width="800" height="45" fill="#facc15"/>
    <polygon points="40,180 80,180 40,225 0,225" fill="#0f172a"/>
    <polygon points="140,180 180,180 140,225 100,225" fill="#0f172a"/>
    <polygon points="240,180 280,180 240,225 200,225" fill="#0f172a"/>
    <polygon points="340,180 380,180 340,225 300,225" fill="#0f172a"/>
    <polygon points="440,180 480,180 440,225 400,225" fill="#0f172a"/>
    <polygon points="540,180 580,180 540,225 500,225" fill="#0f172a"/>
    <polygon points="640,180 680,180 640,225 600,225" fill="#0f172a"/>
    <polygon points="740,180 780,180 740,225 700,225" fill="#0f172a"/>

    <!-- Road Surface Asphalt -->
    <rect x="0" y="225" width="800" height="375" fill="url(#asphalt)"/>

    <!-- Asphalt Road Cracks -->
    <path d="M 120 320 Q 200 340 260 380 T 320 440" stroke="#0f172a" stroke-width="3" fill="none"/>
    <path d="M 520 280 Q 480 360 450 410" stroke="#0f172a" stroke-width="2.5" fill="none"/>
    <path d="M 550 420 Q 620 480 690 520" stroke="#0f172a" stroke-width="3" fill="none"/>

    <!-- SEVERE ROAD HAZARD: Deep Jagged Pothole -->
    <!-- Outer crater edge -->
    <ellipse cx="380" cy="410" rx="190" ry="110" fill="#1e293b" stroke="#020617" stroke-width="8"/>
    <!-- Jagged cavity contour -->
    <polygon points="200,400 240,360 300,340 380,330 460,345 520,380 550,420 520,470 450,500 370,510 270,490 210,450" fill="url(#crater)"/>

    <!-- Broken asphalt chunks & gravel debris -->
    <polygon points="230,370 250,385 240,395 220,385" fill="#64748b"/>
    <polygon points="490,440 515,455 500,470 480,455" fill="#64748b"/>
    <circle cx="310" cy="460" r="14" fill="#475569"/>
    <circle cx="430" cy="370" r="12" fill="#475569"/>
    <circle cx="280" cy="380" r="8" fill="#94a3b8"/>
    <circle cx="470" cy="430" r="10" fill="#94a3b8"/>

    <!-- Muddy Water puddle in the pothole basin -->
    <ellipse cx="370" cy="430" rx="90" ry="45" fill="url(#water)"/>

    <!-- Metadata Watermark overlay for forensic traceability -->
    <rect x="20" y="540" width="360" height="42" rx="6" fill="#000000" fill-opacity="0.75"/>
    <text x="32" y="565" font-family="Courier, monospace" font-size="13" fill="#38bdf8">BBMP INTAKE: TICKET-BLR-84-101</text>
    <text x="32" y="577" font-family="Courier, monospace" font-size="10" fill="#94a3b8">GPS: 12.9784° N, 77.6408° E | CITIZEN CAM</text>
  </svg>
  `;

  // 2. GENUINE AFTER: Same camera perspective & identical invariant landmarks,
  // but pothole is completely filled with fresh, hot-mix bituminous compacted asphalt.
  const genuineAfterSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="40%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <!-- Fresh hot-mix compacted asphalt patch: dense, dark charcoal, smooth rolled edges -->
      <radialGradient id="freshPatch" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="80%" stop-color="#111827"/>
        <stop offset="98%" stop-color="#1f2937"/>
        <stop offset="100%" stop-color="#374151"/>
      </radialGradient>
      <linearGradient id="blueWall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>

    <!-- Sky / distant background (Identical) -->
    <rect width="800" height="180" fill="#94a3b8"/>

    <!-- Invariant Landmark 1: Blue Compound Wall (IDENTICAL PERSPECTIVE) -->
    <rect x="0" y="80" width="600" height="100" fill="url(#blueWall)"/>
    <text x="30" y="140" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff" letter-spacing="2">INDIRANAGAR WARD 84 - 100FT RD</text>
    <rect x="0" y="175" width="600" height="8" fill="#1e293b"/>

    <!-- Invariant Landmark 2: BESCOM Transformer Box / Post (IDENTICAL PERSPECTIVE) -->
    <rect x="620" y="50" width="130" height="170" rx="8" fill="#dc2626" stroke="#991b1b" stroke-width="4"/>
    <rect x="635" y="70" width="100" height="40" fill="#fef2f2"/>
    <text x="645" y="95" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#991b1b">BESCOM D-12</text>
    <polygon points="685,120 670,150 682,150 678,175 700,140 688,140" fill="#eab308"/>
    <rect x="675" y="220" width="20" height="160" fill="#64748b"/>

    <!-- Invariant Landmark 3: Municipal Kerb / Curb (IDENTICAL PERSPECTIVE) -->
    <rect x="0" y="180" width="800" height="45" fill="#facc15"/>
    <polygon points="40,180 80,180 40,225 0,225" fill="#0f172a"/>
    <polygon points="140,180 180,180 140,225 100,225" fill="#0f172a"/>
    <polygon points="240,180 280,180 240,225 200,225" fill="#0f172a"/>
    <polygon points="340,180 380,180 340,225 300,225" fill="#0f172a"/>
    <polygon points="440,180 480,180 440,225 400,225" fill="#0f172a"/>
    <polygon points="540,180 580,180 540,225 500,225" fill="#0f172a"/>
    <polygon points="640,180 680,180 640,225 600,225" fill="#0f172a"/>
    <polygon points="740,180 780,180 740,225 700,225" fill="#0f172a"/>

    <!-- Road Surface Asphalt -->
    <rect x="0" y="225" width="800" height="375" fill="url(#asphalt)"/>

    <!-- Previous cracks sealed/overlaid -->
    <path d="M 120 320 Q 180 335 220 355" stroke="#1e293b" stroke-width="2" fill="none"/>
    <path d="M 540 370 Q 620 450 690 520" stroke="#1e293b" stroke-width="2" fill="none"/>

    <!-- SUCCESSFUL REPAIR: Flush Bituminous Machine-Rolled Compacted Patch -->
    <!-- Bitumen emulsion seal border -->
    <ellipse cx="380" cy="415" rx="195" ry="115" fill="#050811" stroke="#000000" stroke-width="3"/>
    <!-- Fresh dense compacted surface -->
    <ellipse cx="380" cy="415" rx="188" ry="108" fill="url(#freshPatch)"/>
    <!-- Fine roller compression texture lines -->
    <path d="M 230 405 Q 380 420 530 405" stroke="#1f2937" stroke-width="2" stroke-dasharray="8,6" fill="none"/>
    <path d="M 240 430 Q 380 445 520 430" stroke="#1f2937" stroke-width="2" stroke-dasharray="10,8" fill="none"/>
    <path d="M 260 455 Q 380 470 500 455" stroke="#1f2937" stroke-width="2" stroke-dasharray="8,6" fill="none"/>

    <!-- Contractor Traffic Safety Cones nearby -->
    <polygon points="160,330 180,330 174,270 166,270" fill="#f97316"/>
    <rect x="156" y="328" width="28" height="6" fill="#f97316"/>
    <rect x="168" y="285" width="4" height="6" fill="#ffffff"/>

    <polygon points="580,340 600,340 594,280 586,280" fill="#f97316"/>
    <rect x="576" y="338" width="28" height="6" fill="#f97316"/>
    <rect x="588" y="295" width="4" height="6" fill="#ffffff"/>

    <!-- Metadata Watermark -->
    <rect x="20" y="540" width="400" height="42" rx="6" fill="#000000" fill-opacity="0.8"/>
    <text x="32" y="565" font-family="Courier, monospace" font-size="13" fill="#22c55e">CONTRACTOR PROOF: VERIFIED WORK</text>
    <text x="32" y="577" font-family="Courier, monospace" font-size="10" fill="#94a3b8">GPS: 12.97842° N, 77.64082° E | DELTA: 2.1m</text>
  </svg>
  `;

  // 3. FRAUD BEFORE: Pothole on Domlur road with tree and shop awning
  const fraudBeforeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#475569"/>
        <stop offset="50%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <radialGradient id="hole" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="70%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#334155"/>
      </radialGradient>
    </defs>

    <!-- Background buildings -->
    <rect width="800" height="200" fill="#64748b"/>
    <!-- Yellow bakery storefront -->
    <rect x="60" y="40" width="340" height="160" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
    <text x="90" y="110" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="#854d0e">DOMLUR FRESH BAKERY</text>
    <polygon points="50,150 410,150 390,190 70,190" fill="#e11d48"/>

    <!-- Invariant Landmark: Large Gulmohar Tree trunk -->
    <path d="M 620 0 Q 640 100 610 200 L 670 200 Q 690 100 660 0 Z" fill="#78350f"/>
    <!-- Green foliage -->
    <circle cx="640" cy="30" r="90" fill="#15803d" fill-opacity="0.9"/>
    <circle cx="580" cy="40" r="70" fill="#16a34a" fill-opacity="0.8"/>

    <!-- Concrete Footpath Curb -->
    <rect x="0" y="190" width="800" height="40" fill="#94a3b8"/>
    <line x1="0" y1="210" x2="800" y2="210" stroke="#cbd5e1" stroke-width="3"/>

    <!-- Road Carriageway -->
    <rect x="0" y="230" width="800" height="370" fill="url(#road)"/>

    <!-- The Road Damage: Open Pothole -->
    <ellipse cx="360" cy="420" rx="170" ry="90" fill="url(#hole)" stroke="#020617" stroke-width="6"/>
    <!-- Debris & jagged edges inside -->
    <polygon points="260,390 280,410 250,420" fill="#94a3b8"/>
    <polygon points="430,420 460,440 440,450" fill="#64748b"/>
    <circle cx="340" cy="430" r="25" fill="#020617"/>

    <!-- Watermark -->
    <rect x="20" y="540" width="360" height="42" rx="6" fill="#000000" fill-opacity="0.75"/>
    <text x="32" y="565" font-family="Courier, monospace" font-size="13" fill="#f87171">BBMP INTAKE: TICKET-BLR-112-204</text>
    <text x="32" y="577" font-family="Courier, monospace" font-size="10" fill="#94a3b8">DOMLUR BDA COMPLEX | ROAD CAVITY</text>
  </svg>
  `;

  // 4. FRAUD AFTER (Cosmetic Dirt Sprinkle / Uncompacted Rubble / Ephemeral Fake Work):
  // Contractor poured loose yellow mud/gravel over the hole without compaction,
  // cavity edges still clearly visible, no bitumen, completely substandard fake fix!
  const fraudAfterSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#475569"/>
        <stop offset="50%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <!-- Loose uncompacted dirt/mud texture -->
      <radialGradient id="looseDirt" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#b45309"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="85%" stop-color="#78350f"/>
        <stop offset="100%" stop-color="#451a03"/>
      </radialGradient>
    </defs>

    <!-- Background buildings (Identical) -->
    <rect width="800" height="200" fill="#64748b"/>
    <rect x="60" y="40" width="340" height="160" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
    <text x="90" y="110" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="#854d0e">DOMLUR FRESH BAKERY</text>
    <polygon points="50,150 410,150 390,190 70,190" fill="#e11d48"/>

    <!-- Tree trunk (Identical) -->
    <path d="M 620 0 Q 640 100 610 200 L 670 200 Q 690 100 660 0 Z" fill="#78350f"/>
    <circle cx="640" cy="30" r="90" fill="#15803d" fill-opacity="0.9"/>
    <circle cx="580" cy="40" r="70" fill="#16a34a" fill-opacity="0.8"/>

    <!-- Footpath Curb -->
    <rect x="0" y="190" width="800" height="40" fill="#94a3b8"/>
    <line x1="0" y1="210" x2="800" y2="210" stroke="#cbd5e1" stroke-width="3"/>

    <!-- Road Carriageway -->
    <rect x="0" y="230" width="800" height="370" fill="url(#road)"/>

    <!-- FRAUDULENT COSMETIC ATTEMPT: -->
    <!-- Original deep hole perimeter still clearly concave and unsealed -->
    <ellipse cx="360" cy="420" rx="170" ry="90" fill="#1e293b" stroke="#78350f" stroke-width="4"/>

    <!-- Loose mud/soil dumped unevenly, unrolled, no hot-mix bitumen -->
    <ellipse cx="355" cy="415" rx="140" ry="70" fill="url(#looseDirt)"/>

    <!-- Scattered loose gravel stones on top of mud -->
    <polygon points="270,390 285,405 275,415 260,400" fill="#e2e8f0"/>
    <polygon points="340,380 355,390 345,400" fill="#cbd5e1"/>
    <polygon points="410,410 430,425 415,435" fill="#f1f5f9"/>
    <polygon points="310,440 330,455 315,465" fill="#cbd5e1"/>
    <polygon points="380,430 400,445 385,455" fill="#e2e8f0"/>
    <polygon points="440,395 455,405 445,415" fill="#cbd5e1"/>

    <!-- Hollow uncompacted depressed depression still sunken below road level -->
    <ellipse cx="360" cy="420" rx="80" ry="35" fill="#451a03" fill-opacity="0.5"/>

    <!-- Warning / Contractor Watermark -->
    <rect x="20" y="540" width="410" height="42" rx="6" fill="#000000" fill-opacity="0.8"/>
    <text x="32" y="565" font-family="Courier, monospace" font-size="13" fill="#f59e0b">CONTRACTOR SUBMISSION: CLAIMED REPAIR</text>
    <text x="32" y="577" font-family="Courier, monospace" font-size="10" fill="#ef4444">FLAG: UNCOMPACTED SOIL / NO BITUMEN DETECTED</text>
  </svg>
  `;

  // Render using sharp
  const targets = [
    { name: "genuine-before.jpg", svg: genuineBeforeSvg },
    { name: "genuine-after.jpg", svg: genuineAfterSvg },
    { name: "fraud-before.jpg", svg: fraudBeforeSvg },
    { name: "fraud-after.jpg", svg: fraudAfterSvg },
  ];

  for (const item of targets) {
    const filePath = path.join(demoDir, item.name);
    await sharp(Buffer.from(item.svg))
      .jpeg({ quality: 92 })
      .toFile(filePath);
    const stats = fs.statSync(filePath);
    console.log(`🖼️  Generated: public/demo/${item.name} (${Math.round(stats.size / 1024)} KB)`);
  }

  console.log("\n✅ All 4 demo forensic asset pairs generated successfully in public/demo/");
  console.log("   • public/demo/genuine-before.jpg");
  console.log("   • public/demo/genuine-after.jpg");
  console.log("   • public/demo/fraud-before.jpg");
  console.log("   • public/demo/fraud-after.jpg");
  console.log("================================================================================");
}

generateDemoAssets().catch((err) => {
  console.error("Asset generation error:", err);
  process.exit(1);
});
