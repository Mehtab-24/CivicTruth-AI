"use client";

import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Ticket, TicketStatus } from "@/lib/store";
import { MapPin, Eye, Clock, ShieldCheck } from "lucide-react";

interface WardMapProps {
  tickets: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
  center?: [number, number];
  zoom?: number;
}

/**
 * Creates custom high-contrast color-coded Leaflet DivIcons matching municipal status definitions.
 */
function createCustomMarkerIcon(status: TicketStatus): L.DivIcon {
  let bgColor = "#ef4444"; // Red: OPEN or ASSIGNED
  let iconSymbol = "!";

  if (status === "VERIFIED_RESOLVED") {
    bgColor = "#10b981"; // Green: VERIFIED_RESOLVED
    iconSymbol = "✓";
  } else if (status === "MANUAL_INSPECTION_REQUIRED") {
    bgColor = "#f97316"; // Orange: MANUAL_INSPECTION_REQUIRED
    iconSymbol = "⚠";
  } else if (status === "REJECTED_AUDIT_FAILED") {
    bgColor = "#b91c1c"; // Dark Red / Alert: REJECTED_AUDIT_FAILED
    iconSymbol = "✕";
  }

  const html = `
    <div style="
      background-color: ${bgColor};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
      font-family: system-ui, -apple-system, sans-serif;
      cursor: pointer;
    ">
      ${iconSymbol}
    </div>
  `;

  return L.divIcon({
    html,
    className: "civic-leaflet-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

export default function WardMap({
  tickets,
  onSelectTicket,
  center = [12.968, 77.645], // Central Bangalore (Indiranagar / Domlur)
  zoom = 13,
}: WardMapProps) {
  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[460px] z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tickets.map((ticket) => {
          const icon = createCustomMarkerIcon(ticket.status);
          const isResolved = ticket.status === "VERIFIED_RESOLVED";
          const isFailed = ticket.status === "REJECTED_AUDIT_FAILED";

          return (
            <Marker
              key={ticket.id}
              position={[ticket.location.latitude, ticket.location.longitude]}
              icon={icon}
            >
              <Popup className="civic-custom-popup">
                <div className="p-1 space-y-2 text-zinc-900 max-w-[260px] font-sans">
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-1.5">
                    <span className="font-mono text-[11px] font-bold text-zinc-800">
                      {ticket.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      Ward {ticket.location.wardNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                      {ticket.category.replace(/_/g, " ")}
                    </span>
                    <p className="text-xs text-zinc-800 font-medium line-clamp-2 mt-0.5">
                      {ticket.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-100">
                    <span
                      className={`font-semibold text-[10px] px-1.5 py-0.5 rounded ${
                        isResolved
                          ? "bg-emerald-100 text-emerald-800"
                          : isFailed
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ticket.status.replace(/_/g, " ")}
                    </span>

                    {onSelectTicket && (
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                      >
                        <Eye className="h-3 w-3" />
                        Inspect
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
