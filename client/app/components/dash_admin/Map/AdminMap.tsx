"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Info } from "lucide-react";

interface DispatchPin {
  id: number;
  sector: string;
  type: string;
  coords: string;
  lat: number;
  lng: number;
  status: "active" | "standby";
  intensity: "high" | "moderate" | "low";
  color: string;
}

// Dynamically load React-Leaflet Map component to bypass Node SSR compilation errors
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-emerald-800/[0.03] text-emerald-600 font-bold uppercase tracking-wider text-xs">
      Initializing Rourkela map tiles...
    </div>
  ),
});

export default function AdminMap() {
  const [selectedPin, setSelectedPin] = useState<DispatchPin | null>(null);

  const pins: DispatchPin[] = [
    {
      id: 1,
      sector: "Sector A-12",
      type: "Flood Warning (NIT Campus North)",
      coords: "22.2505° N, 84.9050° E",
      lat: 22.2505,
      lng: 84.905,
      status: "active",
      intensity: "high",
      color: "#ef4444", // Red Critical Pin
    },
    {
      id: 2,
      sector: "Sector B-05",
      type: "Hazards Patrol (Campus West)",
      coords: "22.2580° N, 84.8960° E",
      lat: 22.258,
      lng: 84.896,
      status: "active",
      intensity: "moderate",
      color: "#f97316", // Orange Warning Pin
    },
    {
      id: 3,
      sector: "Sector D-08",
      type: "Cyclone Shelter (Campus South)",
      coords: "22.2470° N, 84.9120° E",
      lat: 22.247,
      lng: 84.912,
      status: "standby",
      intensity: "low",
      color: "#3b82f6", // Blue Shelter Pin
    },
    {
      id: 4,
      sector: "Sector C-19",
      type: "NDRF Deployment (Campus East)",
      coords: "22.2610° N, 84.9090° E",
      lat: 22.261,
      lng: 84.909,
      status: "active",
      intensity: "high",
      color: "#10b981", // Green Rescue Pin
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl w-full mx-auto animate-[fadeIn_0.5s_ease-out]">
      {/* Real-time Map Canvas (Full Width & Expanded height) */}
      <div className="w-full neu-flat p-6 rounded-3xl relative flex flex-col justify-between min-h-[650px]">
        {/* Map Header */}
        <div className="flex items-center justify-between border-b border-green-200/55 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Real-time GIS Tracking System</h4>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">NIT Rourkela Focus Grid</span>
        </div>

        {/* Map Container Viewport */}
        <div className="relative flex-1 neu-sunken rounded-2xl min-h-[480px] z-10">
          <LeafletMap pins={pins} selectedPin={selectedPin} onSelectPin={setSelectedPin} />
        </div>

        {/* Legend */}
        <div className="flex gap-4 items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider border-t border-green-200/55 pt-3.5 mt-4">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]"></span> Critical Incidents</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#f97316]"></span> Hazards</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]"></span> Shelters</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#10b981]"></span> Rescue Teams</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[8px] text-slate-400">
            <Info className="h-3 w-3" /> Drag & scroll zoom enabled
          </div>
        </div>
      </div>

      {/* Control Panels below the Map (Side-by-Side row grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Card 1: GIS Map Controls */}
        <div className="neu-flat p-6 rounded-2xl flex flex-col gap-5 justify-between">
          <div className="border-b border-green-200/55 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">GIS Map Controls</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Active Layers</p>
          </div>

          <div className="space-y-3">
            <button className="flex items-center justify-between w-full p-3.5 rounded-xl neu-flat-interactive text-xs font-bold text-slate-700 cursor-pointer">
              <span>Terrain Overlay</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Enabled</span>
            </button>
            <button className="flex items-center justify-between w-full p-3.5 rounded-xl neu-flat-interactive text-xs font-bold text-slate-700 cursor-pointer">
              <span>Drone Path Tracking</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Enabled</span>
            </button>
          </div>
        </div>

        {/* Card 2: Sector Telemetry */}
        <div className="neu-flat p-6 rounded-2xl flex flex-col justify-between min-h-[220px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5">Sector Telemetry</h4>
            {selectedPin ? (
              <div className="space-y-4">
                <div>
                  <h5 className="text-base font-black text-slate-800 uppercase leading-none">{selectedPin.sector}</h5>
                  <p className="text-xs text-slate-500 font-medium mt-1">{selectedPin.type}</p>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600 font-medium">
                  <p className="flex justify-between"><span>Coords:</span> <strong className="font-mono text-slate-800">{selectedPin.coords}</strong></p>
                  <p className="flex justify-between"><span>Threat:</span> 
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      selectedPin.intensity === "high" ? "bg-red-500/10 text-red-700" :
                      selectedPin.intensity === "moderate" ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
                    }`}>
                      {selectedPin.intensity}
                    </span>
                  </p>
                  <p className="flex justify-between"><span>Status:</span> <strong className="capitalize text-slate-800">{selectedPin.status}</strong></p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider">Select a terminal marker on the map to audit dispatch coordinates.</p>
              </div>
            )}
          </div>
          {selectedPin && (
            <button className="w-full py-2.5 rounded-xl neu-green-flat text-xs font-bold text-white uppercase tracking-wider cursor-pointer mt-4">
              Radio Dispatch Unit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
