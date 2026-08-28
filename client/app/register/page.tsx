"use client";

import { useRef, Suspense } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Shield } from "lucide-react";
import RegisterForm from "@/app/components/dash_user/RegisterForm";

function RegisterContent() {
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

      {/* Main Register Card */}
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
            Agency Registration
          </p>
        </div>

        {/* Register Form Injection */}
        <RegisterForm />

        {/* Link to Login */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-slate-400 animate-pulse text-sm font-bold uppercase tracking-wider">Securing gateway...</p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
