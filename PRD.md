# Product Requirements Document (PRD): CivicTruth AI

---

## 1. Executive Summary & Problem Context

In municipal governance systems (such as **CPGRAMS**, state **CM Helplines**, and municipal portals like **BBMP Sahaaya** or **PMC CARE**), the most pervasive point of failure is **premature ticket closure**. Field contractors routinely mark tickets as resolved without performing the required repairs. Because municipal engineers cannot manually inspect thousands of distributed public works tickets across widespread urban wards, false resolutions go unchecked, undermining public trust and leaving civic hazards unresolved.

**CivicTruth AI** is an automated audit and verification agent for Digital Public Infrastructure (DPI). It uses multimodal visual reasoning to independently evaluate contractor repair proof against original citizen complaints before any ticket can be closed.

---

## 2. Core User Personas

| Persona | Need |
|---------|------|
| **The Citizen (Complainant)** | An effortless, voice-first intake process in their native language to report civic issues without navigating complex forms. |
| **The Municipal Contractor (Field Worker)** | A fast, simple mobile workflow to review assigned work orders and submit photographic proof of completed repairs. |
| **The Ward Executive Engineer / MP Nodal Officer** | An automated oversight dashboard showing contractor compliance, SLA countdowns, recurring civic issues, and flagged fraud attempts. |

---

## 3. Functional Requirements

### 3.1 Citizen Grievance Intake

- **FR-1.1 (Multimodal Voice Input):** Ingest voice notes (in Hindi, Tamil, Telugu, Kannada, or English) alongside a photo taken at the site.

- **FR-1.2 (Direct Audio-to-JSON Parsing):** Pass the raw audio stream to **Gemini 1.5 Flash** to extract:
  - Issue category
  - Priority score
  - Concise summary
  - Landmark descriptors

- **FR-1.3 (Spatial Tagging):** Capture precise device GPS coordinates (`latitude`, `longitude`) and store them in the incident record.

---

### 3.2 Contractor Resolution Workflow

- **FR-2.1 (Work Order Intake):** Display assigned tickets with countdown timers based on official municipal Service Level Agreements (SLAs).

- **FR-2.2 (Live In-App Photo Capture):** Restrict submission to live camera capture (`capture="environment"`), blocking uploaded gallery images to prevent recycling past photos.

- **FR-2.3 (Geofence Validation):** Verify that the contractor's device is within **50 meters** of the original complaint coordinates during upload.

---

### 3.3 Autonomous Multimodal Audit Engine

- **FR-3.1 (Before/After Comparative Analysis):** Gemini 1.5 Pro inspects the original hazard image alongside the contractor's repair photo.

- **FR-3.2 (Landmark Alignment):** Check for matching background structural markers (compound walls, utility poles, windows, curb lines).

- **FR-3.3 (Material Quality Verification):** Verify that appropriate repair materials were used:
  - *Potholes:* Compacted bituminous asphalt vs. loose dirt
  - *Garbage dumps:* Clean pavement vs. remaining debris

- **FR-3.4 (Automated Decisioning Gate):**

  ```text
  IF Confidence Score ≥ 70%:
      → Ticket status = VERIFIED_RESOLVED

  IF Confidence Score < 70%:
      → Ticket status = REJECTED_AUDIT_FAILED
      → Alert contractor to redo work
      → Notify supervising engineer
  ```

---

### 3.4 Municipal Executive Dashboard

- **FR-4.1 (Contractor Integrity Score):** Calculate a live reliability rating for each contractor based on verification success rates:

  ```text
  Integrity Score = (Verified Tickets / Total Submissions) × 100
  ```

- **FR-4.2 (SLA Breach Alerts):** Highlight tickets approaching SLA deadlines with automated priority escalation.

- **FR-4.3 (Geospatial Hazard Map):** Interactive map showing:
  - Open issues
  - Pending audits
  - Verified resolutions

---

## 4. Non-Functional Requirements

| ID | Requirement | Specification |
|----|-------------|---------------|
| **NFR-1** | Inference Latency | Voice intake processing < **3.5 seconds**; Before/After visual audits < **5.0 seconds** |
| **NFR-2** | Mobile Optimization | Responsive web app for low-end Android on 3G/4G; initial asset payload < **250 KB** |
| **NFR-3** | Deterministic Outputs | 100% of LLM calls return schema-compliant JSON validated with **Zod**, with automatic retry handling for parsing errors |

---

## 5. Success Metrics & Key Performance Indicators (KPIs)

| Metric Type | Target |
|-------------|--------|
| **Primary Metric** | Elimination of unverified, false ticket closures |
| **Secondary Metric** | **75% reduction** in ticket triage and routing time for municipal ward officers |
| **Contractor Accountability** | Flagging **100%** of mismatched or recycled photo submissions during testing |

---

## 6. Scope & Constraints

### In Scope

- Voice-first grievance intake in 5 languages
- AI-driven before/after photo verification
- Geofence-locked contractor proof submission
- Real-time municipal executive dashboard
- Contractor integrity scoring

### Out of Scope (v1.0)

- Native mobile applications (iOS / Android)
- Integration with existing state ERP / HRMS systems
- Citizen-facing resolution notification via SMS/WhatsApp (planned v1.1)
- Multi-language dashboard UI (English-only in v1.0)

---

## 7. Assumptions & Dependencies

| # | Assumption / Dependency |
|---|------------------------|
| 1 | Municipal ward boundaries and SLA definitions are available as structured configuration data |
| 2 | Contractors have access to GPS-enabled Android smartphones with rear cameras |
| 3 | Gemini 1.5 Pro and Flash APIs maintain < 5s inference latency at target concurrency |
| 4 | Cloud Firestore read/write quotas accommodate projected peak load (~5,000 tickets/day) |
| 5 | Network connectivity (3G/4G) is available at all contractor work sites |

---

## 8. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Contractor submits photo from correct GPS but wrong angle | Medium | Medium | Landmark alignment check enforces ≥ 2 invariant background matches |
| Gemini hallucination produces false PASS | Low | High | Confidence threshold gate at 70%; sub-40% triggers MANUAL_INSPECTION_REQUIRED |
| Network timeout during image upload on 3G | High | Low | Client-side compression (< 1 MB); resumable upload with exponential backoff |
| Prompt injection via text overlay in contractor photo | Low | High | System prompt explicitly instructs model to disregard adversarial overlays |
| SLA deadline data unavailable for certain ticket types | Medium | Medium | Default SLA fallback (72 hours) with admin override |

---

## 9. Release Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **Phase 1 – MVP** | Weeks 1–4 | Voice intake, photo upload, Gemini audit engine, basic dashboard |
| **Phase 2 – Hardening** | Weeks 5–6 | Geofence enforcement, contractor integrity scoring, SLA alerts |
| **Phase 3 – Scale** | Weeks 7–8 | Geospatial map, multi-ward support, load testing at 5K tickets/day |
| **Phase 4 – Pilot** | Weeks 9–10 | Live pilot in 2 municipal wards; feedback loop; threshold tuning |

---

## 10. Approval & Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | _________________ | __________ | ________ |
| Engineering Lead | _________________ | __________ | ________ |
| Municipal Nodal Officer | _________________ | __________ | ________ |

---

## Document Metadata

| Field | Value |
|-------|-------|
| **Document Title** | CivicTruth AI – Product Requirements Document |
| **Version** | 1.0 |
| **Date** | 2026-09-27 |
| **Status** | Draft |
| **Classification** | Internal |

---

*End of Document*