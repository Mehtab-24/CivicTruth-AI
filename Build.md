# 72-Hour Solo Sprint Plan: CivicTruth AI

## BUILD.md – Antigravity & Agent Skills Execution Strategy

---

## Development Principles

> Leveraging **Addy Osmani's agent-skills pack** for AI-assisted solo development.

| Principle | Agent Skill | Application |
|-----------|-------------|-------------|
| **Spec-First** | `/agent-skills:spec-driven-development` | Generate architecture and data contracts before writing code |
| **Type Safety** | `/agent-skills:api-and-interface-design` | Define all data schemas using TypeScript and Zod upfront |
| **Clean UI** | `/agent-skills:frontend-ui-engineering` | Build high-contrast, accessible civic interfaces using Tailwind and Shadcn |
| **Incremental Slices** | `/agent-skills:incremental-implementation` | Implement features in small, testable increments |
| **Pre-Merge Audits** | `/agent-skills:code-review-and-quality` | Validate code health, security, and edge cases |

---

## Hour 0 – 12: Project Setup & Core AI Pipelines

### Task 1.1: Scaffolding

Initialize the application and install required dependencies:

```bash
npx create-next-app@latest civictruth-ai \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd civictruth-ai

npm install @google/genai zod lucide-react clsx tailwind-merge leaflet react-leaflet

npm install -D @types/leaflet

npx shadcn@latest init

npx shadcn@latest add button card badge input textarea alert dialog tabs table
```

---

### Task 1.2: Google GenAI Client Setup

Create `src/lib/gemini.ts` to initialize the Google GenAI SDK:

```typescript
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not defined");
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

---

### Task 1.3: Verification Engine API Route

Create `src/app/api/audit/verify/route.ts`:

| Step | Action |
|------|--------|
| 1 | Accepts multipart form-data: `ticketId`, `originalImageUrl`, `contractorImage` (file), and `gpsCoords` |
| 2 | Fetches the original image buffer and converts the contractor image to an inline base64 part |
| 3 | Calls `ai.models.generateContent` using `gemini-1.5-pro` with `responseMimeType: "application/json"` and `responseSchema` |
| 4 | Validates the response against `VerificationAuditSchema` |
| 5 | Writes the audit result to Firestore and returns the decision |

---

## Hour 13 – 36: User Portals & Interactive Workflows

### Task 2.1: Citizen Intake Portal (`/report`)

- Include an **audio recorder component** using the browser `MediaRecorder` API (`audio/webm;codecs=opus`).
- Include a **photo capture input**:
  ```html
  <input type="file" accept="image/*" capture="environment" />
  ```
- Send submissions to `POST /api/tickets/intake`, which processes the audio using **Gemini 1.5 Flash** to extract:
  - Category
  - Severity
  - Description

---

### Task 2.2: Contractor Resolution Portal (`/contractor`)

- Display a list of active tickets filtered by ward.
- Ticket detail view shows:
  - Hazard photo
  - Issue description
  - Location details
  - SLA countdown timer
- Submission modal includes:
  - **Live GPS validation** checking that the device is within **50 meters** of the incident site.
  - **Live camera photo capture** for resolution proof.
  - Submit button triggering the visual verification audit.
- Show instant audit results on submission:

  ```text
  ✅ Score ≥ 70%  →  Green banner (VERIFIED_RESOLVED)
  ❌ Score < 70%  →  Red alert (REJECTED_AUDIT_FAILED)
                     Shows reasoning + requires resubmission
  ```

---

## Hour 37 – 54: Executive Dashboard & Geospatial Mapping

### Task 3.1: Municipal Executive Portal (`/admin`)

| Component | Details |
|-----------|---------|
| **Metric Cards** | Total Grievances, Auto-Verified Rate, Flagged Contractor Fraud Attempts, SLA Compliance Rate |
| **Contractor Scoreboard** | Ranked list of contractors by verification pass rates and average turnaround times |
| **Audit Review Queue** | Table of all completed audits with side-by-side Before/After image comparisons and Gemini confidence scores |

---

### Task 3.2: Geospatial Map Layer (`/admin/map`)

- Integrate **React-Leaflet** to display ward boundaries and incident markers.
- Color-coded map pins:

  | Pin Color | Meaning |
  |-----------|---------|
  | 🔴 Red | Open hazard / Pending repair |
  | 🟡 Yellow | Audit failed / Escalated for rework |
  | 🟢 Green | Verified resolved |

---

## Hour 55 – 72: Data Seeding, Polish, and Video Demo Preparation

### Task 4.1: Seed Realistic Public Municipal Data

Create a seeding script `scripts/seed.ts` to populate Firestore with **15 realistic civic tickets** across **3 municipal wards**:

| Ward | Area | Tickets |
|------|------|---------|
| Ward 84 | Indiranagar | 3 deep asphalt potholes, 2 overflowing garbage bins |
| Ward 112 | Domlur | 2 blocked stormwater drains, 1 broken street fixture |
| Ward 150 | Bellandur | 4 mixed road and drainage issues |

> Include authentic municipal categories matching real grievance portals like **CPGRAMS** and **BBMP Sahaaya**.

---

### Task 4.2: Prepare Demo Image Pairs

Prepare two tested Before/After image pairs for the live presentation:

#### Test Pair A – Fraudulent Attempt

| | Description |
|--|-------------|
| **Before** | Deep asphalt pothole |
| **After** | A different road section or an unchanged hazard with cosmetic dirt fill |
| **Expected Result** | System rejects with **< 25% confidence**, flagging the mismatched landmarks |

#### Test Pair B – Genuine Resolution

| | Description |
|--|-------------|
| **Before** | Pothole in front of a blue storefront |
| **After** | Fresh asphalt patch in front of the same blue storefront |
| **Expected Result** | System approves with **> 90% confidence**, confirming landmark alignment and proper bituminous compaction |

---

### Task 4.3: Deployment & Walkthrough Recording

- Deploy the production build to **Google Cloud Run** or **Vercel**.
- Record a clear **3-minute video walkthrough** covering:

  | Timestamp | Content |
  |-----------|---------|
  | 0:00 – 0:40 | The problem of unverified ticket closures in civic portals |
  | 0:40 – 1:15 | Live citizen voice-first grievance submission |
  | 1:15 – 2:00 | Contractor fraud attempt and instant AI rejection |
  | 2:00 – 2:30 | Genuine repair submission and instant AI verification |
  | 2:30 – 3:00 | Executive dashboard, contractor accountability metrics, and map view |

---

## Sprint Timeline Overview

```text
Hour 0 ─────────────── 12 ──────────────────── 36 ──────────────────── 54 ──────────── 72
  │                      │                        │                        │              │
  ▼                      ▼                        ▼                        ▼              ▼
