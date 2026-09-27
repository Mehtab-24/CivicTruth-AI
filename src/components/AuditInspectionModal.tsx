"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Clock,
} from "lucide-react";
import { Ticket } from "@/lib/store";

interface AuditInspectionModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function AuditInspectionModal({ ticket, onClose }: AuditInspectionModalProps) {
  if (!ticket) return null;

  const audit = ticket.latestAudit;
  const isPass = audit?.decision === "PASS";
  const isFail = audit?.decision === "FAIL";
  const isManual = audit?.decision === "MANUAL_INSPECTION_REQUIRED";

  const contractorGps = ticket.resolutionContractorGps;
  const hasResolutionImage = Boolean(ticket.resolutionImageUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400">
                {ticket.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Ward {ticket.location.wardNumber} • {ticket.location.address}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Forensic Multimodal Audit Dossier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Side-by-side Comparative Imagery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before: Citizen Complaint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Original Citizen Hazard (Before)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="relative h-60 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
              <img
                src={ticket.originalImageUrl}
                alt="Citizen Complaint Hazard"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-zinc-400 line-clamp-2 italic">
              &quot;{ticket.summary}&quot;
            </p>
          </div>

          {/* After: Contractor Resolution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Contractor Resolution Proof (After)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : "Pending"}
              </span>
            </div>
            <div className="relative h-60 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
              {hasResolutionImage ? (
                <img
                  src={ticket.resolutionImageUrl}
                  alt="Contractor Resolution Proof"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-zinc-500 text-xs">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No resolution photo submitted yet
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Agency: {ticket.contractorName || "Unassigned"}</span>
              {contractorGps && (
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  GPS Logged
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Multimodal Audit Telemetry Panel */}
        {audit ? (
          <div
            className={`rounded-2xl border p-5 space-y-4 ${
              isPass
                ? "border-emerald-500/30 bg-emerald-950/20"
                : isFail
                ? "border-red-500/30 bg-red-950/20"
                : "border-amber-500/30 bg-amber-950/20"
            }`}
          >
            {/* Top Decision Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isPass
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isFail
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {isPass ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isFail ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                    Gemini 1.5 Pro Forensic Verdict
                  </span>
                  <span
                    className={`text-base font-extrabold ${
                      isPass
                        ? "text-emerald-300"
                        : isFail
                        ? "text-red-300"
                        : "text-amber-300"
                    }`}
                  >
                    {isPass
                      ? "PASS – VERIFIED RESOLVED"
                      : isFail
                      ? "FAIL – REJECTED CIVIC FRAUD"
                      : "MANUAL INSPECTION REQUIRED"}
                  </span>
                </div>
              </div>

              {/* Confidence Gauge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block font-medium">Algorithmic Confidence</span>
                  <span
                    className={`font-mono text-xl font-bold ${
                      audit.confidenceScore >= 70
                        ? "text-emerald-400"
                        : audit.confidenceScore >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {audit.confidenceScore}%
                  </span>
                </div>
                <div className="w-24 h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      audit.confidenceScore >= 70
                        ? "bg-emerald-400"
                        : audit.confidenceScore >= 50
                        ? "bg-amber-400"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${audit.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rejection Justification (if any) */}
            {audit.rejectionReasoning && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
                <span className="font-bold text-red-300 block mb-1">Audit Rejection Justification:</span>
                {audit.rejectionReasoning}
              </div>
            )}

            {/* Invariant Landmarks & Forensic Material Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Landmarks */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Matched Invariant Static Landmarks
                </span>
                {audit.landmarkMatchDetails.matchedLandmarks.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {audit.landmarkMatchDetails.matchedLandmarks.map((lm, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[11px] border border-zinc-700"
                      >
                        {lm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 italic">No persistent structural background elements matched.</p>
                )}
                <div className="pt-1 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Spatial Perspective:</span>
                  <span className="font-bold text-zinc-200">
                    {audit.landmarkMatchDetails.spatialAngleConsistency}
                  </span>
                </div>
              </div>

              {/* Material Analysis */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                  Forensic Material Quality Analysis
                </span>
                <div className="pt-1 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Material Detected:</span>
                    <span className="font-semibold text-zinc-200">
                      {audit.materialAnalysis.repairMaterialDetected}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Workmanship Grade:</span>
                    <span className="font-semibold text-zinc-200">
                      {audit.materialAnalysis.workmanshipGrade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Ephemeral / Superficial:</span>
                    <span
                      className={`font-semibold ${
                        audit.materialAnalysis.isEphemeralFix
                          ? "text-red-400 font-bold"
                          : "text-emerald-400"
                      }`}
                    >
                      {audit.materialAnalysis.isEphemeralFix ? "YES (Cosmetic Cover)" : "NO (Durable Patch)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-center text-zinc-400 text-xs">
            <Clock className="h-6 w-6 mx-auto mb-2 text-zinc-500" />
            <span>Audit pending. The assigned contractor has not submitted resolution proof yet.</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
