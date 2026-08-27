"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  RefreshCw,
  AlertTriangle,
  Phone
} from "lucide-react";

export default function UsersData() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUsersError("");
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        if (response.ok) {
          setUsersList(data);
        } else {
          setUsersError(data.error || "Failed to load registered coordinators database.");
        }
      } catch (err) {
        console.error("Fetch users error:", err);
        setUsersError("Failed to fetch registered users list. Check your server logs.");
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtered Users List for Admin Search
  const filteredUsers = usersList.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (u.name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query) ||
      (u.phone || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Total Registered */}
        <div className="neu-flat p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4">
            <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Registrations</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {isLoadingUsers ? "..." : usersList.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Email Verified */}
        <div className="neu-flat p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4">
            <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Verified</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {isLoadingUsers ? "..." : usersList.filter((u) => u.emailVerified).length}
              </h3>
            </div>
          </div>
        </div>

        {/* Phone Verified */}
        <div className="neu-flat p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4">
            <div className="inline-flex p-3 rounded-full neu-sunken text-emerald-400">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Verified</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {isLoadingUsers ? "..." : usersList.filter((u) => u.phoneVerified).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Users Table Card */}
      <div className="neu-flat p-6 rounded-2xl flex flex-col gap-6">
        {/* Search Bar header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h4 className="font-bold text-white uppercase text-sm tracking-wider">
            System Registry Table
          </h4>
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or phone..."
              className="w-full rounded-xl neu-sunken py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* User List State Loading */}
        {isLoadingUsers && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading registry databases...</p>
          </div>
        )}

        {/* User List State Error */}
        {usersError && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
            <span>{usersError}</span>
          </div>
        )}

        {/* Users Registry List Table */}
        {!isLoadingUsers && !usersError && (
          <div className="overflow-x-auto rounded-xl neu-sunken">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-800/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-green-200">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone Connection</th>
                  <th className="py-4 px-6 text-center">Email Verification</th>
                  <th className="py-4 px-6 text-center">Phone Verification</th>
                  <th className="py-4 px-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200/40 text-xs text-slate-300">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-green-800/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-100 uppercase tracking-wide">
                        {user.name || "N/A"}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {user.email || "—"}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {user.phone || "—"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                            <CheckCircle className="h-3 w-3" />
                            <span>{new Date(user.emailVerified).toLocaleDateString()}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-semibold text-[10px]">
                            <XCircle className="h-3 w-3" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {user.phoneVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                            <CheckCircle className="h-3 w-3" />
                            <span>{new Date(user.phoneVerified).toLocaleDateString()}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-semibold text-[10px]">
                            <XCircle className="h-3 w-3" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 uppercase font-bold tracking-wider">
                      No registered users found matching the query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