┌──────────────────┐ ┌──────────────────────┐ ┌────────────────────┐ ┌──────────────────┐
│  SETUP &         │ │  USER PORTALS &      │ │  DASHBOARD &       │ │  SEED, POLISH    │
│  AI PIPELINES    │ │  WORKFLOWS           │ │  GEOSPATIAL MAP    │ │  & DEMO VIDEO    │
├──────────────────┤ ├──────────────────────┤ ├────────────────────┤ ├──────────────────┤
│ • Scaffolding    │ │ • Citizen Intake     │ │ • Admin Metrics    │ │ • Seed Data      │
│ • GenAI Client   │ │ • Contractor Portal  │ │ • Contractor Board │ │ • Demo Pairs     │
│ • Audit API      │ │ • Live Capture       │ │ • Audit Queue      │ │ • Deploy         │
│ • Firestore Init │ │ • Geofence Check     │ │ • Leaflet Map      │ │ • Record Video   │
└──────────────────┘ └──────────────────────┘ └────────────────────┘ └──────────────────┘
```

---

## Environment Variables Checklist

```bash
# .env.local

GEMINI_API_KEY=your_gemini_api_key_here
FIRESTORE_PROJECT_ID=your_firestore_project_id
CLOUD_STORAGE_BUCKET=your_bucket_name.appspot.com
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## Acceptance Criteria (Sprint Definition of Done)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Citizen can submit voice + photo grievance and receive structured JSON extraction | ☐ |
| 2 | Contractor can view assigned tickets with SLA countdown | ☐ |
| 3 | Contractor photo submission is geofence-validated (≤ 50m) | ☐ |
| 4 | AI audit returns structured `VerificationAuditSchema`-compliant JSON | ☐ |
| 5 | Fraudulent photo pair is rejected with < 25% confidence | ☐ |
| 6 | Genuine photo pair is approved with > 90% confidence | ☐ |
| 7 | Executive dashboard displays integrity scores and SLA metrics | ☐ |
| 8 | Leaflet map renders color-coded pins for all ticket statuses | ☐ |
| 9 | Application deploys successfully to Vercel / Cloud Run | ☐ |
| 10 | 3-minute demo video recorded and uploaded | ☐ |

---

## Document Metadata

| Field | Value |
|-------|-------|
| **Document Title** | CivicTruth AI – BUILD.md (72-Hour Solo Sprint Plan) |
| **Version** | 1.0 |
| **Date** | 2026-09-27 |
| **Status** | Draft |
| **Methodology** | Antigravity + Agent Skills (Addy Osmani) |

---

*End of Document*