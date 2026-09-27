"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  Filter,
  RefreshCw,
  Search,
  Eye,
  FileCheck2,
  XCircle,
  BarChart3,
} from "lucide-react";
import { Ticket } from "@/lib/store";
import {
  calculateAdminMetrics,
  calculateContractorIntegrityScores,
  AdminMetrics,
  ContractorIntegrityScore,
} from "@/lib/metrics";
import { DynamicWardMap } from "@/components/DynamicWardMap";
import { AuditInspectionModal } from "@/components/AuditInspectionModal";

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab: "MAP" | "CONTRACTORS" | "AUDITS"
  const [activeTab, setActiveTab] = useState<"MAP" | "CONTRACTORS" | "AUDITS">("MAP");

  // Filters
  const [selectedWard, setSelectedWard] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Inspection
  const [inspectTicket, setInspectTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load municipal telemetry.");
      }
      setTickets(data.tickets);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading dashboard";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const metrics: AdminMetrics = calculateAdminMetrics(tickets);
  const contractorScores: ContractorIntegrityScore[] = calculateContractorIntegrityScores(tickets);

  const filteredTickets = tickets.filter((t) => {
    if (selectedWard !== "ALL" && t.location.wardNumber !== selectedWard) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.contractorName && t.contractorName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const auditedTickets = filteredTickets.filter(
    (t) =>
      t.status === "VERIFIED_RESOLVED" ||
      t.status === "REJECTED_AUDIT_FAILED" ||
      t.status === "MANUAL_INSPECTION_REQUIRED" ||
      t.auditTrail.length > 0
  );

  return (
    <main className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Municipal Operations Control Room
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Executive Telemetry & Governance
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Real-time Digital Public Infrastructure (DPI) audit verification and contractor accountability monitoring.
            </p>
          </div>

          <button
            onClick={fetchTickets}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            Refresh Telemetry
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs sm:text-sm text-red-300">
            {error}
          </div>
        )}

        {/* 1. TOP METRIC SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Grievances */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Municipal Grievances</span>
              <Layers className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {metrics.totalGrievances}
              </span>
              <span className="text-xs text-zinc-400">logged</span>
            </div>
            <div className="text-[11px] text-zinc-500 flex gap-2">
              <span>
                <span className="font-mono tracking-tight tabular-nums font-semibold">{metrics.openTicketsCount}</span> active open
              </span>
              <span>•</span>
              <span className="text-emerald-400">
                <span className="font-mono tracking-tight tabular-nums font-semibold">{metrics.verifiedCount}</span> verified
              </span>
            </div>
          </div>

          {/* Autonomous Verification Rate */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
              <span>Autonomous Verification Rate</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight tabular-nums">
                {metrics.autonomousVerificationRate}%
              </span>
              <span className="text-xs text-emerald-400/80">accuracy</span>
            </div>
            <p className="text-[11px] text-emerald-500/80">
              Evaluated by Gemini 1.5 Pro multimodal vision
            </p>
          </div>

          {/* Prevented Fraud Attempts */}
          <div className="rounded-2xl border border-red-500/30 bg-red-950/15 p-5 space-y-2">
            <div className="flex items-center justify-between text-red-400 text-xs font-medium">
              <span>Prevented Fraud Attempts</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-red-400 font-mono tracking-tight tabular-nums">
                {metrics.failedAuditCount}
              </span>
              <span className="text-xs text-red-400/80">rejected closures</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Flagged recycled photos & substandard fill
            </p>
          </div>

          {/* Active SLA Breaches */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-5 space-y-2">
            <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
              <span>Active SLA Breaches</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight tabular-nums">
                {metrics.activeSlaBreaches}
              </span>
              <span className="text-xs text-amber-400/80">past deadline</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Immediate ward nodal officer intervention
            </p>
          </div>
        </div>

        {/* 2. TAB NAVIGATION & WARD SELECTOR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl border border-zinc-800 bg-zinc-900/60">
          {/* Tab Buttons (Horizontal scroll pills on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
            <button
              onClick={() => setActiveTab("MAP")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === "MAP"
                  ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Spatial Incident Map</span>
            </button>

            <button
              onClick={() => setActiveTab("CONTRACTORS")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === "CONTRACTORS"
                  ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Contractor Integrity</span>
            </button>

            <button
              onClick={() => setActiveTab("AUDITS")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === "AUDITS"
                  ? "bg-emerald-500 text-zinc-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Forensic Audit Queue</span>
            </button>
          </div>

          {/* Ward Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-1 sm:px-2 shrink-0">
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <select
              value={selectedWard}
              onChange={(e) =>
                setSelectedWard(e.target.value === "ALL" ? "ALL" : parseInt(e.target.value, 10))
              }
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Bangalore Wards</option>
              <option value={84}>Ward 84 – Indiranagar</option>
              <option value={112}>Ward 112 – Domlur</option>
              <option value={150}>Ward 150 – Bellandur</option>
            </select>
          </div>
        </div>

        {/* 3. TAB 1: SPATIAL INCIDENT MAP */}
        {activeTab === "MAP" && (
          <div className="space-y-4">
            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs">
              <span className="font-semibold text-zinc-300">Live Spatial Status Pins:</span>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-3 w-3 rounded-full bg-red-500 border border-white" />
                  Open / Assigned
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-3 w-3 rounded-full bg-amber-500 border border-white" />
                  Manual Review
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-3 w-3 rounded-full bg-red-700 border border-white" />
                  Audit Failed
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white" />
                  Verified Resolved
                </span>
              </div>
            </div>

            {/* Map Container */}
            <div className="h-[520px] w-full">
              <DynamicWardMap
                tickets={filteredTickets}
                onSelectTicket={(t) => setInspectTicket(t)}
                center={[12.965, 77.645]}
                zoom={13}
              />
            </div>
          </div>
        )}

        {/* 4. TAB 2: CONTRACTOR INTEGRITY SCOREBOARD */}
        {activeTab === "CONTRACTORS" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Municipal Agency Performance Ledger
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Ranked by Integrity Score = (Verified Tickets / Total Submissions) × 100
                  </p>
                </div>
                <Award className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Contractor Agency</th>
                      <th className="py-3 px-4 text-center">Assigned</th>
                      <th className="py-3 px-4 text-center">Audits</th>
                      <th className="py-3 px-4 text-center">Verified</th>
                      <th className="py-3 px-4 text-center">Fraud Caught</th>
                      <th className="py-3 px-4 text-center">SLA Compliance</th>
                      <th className="py-3 px-4">Integrity Rating</th>
                      <th className="py-3 px-4">Accountability Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {contractorScores.map((c) => {
                      const isTierA = c.tier === "TIER_A_TRUSTED";
                      const isTierB = c.tier === "TIER_B_PROBATIONARY";
                      return (
                        <tr key={c.contractorId} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div>{c.contractorName}</div>
                            <div className="text-[10px] text-zinc-500 font-mono tracking-tight tabular-nums">{c.contractorId}</div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tracking-tight tabular-nums">{c.totalAssigned}</td>
                          <td className="py-3.5 px-4 text-center font-mono tracking-tight tabular-nums">{c.totalSubmissions}</td>
                          <td className="py-3.5 px-4 text-center font-mono tracking-tight tabular-nums text-emerald-400 font-bold">
                            {c.verifiedCount}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tracking-tight tabular-nums text-red-400 font-bold">
                            {c.failedCount}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tracking-tight tabular-nums text-zinc-300">
                            {c.slaComplianceRate}%
                          </td>
                          <td className="py-3.5 px-4 min-w-[140px]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono tracking-tight tabular-nums font-bold text-sm">{c.integrityScore}%</span>
                              <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                   className={`h-full rounded-full ${
                                    isTierA ? "bg-emerald-400" : isTierB ? "bg-amber-400" : "bg-red-500"
                                  }`}
                                  style={{ width: `${c.integrityScore}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                                isTierA
                                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                                  : isTierB
                                  ? "bg-amber-950/60 text-amber-300 border-amber-500/30"
                                  : "bg-red-950/60 text-red-300 border-red-500/30"
                              }`}
                            >
                              {isTierA
                                ? "TIER A – TRUSTED"
                                : isTierB
                                ? "TIER B – PROBATIONARY"
                                : "TIER C – FLAGGED RISK"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB 3: FORENSIC AUDIT QUEUE */}
        {activeTab === "AUDITS" && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search audits by ticket ID, summary, category, or contractor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">Ward / Category</th>
                      <th className="py-3 px-4">Assigned Contractor</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">AI Confidence</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {auditedTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                          No completed or pending audits found for selected filters.
                        </td>
                      </tr>
                    ) : (
                      auditedTickets.map((t) => {
                        const isVerified = t.status === "VERIFIED_RESOLVED";
                        const isFailed = t.status === "REJECTED_AUDIT_FAILED";
                        const conf = t.latestAudit?.confidenceScore;

                        return (
                          <tr key={t.id} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-mono tracking-tight tabular-nums font-bold text-white block">{t.id}</span>
                              <span className="text-[11px] text-zinc-400 line-clamp-1">{t.summary}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-zinc-300 block">
                                {t.category.replace(/_/g, " ")}
                              </span>
                              <span className="text-[10px] text-zinc-500">Ward {t.location.wardNumber}</span>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-300">
                              {t.contractorName || "Unassigned"}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isVerified
                                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                                    : isFailed
                                    ? "bg-red-950/60 text-red-400 border-red-500/30"
                                    : "bg-amber-950/60 text-amber-300 border-amber-500/30"
                                }`}
                              >
                                {t.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono tracking-tight tabular-nums font-bold">
                              {conf !== undefined ? `${conf}%` : "Pending"}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setInspectTicket(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
                              >
                                <Eye className="h-3 w-3" />
                                Inspect Dossier
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forensic Audit Dossier Modal */}
      <AuditInspectionModal
        ticket={inspectTicket}
        onClose={() => setInspectTicket(null)}
      />
    </main>
  );
}
