"use client";

import {
  Radio,
  Activity,
  Map,
  Users,
  Shield
} from "lucide-react";

export default function UserDashboardPanel() {
  return (
    <div className="flex flex-col justify-center">
      {/* Incident command Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neu-flat text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
          <Radio className="h-3.5 w-3.5" /> System Online & Verified
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl mb-3 uppercase">
          Welcome to the Command Center
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
          You have successfully authenticated to the Disaster Management & Response Coordination Platform. Your session is active and secure.
        </p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
        {/* Card 1 */}
        <div className="neu-flat p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400 mb-4">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Live Incidents</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Real-time disaster reports, impact logging, and severity assessments.</p>
        </div>

        {/* Card 2 */}
        <div className="neu-flat p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400 mb-4">
            <Map className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">GIS Mapping</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Geospatial overlays of flood plains, fire fronts, and resource locations.</p>
        </div>

        {/* Card 3 */}
        <div className="neu-flat p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Responders</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Personnel dispatch, agency check-ins, and radio frequency management.</p>
        </div>

        {/* Card 4 */}
        <div className="neu-flat p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">Agency Settings</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Permissions, system logs, integrations, and escalation workflows.</p>
        </div>
      </div>
    </div>
  );
}
