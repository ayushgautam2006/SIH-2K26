"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Shield, LogOut, Home, Map, Bell, Send } from "lucide-react";
import Link from "next/link";
import LoginPanel from "@/app/components/dash_admin/loginpanel/page";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-slate-500 animate-pulse text-sm font-bold uppercase tracking-wider">Securing coordination hub...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // Render original admin login panel layout if admin, bypassing tabs
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
        <header className="neu-flat sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="neu-flat p-2 rounded-xl text-emerald-600">
                <Shield className="h-5.5 w-5.5" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight tracking-tight text-white uppercase">
                  Admin Console
                </h1>
                <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">
                  System Administration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-200">{session.user?.name}</span>
                <span className="text-xs text-slate-400 font-medium">System Administrator</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 neu-flat-interactive text-slate-300 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoginPanel />
        </main>
        <footer className="neu-flat py-6 text-center text-[10px] text-slate-500 mt-auto">
          <p>Disaster Management & Response Coordination Platform &copy; 2026. All operations are logged.</p>
        </footer>
      </div>
    );
  }

  // Regular user nav items
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Maps", href: "/maps", icon: Map },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Send Info", href: "/send-info", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="neu-flat sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="neu-flat p-2 rounded-xl text-emerald-600">
              <Shield className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight text-white uppercase">
                Disaster Response
              </h1>
              <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">
                Coordination Hub
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "neu-green-flat text-white"
                      : "neu-flat-interactive text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">{session.user?.name}</span>
              <span className="text-xs text-slate-400 font-medium">Responder</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 neu-flat-interactive text-slate-300 hover:text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sticky Bar (bottom-docked or below header) */}
      <div className="md:hidden sticky top-16 z-40 neu-flat p-2 flex justify-around bg-background/90 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 text-center ${
                isActive
                  ? "neu-green-flat text-white"
                  : "neu-flat-interactive text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-[fadeIn_0.4s_ease-out]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="neu-flat py-6 text-center text-[10px] text-slate-500 mt-auto">
        <p>Disaster Management & Response Coordination Platform &copy; 2026. All operations are logged.</p>
      </footer>
    </div>
  );
}
