"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FilePlus,
  Wrench,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Sparkles,
  Zap,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const [simulationMode, setSimulationMode] = useState<"genuine" | "fraud">("genuine");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. HERO SECTION WITH SPLIT INTERACTIVE AUDIT SHOWCASE */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Authoritative Civic Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Digital Public Infrastructure • Bangalore Municipal Corporation (BBMP)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Closing the <span className="text-emerald-400">Verification Gap</span> in Municipal Governance.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Eliminating premature grievance closure and contractor fraud through autonomous
                multimodal physical auditing powered by Google Gemini. Validates invariant landmarks,
                material compaction, and 50-meter geofences before public funds are disbursed.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/report"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-98"
                >
                  <FilePlus className="h-4 w-4" />
                  <span>Launch Citizen Intake</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contractor"
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-98"
                >
                  <Wrench className="h-4 w-4 text-blue-400" />
                  <span>Contractor Portal</span>
                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  <span>Executive Telemetry</span>
                </Link>
              </div>

              {/* Language & DPI tags */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                  Voice Intake in 5 Languages: Kannada, Hindi, Tamil, Telugu, English
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                  Zero-Trust 50m Haversine Geofencing
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Live Audit Showcase Widget */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-md">
                
                {/* Showcase Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Live AI Gate Simulator
                      </span>
                      <h2 className="text-xs sm:text-sm font-bold text-white">
                        Forensic Dual-Image Verification
                      </h2>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    TICKET-BLR-84-101
                  </span>
                </div>

                {/* Mode Selector Toggle */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSimulationMode("genuine")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      simulationMode === "genuine"
                        ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Genuine Fix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulationMode("fraud")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      simulationMode === "fraud"
                        ? "bg-red-500 text-white shadow-md font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Fraud Attempt</span>
                  </button>
                </div>

                {/* Before / After Dual Image Frame */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Before */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Original Hazard
                    </span>
                    <div className="relative h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src="/demo/genuine-before.jpg"
                        alt="Original pothole hazard on 100 Feet Road"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-slate-300">
                        Citizen Photo
                      </div>
                    </div>
                  </div>

                  {/* After (Dynamically swapped based on toggle) */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Contractor Proof
                    </span>
                    <div className="relative h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={simulationMode === "genuine" ? "/demo/genuine-after.jpg" : "/demo/fraud-after.jpg"}
                        alt={simulationMode === "genuine" ? "Compacted hot-mix asphalt repair" : "Uncompacted superficial dirt attempt"}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      <div className={`absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono text-white ${
                        simulationMode === "genuine" ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300" : "bg-red-950/80 border border-red-500/40 text-red-300"
                      }`}>
                        {simulationMode === "genuine" ? "Hot-Mix Patch" : "Cosmetic Dirt"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic AI Audit Verdict Card */}
                {simulationMode === "genuine" ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-emerald-300">
                          VERIFIED RESOLVED – PASS
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums tracking-wider uppercase">
                        94% Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-mono">Material Analysis</span>
                        <span className="font-semibold text-slate-200">
                          Hot-mix asphalt (EXCELLENT)
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-mono">Landmark Consistency</span>
                        <span className="font-semibold text-emerald-300 font-mono text-[10px]">
                          HIGH (BESCOM Box D-12)
                        </span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-400/90 font-medium border-t border-emerald-500/20">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Treasury Status:</span>
                      <span className="font-bold">Fund Disbursal Approved</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                        <span className="text-xs font-bold text-red-300">
                          REJECTED – CIVIC AUDIT FAILED
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-red-400 tabular-nums tracking-wider uppercase">
                        18% Confidence
                      </span>
                    </div>

                    <p className="text-[11px] text-red-200 leading-snug">
                      Superficial uncompacted dirt detected over open cavity. Lacks bituminous seal; will fail under monsoon rain.
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-red-400 font-medium border-t border-red-500/20">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-red-400/80">Action:</span>
                      <span className="font-bold">Contractor Penalized • Work Re-issued</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-center">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wide">
                    Model: Google Gemini 2.5 Pro / Flash • 50m Geofence Validated
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MUNICIPAL TELEMETRY RIBBON */}
      <section className="border-b border-slate-800/80 bg-slate-900/40 py-6 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-3 rounded-xl border border-slate-800/60 bg-slate-950/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums block">
                15 Wards
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Bangalore Zones Monitored
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/60 bg-slate-950/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight tabular-nums block">
                0 Unverified
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Automated False Closures
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/60 bg-slate-950/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tracking-tight tabular-nums block">
                &lt; 2.4s
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Multimodal Audit Latency
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/60 bg-slate-950/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono tracking-tight tabular-nums block">
                100%
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                50m Geofence Compliance
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL COMPARISON: THE ACCOUNTABILITY CRISIS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950">
        <div className="mx-auto max-w-5xl space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Comparative Analysis
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              The Municipal Accountability Crisis
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              How traditional grievance portals fail communities, and how autonomous physical verification restores trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Left: Legacy Portals */}
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Legacy Grievance Portals</h3>
                  <span className="text-xs text-red-300/80 font-mono">BBMP Sahaaya • CPGRAMS • Swachhata</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Contractor Self-Certification:</strong> Tickets are marked resolved by the contractor with zero independent physical check.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Cosmetic Dirt Spoofing:</strong> Loose dirt sprinkled into craters registers as a valid fix, only to wash away in 48 hours.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Zero Invariant Tracking:</strong> Photos from different streets or camera angles pass through overwhelmed manual reviewers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Premature Treasury Drain:</strong> Municipal budgets are disbursed for phantom repairs while citizen road hazard persists.</span>
                </li>
              </ul>
            </div>

            {/* Right: CivicTruth AI */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">CivicTruth AI Multi-Tier Gate</h3>
                  <span className="text-xs text-emerald-300 font-mono">Autonomous Digital Public Infrastructure</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Dual-Image Multimodal Audit:</strong> Compares citizen grievance with contractor resolution proof using Google Gemini.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Material Compaction Analysis:</strong> Distinguishes dense machine-rolled asphalt from superficial loose sand.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Invariant Landmark Matching:</strong> Locks onto permanent anchors (transformers, curbs, metro pillars) to guarantee perspective.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Cryptographic Disbursal Lock:</strong> Public funds are authorized only when confidence exceeds 70% and geofence is respected.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. THREE CORE USER PORTALS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/30">
        <div className="mx-auto max-w-6xl space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Interactive Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              End-to-End Civic Accountability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Citizen Intake Card */}
            <Link
              href="/report"
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <FilePlus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Citizen Voice Intake
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Report potholes, open drains, or garbage accumulation in native audio (Kannada, Hindi, Tamil, Telugu, or English) with automatic AI triage and SLA tracking.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span>File Grievance</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Contractor Portal Card */}
            <Link
              href="/contractor"
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-blue-500/50 hover:bg-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  Field Contractor Portal
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access assigned municipal work orders, track SLA countdowns, and submit geofenced photo proof with 1-click hackathon demo presets for instant AI audit.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <span>View Work Orders</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Executive Telemetry Card */}
            <Link
              href="/admin"
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:bg-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  Executive Ward Telemetry
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive React-Leaflet GIS map across Bangalore Wards (84, 112, 150), contractor integrity rankings, and side-by-side forensic audit inspection dossiers.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                <span>Open Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to Verify Public Infrastructure?
          </h2>
          <p className="text-sm text-slate-400">
            CivicTruth AI is built for the &ldquo;Build with AI: Code for Communities&rdquo; hackathon (Track 1: Digital Public Infrastructure &amp; Governance).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/report"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
            >
              Report a Civic Hazard
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Explore Ward GIS Telemetry
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
