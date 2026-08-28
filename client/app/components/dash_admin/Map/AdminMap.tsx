"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Info, RefreshCw } from "lucide-react";

interface IncidentReport {
  _id: string;
  name: string;
  mobileNumber: string;
  latitude: number;
  longitude: number;
  notes?: string;
  image?: string;
  createdAt: string;
}

// Dynamically load client-side MapComponent with SSR disabled
const MapComponent = dynamic(
  () => import("@/app/components/dash_user/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[480px] w-full flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold animate-pulse">Initializing GIS Maps...</p>
      </div>
    ),
  }
);

export default function AdminMap() {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/incidents");
      if (!response.ok) {
        throw new Error("Failed to load map data");
      }
      const data = await response.json();
      setIncidents(data);
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to database. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

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
          <button
            onClick={fetchIncidents}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider neu-flat-interactive cursor-pointer text-slate-500 hover:text-emerald-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Map</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wider border border-red-200">
            {error}
          </div>
        )}

        {/* Map Container Viewport */}
        <div className="relative flex-1 neu-sunken rounded-2xl min-h-[480px] z-10 overflow-hidden">
          {loading ? (
            <div className="h-[480px] w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Connecting database coordinates...</p>
            </div>
          ) : (
            <MapComponent incidents={incidents} />
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-4 items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider border-t border-green-200/55 pt-3.5 mt-4">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span> Active Incident Markers</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-600"></span> NIT Campus Boundary</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[8px] text-slate-400">
            <Info className="h-3 w-3" /> Map centered on NIT Rourkela Grid
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
              <span>Campus Boundary Overlay</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Active</span>
            </button>
          </div>
        </div>

        {/* Card 2: Sector Telemetry */}
        <div className="neu-flat p-6 rounded-2xl flex flex-col justify-between min-h-[220px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5">Live Database Telemetry</h4>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h5 className="text-base font-black text-slate-800 uppercase leading-none">Latest Submission</h5>
                  <p className="text-xs text-slate-500 font-medium mt-1">{incidents[0].name}</p>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600 font-medium">
                  <p className="flex justify-between"><span>Total Incidents:</span> <strong className="font-mono text-slate-800">{incidents.length} Reports</strong></p>
                  <p className="flex justify-between"><span>Last Checked:</span> <strong className="text-slate-800">{new Date(incidents[0].createdAt).toLocaleDateString()}</strong></p>
                  <p className="flex justify-between"><span>Contact Link:</span> <strong className="text-slate-800">{incidents[0].mobileNumber}</strong></p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider">No active incident reports in the database.</p>
              </div>
            )}
          </div>
          {incidents.length > 0 && (
            <button
              onClick={fetchIncidents}
              className="w-full py-2.5 rounded-xl neu-green-flat text-xs font-bold text-white uppercase tracking-wider cursor-pointer mt-4"
            >
              Refresh Coordination Telemetry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
