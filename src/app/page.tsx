import Link from "next/link";
import {
  ShieldCheck,
  FilePlus,
  Wrench,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Building,
  ScanEye,
  Scale,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 border-b border-zinc-800 bg-radial-gradient">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Build with AI Code for Communities • Track 1: Digital Public Infrastructure
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Multimodal Verification for{" "}
            <span className="text-emerald-400">Municipal Governance</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400">
            Eliminating premature ticket closure and fraudulent repair claims across municipal portals.
            Powered by <strong>Gemini 1.5 Pro</strong> comparative visual reasoning and 50m geofence enforcement.
          </p>

          {/* Action Cards */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/report"
              className="group relative rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-left hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <FilePlus className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="text-base font-bold text-white">Citizen Voice Intake</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Report road damage, garbage dumps, or open drains using native voice notes in 5 Indian languages.
              </p>
            </Link>

            <Link
              href="/contractor"
              className="group relative rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 text-left hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <Wrench className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="text-base font-bold text-white">Contractor Portal</h2>
              <p className="text-xs text-zinc-400 mt-1">
                View assigned work orders, track SLAs, and submit live geofenced camera proof for instant AI audit.
              </p>
            </Link>

            <Link
              href="/admin"
              className="group relative rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 text-left hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="text-base font-bold text-white">Executive Control Room</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Monitor spatial incident maps, contractor integrity scores, and inspect forensic audit dossiers.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* DPI Problem & Solution Highlights */}
      <section className="py-16 px-4 sm:px-6 border-b border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              The Digital Public Infrastructure Dilemma
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
              Field contractors routinely mark municipal tickets as resolved without executing legitimate repairs.
              Manual inspection across thousands of distributed city wards is impossible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Premature Closures</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Recycled photos or superficial dirt fills fool human officers overwhelmed by volume, leaving severe hazards unaddressed.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ScanEye className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Invariant Invariant Anchors</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gemini 1.5 Pro anchors on static background structures (power poles, windows, compound walls) to mathematically verify site identity.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Material Quality Gate</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Evaluates physical repair materials (e.g. compacted bituminous hot-mix vs uncompacted soil) to instantly catch cosmetic fraud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Engine Rules Banner */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                PRD FR-3.4 / Security Guardrails
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Automated Verification Gate
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Deterministic Rule Engine
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Confidence ≥ 70%</span>
              </div>
              <p className="text-zinc-300 text-xs">
                Ticket automatically transitions to <strong>VERIFIED_RESOLVED</strong>. Contractor integrity score increases.
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>50% ≤ Confidence &lt; 70%</span>
              </div>
              <p className="text-zinc-300 text-xs">
                Flagged for <strong>MANUAL_INSPECTION_REQUIRED</strong>. Escalated to municipal Assistant Executive Engineer.
              </p>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Confidence &lt; 50%</span>
              </div>
              <p className="text-zinc-300 text-xs">
                Instant <strong>REJECTED_AUDIT_FAILED</strong>. Mandates contractor redo work before SLA breach penalty.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
