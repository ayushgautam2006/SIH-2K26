"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, LogOut } from "lucide-react";
import LoginPanel from "@/app/components/dash_admin/loginpanel/page";
import UserDashboardPanel from "@/app/components/dash_user/DashboardPanel";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-slate-400 animate-pulse text-sm font-bold uppercase tracking-wider">Securing platform connection...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="neu-flat sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="neu-flat p-2 rounded-xl text-emerald-400">
              <Shield className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight text-white uppercase">
                {isAdmin ? "Admin Console" : "Disaster Response"}
              </h1>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                {isAdmin ? "System Administration" : "Coordination Hub"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">{session.user?.name}</span>
              <span className="text-xs text-slate-400 font-medium">
                {isAdmin ? "System Administrator" : session.user?.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 neu-flat-interactive text-slate-300 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAdmin ? (
          <LoginPanel />
        ) : (
          <UserDashboardPanel />
        )}
      </main>

      {/* Footer */}
      <footer className="neu-flat py-6 text-center text-[10px] text-slate-500 mt-auto">
        <p>Disaster Management & Response Coordination Platform &copy; 2026. All operations are logged.</p>
      </footer>
    </div>
  );
}
