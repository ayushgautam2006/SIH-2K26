"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Shield } from "lucide-react";
import AdminLoginForm from "@/app/components/dash_admin/LoginForm";
import UserLoginForm from "@/app/components/dash_user/LoginForm";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registeredEmail = searchParams.get("registered") || "";

  // Login Mode Selection
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");

  // DOM Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Page mount entrance animation
  useGSAP(() => {
    // Card entry: fade in + slide up
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Subtle floating animation on the background glow circles
    gsap.to(".bg-glow-1", {
      x: "30px",
      y: "-20px",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".bg-glow-2", {
      x: "-25px",
      y: "35px",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 text-slate-100 selection:bg-emerald-600 selection:text-white"
    >
      {/* Background Decorative Glows */}
      <div className="bg-glow-1 absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />
      <div className="bg-glow-2 absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-2xl neu-flat p-8 z-10"
        style={{ opacity: 0 }}
      >
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl neu-flat text-emerald-400">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            Disaster Response Portal
          </h2>
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mt-1">
            Agency Authentication
          </p>
        </div>

        {/* Segmented Picker Tabs */}
        <div className="flex rounded-xl neu-tabs mb-6">
          <button
            type="button"
            onClick={() => setLoginMode("user")}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              loginMode === "user"
                ? "neu-tab-active text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Coordinator Login
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("admin")}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              loginMode === "admin"
                ? "neu-tab-active text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Login Forms Injection */}
        {loginMode === "admin" ? (
          <AdminLoginForm callbackUrl={callbackUrl} />
        ) : (
          <UserLoginForm callbackUrl={callbackUrl} registeredEmail={registeredEmail} />
        )}

        {/* Link to Register */}
        {loginMode === "user" && (
          <p className="mt-8 text-center text-sm text-slate-400">
            Not registered yet?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create Agency Account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-slate-400 animate-pulse text-sm font-bold uppercase tracking-wider">Securing login...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
