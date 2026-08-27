import Link from "next/link";
import { Radio, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-slate-100 selection:bg-emerald-600 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-green-500/5 blur-[100px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2e18_1px,transparent_1px),linear-gradient(to_bottom,#0f2e18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Content wrapper */}
      <main className="relative max-w-4xl text-center z-10 flex flex-col items-center py-12">
        {/* Live system state tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neu-flat text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-8">
          <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
          <span>Emergency Response Network Active</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white mb-6 max-w-3xl leading-tight">
          Disaster Management & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-600">
            Response Coordination
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed">
          Orchestrate multi-agency rescue units, log environmental warnings, and deploy resources in real-time. Secure end-to-end command authentication portal.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-sm sm:max-w-none mb-16">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 neu-green-flat text-white font-bold px-8 py-4 rounded-xl cursor-pointer"
          >
            <span>Enter Command Portal</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 neu-flat-interactive text-slate-300 hover:text-white font-bold px-8 py-4 rounded-xl cursor-pointer"
          >
            <span>Register Agency Coordinator</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-600 border-t border-slate-800/20">
        <p>Disaster Management & Response Coordination Platform &copy; 2026</p>
      </footer>
    </div>
  );
}
