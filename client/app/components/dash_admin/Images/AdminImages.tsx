"use client";

import { Video, RefreshCw, AlertTriangle, Eye, ShieldCheck, Thermometer } from "lucide-react";

interface CameraFeed {
  id: number;
  name: string;
  location: string;
  status: "LIVE" | "OFFLINE";
  timestamp: string;
  temperature: string;
  alert: string | null;
  sensorCode: string;
}

export default function AdminImages() {
  const feeds: CameraFeed[] = [
    { id: 1, name: "UAV Patrol Drone-04", location: "Coastal Embankment (North)", status: "LIVE", timestamp: "03:12:44 AM", temperature: "28.5°C", alert: "Flood Level Warning", sensorCode: "S-DR4-COAST" },
    { id: 2, name: "HQ Surveillance Unit", location: "District Command Shelter", status: "LIVE", timestamp: "03:12:40 AM", temperature: "24.1°C", alert: null, sensorCode: "S-HQ1-SURV" },
    { id: 3, name: "Mobile Rescue Rig-02", location: "National Highway Bypass", status: "LIVE", timestamp: "03:12:35 AM", temperature: "31.2°C", alert: null, sensorCode: "S-MR2-HIGH" },
    { id: 4, name: "Weather Station Cam-09", location: "Southern Hilly Foothills", status: "OFFLINE", timestamp: "03:08:12 AM", temperature: "—", alert: "Sensor Offline", sensorCode: "S-W9-HILL" }
  ];

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto animate-[fadeIn_0.5s_ease-out]">
      {/* Header and Sync Feed info */}
      <div className="flex items-center justify-between border-b border-green-200/55 pb-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Video className="h-5 w-5 text-emerald-600" /> Situational Camera Streams
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-flat-interactive text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-emerald-700 cursor-pointer">
          <RefreshCw className="h-3 w-3" /> Sync Feeds
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {feeds.map((feed) => (
          <div key={feed.id} className="neu-flat p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
            {/* Feed Metadata Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">{feed.sensorCode}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  feed.status === "LIVE" ? "bg-emerald-500/10 text-emerald-700 animate-pulse" : "bg-red-500/10 text-red-700"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${feed.status === "LIVE" ? "bg-emerald-600 animate-ping" : "bg-red-500"}`}></span>
                  {feed.status}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-800 uppercase leading-snug">{feed.name}</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">{feed.location}</p>
            </div>

            {/* Mock Camera Sensor scope inside Neumorphic sunken display */}
            <div className="relative h-32 my-5 neu-sunken rounded-2xl overflow-hidden flex items-center justify-center bg-emerald-950/[0.04]">
              {feed.status === "LIVE" ? (
                <>
                  {/* Drone radar sensor sweeping graphic overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
                  
                  {/* Animated sonar sweeping wave */}
                  <div className="absolute h-full w-[2px] bg-emerald-500/30 left-0 animate-[radarSweep_4s_infinite_linear]"></div>
                  
                  {/* Camera Reticle Crosshair */}
                  <div className="absolute h-6 w-6 border-t border-l border-emerald-600/40 top-3 left-3"></div>
                  <div className="absolute h-6 w-6 border-t border-r border-emerald-600/40 top-3 right-3"></div>
                  <div className="absolute h-6 w-6 border-b border-l border-emerald-600/40 bottom-3 left-3"></div>
                  <div className="absolute h-6 w-6 border-b border-r border-emerald-600/40 bottom-3 right-3"></div>
                  
                  {/* Center Dot */}
                  <div className="h-1.5 w-1.5 bg-emerald-600/50 rounded-full animate-ping"></div>
                  <div className="h-1 w-1 bg-emerald-600/80 rounded-full absolute"></div>

                  <span className="absolute bottom-2 right-3 text-[9px] font-mono text-emerald-700 tracking-widest">{feed.timestamp}</span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-red-500/60 text-center">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">FEED SIGNAL CORRUPT</span>
                </div>
              )}
            </div>

            {/* Bottom metrics and alert status */}
            <div className="flex items-center justify-between border-t border-green-200/55 pt-3.5 mt-2">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-slate-400" />
                  {feed.temperature}
                </span>
              </div>
              {feed.alert ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-700 font-extrabold text-[9px] uppercase tracking-wider">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {feed.alert}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 font-bold text-[9px] uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
