"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Wrench,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  ShieldCheck,
  Building2,
  X,
  FileCheck2,
  Zap,
  Loader2,
  Sparkles,
  Trash2,
  Droplets,
  Lightbulb,
} from "lucide-react";
import { Ticket, TicketStatus } from "@/lib/store";
import { VerificationAudit } from "@/lib/schemas/audit";
import { calculateHaversineDistanceMeters } from "@/lib/geo";

const AUDIT_STEPS = [
  {
    title: "Verifying geofence boundary & GPS telemetry...",
    desc: "Validating on-site coordinates against the municipal 50-meter incident perimeter.",
  },
  {
    title: "Analyzing surface materials with Gemini...",
    desc: "Inspecting asphalt compaction, bituminous hot-mix patching, or solid waste clearance.",
  },
  {
    title: "Validating background landmarks & perspective...",
    desc: "Cross-referencing invariant structural anchors (utility poles, walls, signs) across before & after photos.",
  },
  {
    title: "Synthesizing forensic verification consensus...",
    desc: "Evaluating algorithmic confidence thresholds to enforce autonomous PASS/FAIL/HITL governance.",
  },
];

export default function ContractorPortalPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedWard, setSelectedWard] = useState<number | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Active Resolution Modal & Evidence Preview
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  // Live Location in Modal
  const [contractorLat, setContractorLat] = useState<number | null>(null);
  const [contractorLon, setContractorLon] = useState<number | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsSimulated, setGpsSimulated] = useState(false);

  // Audit Submission State & Idempotency Lock
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStepIndex, setAuditStepIndex] = useState(0);
  const [auditResult, setAuditResult] = useState<VerificationAudit | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const submissionLockRef = useRef(false);

  // Step-by-step progress rotator during audit verification
  useEffect(() => {
    if (!isAuditing) {
      setAuditStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setAuditStepIndex((prev) => (prev < AUDIT_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, [isAuditing]);

  // Fetch Tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load work orders.");
      }
      setTickets(data.tickets);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading tickets";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update distance whenever activeTicket or contractor coords change
  useEffect(() => {
    if (activeTicket && contractorLat !== null && contractorLon !== null) {
      const dist = calculateHaversineDistanceMeters(
        { latitude: contractorLat, longitude: contractorLon },
        { latitude: activeTicket.location.latitude, longitude: activeTicket.location.longitude }
      );
      setDistanceMeters(Math.round(dist * 10) / 10);
    } else {
      setDistanceMeters(null);
    }
  }, [activeTicket, contractorLat, contractorLon]);

  // Modal Location Handler
  const acquireLocation = (simulateExact = false) => {
    if (!activeTicket || isAuditing) return;

    if (simulateExact) {
      // Simulate exact coordinates within 8m of the ticket
      setContractorLat(activeTicket.location.latitude + 0.00005);
      setContractorLon(activeTicket.location.longitude + 0.00004);
      setGpsSimulated(true);
      return;
    }

    setGpsSimulated(false);
    setIsLocating(true);
    if (!navigator.geolocation) {
      setContractorLat(activeTicket.location.latitude + 0.00005);
      setContractorLon(activeTicket.location.longitude + 0.00004);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setContractorLat(pos.coords.latitude);
        setContractorLon(pos.coords.longitude);
        setIsLocating(false);
      },
      () => {
        setContractorLat(activeTicket.location.latitude + 0.00005);
        setContractorLon(activeTicket.location.longitude + 0.00004);
        setGpsSimulated(true);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Open Modal
  const openModal = (ticket: Ticket) => {
    if (isAuditing) return;
    setActiveTicket(ticket);
    setProofImage(null);
    setProofPreview(null);
    setAuditResult(null);
    setAuditError(null);
    setAuditStepIndex(0);
    // Auto simulate exact GPS by default for convenience, or acquire live
    setContractorLat(ticket.location.latitude + 0.00005);
    setContractorLon(ticket.location.longitude + 0.00004);
    setGpsSimulated(true);
  };

  const closeModal = () => {
    if (isAuditing) return;
    setActiveTicket(null);
    if (proofPreview) {
      URL.revokeObjectURL(proofPreview);
      setProofPreview(null);
    }
    setProofImage(null);
    setAuditResult(null);
    setAuditError(null);
    setAuditStepIndex(0);
  };

  const handleProofImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAuditing) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAuditError("Selected image exceeds 5MB limit. Please choose a smaller photo.");
        return;
      }
      setProofImage(file);
      const url = URL.createObjectURL(file);
      setProofPreview(url);
      setAuditError(null);
    }
  };

  // Quick Demo Preset Loader (Preserving 100% functionality)
  const loadDemoPreset = async (preset: "genuine" | "fraud") => {
    if (!activeTicket || isAuditing) return;
    try {
      const filename = preset === "genuine" ? "genuine-after.jpg" : "fraud-after.jpg";
      const res = await fetch(`/demo/${filename}`);
      if (!res.ok) {
        throw new Error(`Demo asset /demo/${filename} not found.`);
      }
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      setProofImage(file);
      if (proofPreview) {
        URL.revokeObjectURL(proofPreview);
      }
      setProofPreview(URL.createObjectURL(file));

      // Simulate on-site GPS within 4m of ticket origin
      const simulatedLat = activeTicket.location.latitude + 0.00003;
      const simulatedLon = activeTicket.location.longitude + 0.00003;
      setContractorLat(simulatedLat);
      setContractorLon(simulatedLon);
      setGpsSimulated(true);

      const dist = calculateHaversineDistanceMeters(
        { latitude: activeTicket.location.latitude, longitude: activeTicket.location.longitude },
        { latitude: simulatedLat, longitude: simulatedLon }
      );
      setDistanceMeters(Math.round(dist * 10) / 10);

      setAuditError(null);
      setAuditResult(null);
    } catch (err: unknown) {
      console.error("Error loading demo preset:", err);
      setAuditError("Could not load demo preset asset from /demo/");
    }
  };

  // Submit Audit Request with Idempotency Protection
  const handleSubmitAudit = async () => {
    if (submissionLockRef.current || isAuditing) {
      return;
    }

    if (!activeTicket || !proofImage || contractorLat === null || contractorLon === null) {
      setAuditError("Please capture proof image and ensure GPS is acquired.");
      return;
    }

    submissionLockRef.current = true;
    setIsAuditing(true);
    setAuditStepIndex(0);
    setAuditError(null);
    setAuditResult(null);

    try {
      const formData = new FormData();
      formData.append("ticketId", activeTicket.id);
      formData.append("originalImageUrl", activeTicket.originalImageUrl);
      formData.append("contractorImage", proofImage);
      formData.append("latitude", contractorLat.toString());
      formData.append("longitude", contractorLon.toString());
      formData.append("originLatitude", activeTicket.location.latitude.toString());
      formData.append("originLongitude", activeTicket.location.longitude.toString());

      const res = await fetch("/api/audit/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Audit engine verification failed.");
      }

      setAuditResult(data.audit);
      // Refresh tickets to reflect updated status in real time
      fetchTickets();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error verifying resolution proof.";
      setAuditError(msg);
    } finally {
      setIsAuditing(false);
      submissionLockRef.current = false;
    }
  };

  // Helper for SLA time remaining
  const getSlaTimeRemaining = (deadlineStr: string) => {
    const diff = new Date(deadlineStr).getTime() - Date.now();
    if (diff <= 0) return { label: "Breached SLA", isBreached: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { label: `${hours}h ${minutes}m left`, isBreached: hours < 4 };
  };

  // Helper for Category icons, styles, and labels
  const getCategoryMeta = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("pothole") || cat.includes("road")) {
      return {
        icon: AlertTriangle,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        label: category.replace(/_/g, " "),
      };
    }
    if (cat.includes("garbage") || cat.includes("waste") || cat.includes("trash")) {
      return {
        icon: Trash2,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        label: category.replace(/_/g, " "),
      };
    }
    if (cat.includes("sewage") || cat.includes("water") || cat.includes("drain")) {
      return {
        icon: Droplets,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        label: category.replace(/_/g, " "),
      };
    }
    if (cat.includes("light") || cat.includes("electric") || cat.includes("lamp")) {
      return {
        icon: Lightbulb,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        label: category.replace(/_/g, " "),
      };
    }
    return {
      icon: Wrench,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      label: category.replace(/_/g, " "),
    };
  };

  // Helper for Status Badge styling
  const getStatusBadge = (status: TicketStatus | string) => {
    switch (status) {
      case "VERIFIED_RESOLVED":
        return {
          label: "VERIFIED RESOLVED",
          className: "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30",
        };
      case "REJECTED_AUDIT_FAILED":
        return {
          label: "AUDIT FAILED",
          className: "bg-red-950/80 text-red-400 border border-red-500/30",
        };
      case "MANUAL_INSPECTION_REQUIRED":
        return {
          label: "MANUAL INSPECTION",
          className: "bg-purple-950/80 text-purple-300 border border-purple-500/30",
        };
      case "OPEN":
      default:
        return {
          label: status.replace(/_/g, " "),
          className: "bg-amber-950/80 text-amber-300 border border-amber-500/30",
        };
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (selectedWard !== "ALL" && t.location.wardNumber !== selectedWard) return false;
    if (selectedStatus !== "ALL" && t.status !== selectedStatus) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Wrench className="h-3.5 w-3.5" />
              Municipal Field Contractor Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Assigned Work Orders & Audits
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Submit geofenced photographic proof of completed repairs for autonomous multimodal verification.
            </p>
          </div>

          <button
            onClick={fetchTickets}
            disabled={isLoading || isAuditing}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            Refresh Feed
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Building2 className="h-4 w-4 text-zinc-500" />
            <span>Ward Filter:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "All Wards", val: "ALL" },
              { label: "Ward 84 (Indiranagar)", val: 84 },
              { label: "Ward 112 (Domlur)", val: 112 },
              { label: "Ward 150 (Bellandur)", val: 150 },
            ].map((w) => (
              <button
                key={w.label}
                onClick={() => setSelectedWard(w.val as number | "ALL")}
                disabled={isAuditing}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedWard === w.val
                    ? "bg-emerald-500 text-zinc-950 font-bold"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            disabled={isAuditing}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="VERIFIED_RESOLVED">VERIFIED RESOLVED</option>
            <option value="REJECTED_AUDIT_FAILED">AUDIT FAILED</option>
            <option value="MANUAL_INSPECTION_REQUIRED">MANUAL INSPECTION</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs sm:text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* Work Orders Grid */}
        {isLoading ? (
          /* Polished High-Density Skeleton Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-4 animate-pulse"
              >
                {/* Top Bar Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 rounded bg-zinc-800" />
                    <div className="h-4 w-16 rounded bg-zinc-800" />
                  </div>
                  <div className="h-5 w-24 rounded bg-zinc-800" />
                </div>

                {/* Category & Title / SLA Skeleton */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-zinc-800" />
                    <div className="h-4 w-28 rounded bg-zinc-800" />
                  </div>
                  <div className="h-4 w-20 rounded bg-zinc-800" />
                </div>

                {/* Description & Location Skeleton */}
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 w-full rounded bg-zinc-800/80" />
                  <div className="h-3.5 w-4/5 rounded bg-zinc-800/60" />
                  <div className="h-3 w-3/5 rounded bg-zinc-800/50 pt-1" />
                  <div className="flex gap-1.5 pt-1">
                    <div className="h-4 w-16 rounded bg-zinc-800/60" />
                    <div className="h-4 w-20 rounded bg-zinc-800/60" />
                  </div>
                </div>

                {/* Evidence Attachment Strip Skeleton */}
                <div className="h-10 w-full rounded-xl bg-zinc-800/50" />

                {/* Action Button Skeleton */}
                <div className="pt-2 border-t border-zinc-800">
                  <div className="h-10 w-full rounded-xl bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          /* Polished Civic Empty State */
          <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-950/10 p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                No pending grievances found for this ward. Great job!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                All reported civic issues in this sector have been resolved or verified. You can switch filters or check back later for newly dispatched field assignments.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedWard("ALL");
                setSelectedStatus("ALL");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTickets.map((ticket) => {
              const sla = getSlaTimeRemaining(ticket.slaDeadline);
              const isResolved = ticket.status === "VERIFIED_RESOLVED";
              const catMeta = getCategoryMeta(ticket.category);
              const CategoryIcon = catMeta.icon;
              const statusMeta = getStatusBadge(ticket.status);

              return (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors space-y-4 shadow-sm"
                >
                  {/* Top Bar: Ticket ID, Ward Badge, Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        {ticket.id}
                      </span>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                        Ward {ticket.location.wardNumber}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide ${statusMeta.className}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* Category & Title + SLA */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${catMeta.bgColor} ${catMeta.color}`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {catMeta.label}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1 font-mono text-xs tracking-tight tabular-nums ${
                        sla.isBreached ? "text-red-400 font-bold" : "text-amber-400"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {sla.label}
                    </span>
                  </div>

                  {/* Location & Description */}
                  <div className="space-y-2 flex-1">
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 min-h-[2.5rem] leading-snug">
                      {ticket.summary}
                    </p>

                    <div className="flex items-start gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="line-clamp-1">{ticket.location.address}</span>
                    </div>

                    {ticket.extractedLandmarks.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ticket.extractedLandmarks.map((lm, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {lm}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Evidence Attachment Strip */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Camera className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium">1 Citizen Evidence Photo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewTicket(ticket)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700/60"
                    >
                      <Eye className="h-3 w-3 text-slate-400" />
                      Preview
                    </button>
                  </div>

                  {/* Card Action */}
                  <div className="pt-2 border-t border-zinc-800">
                    {isResolved ? (
                      <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <CheckCircle className="h-4 w-4" />
                          Verified by Gemini 1.5 Pro
                        </span>
                        <span className="font-mono tracking-tight tabular-nums text-xs">
                          {ticket.latestAudit?.confidenceScore}% Conf.
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openModal(ticket)}
                        disabled={isAuditing}
                        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Submit Resolution Proof</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CITIZEN EVIDENCE PHOTO PREVIEW MODAL */}
      {previewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 space-y-4 max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  {previewTicket.id}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                  Ward {previewTicket.location.wardNumber}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  Citizen Evidence Photo
                </span>
              </div>
              <button
                onClick={() => setPreviewTicket(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image Display */}
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-2">
              <img
                src={previewTicket.originalImageUrl}
                alt={previewTicket.summary}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Metadata / Footer */}
            <div className="space-y-1.5 pt-1 text-xs border-t border-zinc-800">
              <p className="font-medium text-zinc-200">
                {previewTicket.summary}
              </p>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{previewTicket.location.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION PROOF MODAL */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 space-y-5 sm:space-y-6 my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono tracking-tight tabular-nums text-emerald-400 font-semibold">
                  {activeTicket.id}
                </span>
                <h2 className="text-lg font-bold text-white">
                  Field Verification Proof Submission
                </h2>
              </div>
              <button
                onClick={closeModal}
                disabled={isAuditing}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Demo Preset Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-blue-950/30 border border-blue-500/20">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>One-Click Hackathon Presets:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadDemoPreset("genuine")}
                  disabled={isAuditing}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  ⚡ Load Genuine Fix (Hot-Mix Asphalt)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoPreset("fraud")}
                  disabled={isAuditing}
                  className="px-2.5 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  ⚡ Load Fraud Attempt (Superficial Dirt)
                </button>
              </div>
            </div>

            {/* Side-by-side photo comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-amber-400" />
                  Original Hazard Complaint:
                </span>
                <div className="h-36 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                  <img
                    src={activeTicket.originalImageUrl}
                    alt="Original Hazard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                  <Camera className="h-3.5 w-3.5 text-emerald-400" />
                  Contractor Live Repair Proof:
                </span>
                {proofPreview ? (
                  <div className="relative h-36 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                    <img
                      src={proofPreview}
                      alt="Repair Proof"
                      className="w-full h-full object-cover"
                    />
                    {!isAuditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setProofImage(null);
                          setProofPreview(null);
                        }}
                        className="absolute top-2 right-2 rounded-lg bg-zinc-900/80 p-1.5 text-zinc-300 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center h-36 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-4 text-center cursor-pointer hover:border-emerald-500/50 transition-colors ${
                      isAuditing ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Camera className="h-6 w-6 text-zinc-500 mb-1" />
                    <span className="text-xs font-medium text-zinc-300">Tap to capture repair photo</span>
                    <span className="text-[10px] text-zinc-500">Live camera preferred (&lt; 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      disabled={isAuditing}
                      onChange={handleProofImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Geofence Status Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Geofence Boundary Check (50m Limit)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => acquireLocation(false)}
                    disabled={isLocating || isAuditing}
                    className="text-[11px] text-blue-400 hover:underline disabled:opacity-40"
                  >
                    {isLocating ? "Locating..." : "Use Live GPS"}
                  </button>
                  <span className="text-zinc-600">•</span>
                  <button
                    type="button"
                    onClick={() => acquireLocation(true)}
                    disabled={isAuditing}
                    className="text-[11px] text-emerald-400 hover:underline disabled:opacity-40"
                  >
                    Simulate On-Site (8m)
                  </button>
                </div>
              </div>

              {distanceMeters !== null && (
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                    distanceMeters <= 50
                      ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                      : "border-red-500/30 bg-red-950/20 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {distanceMeters <= 50 ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                    <span>
                      {distanceMeters <= 50 ? (
                        <>
                          Within 50m Geofence (<span className="font-mono tracking-tight tabular-nums">{distanceMeters}m</span> from site)
                        </>
                      ) : (
                        <>
                          Geofence Breach: <span className="font-mono tracking-tight tabular-nums">{distanceMeters}m</span> away (&gt; 50m)
                        </>
                      )}
                    </span>
                  </div>
                  {gpsSimulated && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      Simulated Test GPS
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {auditError && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{auditError}</span>
              </div>
            )}

            {/* STEP-BY-STEP AUDIT PROCESSING INDICATOR */}
            {isAuditing && (
              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Autonomous Forensic Verification in Progress
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {AUDIT_STEPS[auditStepIndex].title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono tracking-tight tabular-nums text-zinc-400">
                    Step {auditStepIndex + 1} of {AUDIT_STEPS.length}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 pl-11">
                  {AUDIT_STEPS[auditStepIndex].desc}
                </p>

                {/* Progress Segment Bars */}
                <div className="grid grid-cols-4 gap-2 pt-1 pl-11">
                  {AUDIT_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        idx <= auditStepIndex ? "bg-emerald-400" : "bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AUDIT VERDICT CARD */}
            {auditResult && !isAuditing && (
              <div
                className={`rounded-2xl border p-5 space-y-4 ${
                  auditResult.decision === "PASS"
                    ? "border-emerald-500/40 bg-emerald-950/25"
                    : "border-red-500/40 bg-red-950/25"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {auditResult.decision === "PASS" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                        <XCircle className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                        Multimodal Audit Verdict
                      </span>
                      <h3
                        className={`text-base font-bold ${
                          auditResult.decision === "PASS" ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {auditResult.decision === "PASS"
                          ? "VERIFIED RESOLVED – AUDIT PASSED"
                          : "REJECTED – CIVIC AUDIT FAILED"}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">AI Confidence</span>
                    <span
                      className={`text-xl font-mono tracking-tight tabular-nums font-bold ${
                        auditResult.confidenceScore >= 70 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {auditResult.confidenceScore}%
                    </span>
                  </div>
                </div>

                {auditResult.rejectionReasoning && (
                  <div className="rounded-xl border border-red-500/20 bg-red-950/40 p-3 text-xs text-red-200">
                    <span className="font-bold block mb-1">Rejection Reasoning:</span>
                    {auditResult.rejectionReasoning}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Material Detected</span>
                    <span className="font-semibold text-zinc-200">
                      {auditResult.materialAnalysis.repairMaterialDetected}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Workmanship Grade</span>
                    <span className="font-semibold text-zinc-200">
                      {auditResult.materialAnalysis.workmanshipGrade}
                    </span>
                  </div>
                </div>

                {auditResult.landmarkMatchDetails.matchedLandmarks.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="text-zinc-400 font-medium">Matched Invariant Landmarks:</span>
                    <div className="flex flex-wrap gap-1">
                      {auditResult.landmarkMatchDetails.matchedLandmarks.map((lm, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700"
                        >
                          {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={isAuditing}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors min-h-[44px] disabled:opacity-40"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSubmitAudit}
                disabled={
                  isAuditing ||
                  !proofImage ||
                  distanceMeters === null ||
                  distanceMeters > 50
                }
                className="rounded-xl bg-emerald-500 px-5 py-3 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-h-[44px]"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Verifying with Gemini...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Run Multimodal AI Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
