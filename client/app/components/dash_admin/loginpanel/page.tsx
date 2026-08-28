"use client";

import { useState } from "react";
import { Users, Map, Image, FileText, AlertCircle } from "lucide-react";
import UsersData from "../usersData/UsersData";
import AdminMap from "../Map/AdminMap";
import AdminImages from "../Images/AdminImages";
import AdminNotes from "../Notes/AdminNotes";
import AdminUserReports from "../userReports/AdminUserReports";

type TabType = "usersData" | "Map" | "Images" | "Notes" | "userReports";

export default function LoginPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("usersData");

  return (
    <div className="space-y-10 w-full">
      {/* Top-Middle Navigation Bar */}
      <div className="flex justify-center w-full">
        <div className="flex rounded-2xl neu-tabs p-1.5 max-w-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("usersData")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "usersData"
                ? "neu-tab-active text-emerald-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Users Data</span>
          </button>
          
          <button
            onClick={() => setActiveTab("Map")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "Map"
                ? "neu-tab-active text-emerald-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Map className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => setActiveTab("Images")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "Images"
                ? "neu-tab-active text-emerald-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Image className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Images</span>
          </button>

          <button
            onClick={() => setActiveTab("Notes")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "Notes"
                ? "neu-tab-active text-emerald-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          <button
            onClick={() => setActiveTab("userReports")}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "userReports"
                ? "neu-tab-active text-emerald-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertCircle className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">User Reports</span>
          </button>
        </div>
      </div>

      {/* Dynamic View Injection */}
      <div className="w-full">
        {activeTab === "usersData" && <UsersData />}
        {activeTab === "Map" && <AdminMap />}
        {activeTab === "Images" && <AdminImages />}
        {activeTab === "Notes" && <AdminNotes />}
        {activeTab === "userReports" && <AdminUserReports />}
      </div>
    </div>
  );
}
