"use client";

import dynamic from "next/dynamic";
import { Ticket } from "@/lib/store";
import { RefreshCw, MapPin } from "lucide-react";

interface DynamicWardMapProps {
  tickets: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
  center?: [number, number];
  zoom?: number;
}

const DynamicLeafletMap = dynamic(() => import("./WardMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[460px] w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-zinc-400">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-emerald-400 mb-3 animate-pulse">
        <MapPin className="h-6 w-6" />
      </div>
      <span className="text-sm font-semibold text-zinc-200">Loading Geospatial Incident Map...</span>
      <span className="text-xs text-zinc-500 mt-1">Initializing municipal ward coordinate layers</span>
    </div>
  ),
});

export function DynamicWardMap(props: DynamicWardMapProps) {
  return <DynamicLeafletMap {...props} />;
}
