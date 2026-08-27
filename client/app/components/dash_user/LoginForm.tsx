"use client";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Mail, Lock, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

interface UserLoginFormProps {
  callbackUrl: string;
  registeredEmail: string;
}

export default function UserLoginForm({ callbackUrl, registeredEmail }: UserLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(registeredEmail ? "Registration successful! Please log in." : "");

  const containerRef = useRef<HTMLDivElement>(null);
  const googleBtnRef = useRef<HTMLButtonElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const googleHoverTl = useRef<gsap.core.Timeline | null>(null);
  const submitHoverTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    googleHoverTl.current = gsap.timeline({ paused: true })
      .to(googleBtnRef.current, { scale: 1.02, duration: 0.2, ease: "power1.out" })
      .to(googleBtnRef.current, { borderColor: "rgba(16, 185, 129, 0.4)", duration: 0.2 }, 0);

    submitHoverTl.current = gsap.timeline({ paused: true })
      .to(submitBtnRef.current, { scale: 1.02, duration: 0.2, ease: "power1.out" })
      .to(submitBtnRef.current, { boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)", duration: 0.2 }, 0);
  }, { scope: containerRef });

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "EMAIL_NOT_VERIFIED") {
          setError("Your email is not verified. Redirecting to verification...");
          
          try {
            await fetch("/api/register/resend-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            setTimeout(() => {
              router.push(`/register?email=${encodeURIComponent(email)}&step=verify`);
            }, 1500);
          } catch (err) {
            console.error("Verification resend error:", err);
            setError("Email not verified. Failed to send verification code. Please register again.");
            setIsLoading(false);
          }
        } else {
          setError(res.error === "CredentialsSignin" ? "Invalid email, phone, or password." : res.error);
          setIsLoading(false);
          // Shake button on error
          gsap.fromTo(
            submitBtnRef.current,
            { x: -6 },
            { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
          );
        }
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("User login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        ref={googleBtnRef}
        type="button"
        onClick={handleGoogleSignIn}
        onMouseEnter={() => googleHoverTl.current?.play()}
        onMouseLeave={() => googleHoverTl.current?.reverse()}
        className="flex w-full items-center justify-center gap-3 rounded-xl neu-flat-interactive py-3.5 text-sm font-medium text-slate-200 cursor-pointer"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.488 0-6.319-2.831-6.319-6.319s2.831-6.319 6.319-6.319c1.694 0 3.208.666 4.331 1.761l3.141-3.141C18.602 1.942 15.632 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.74-4.254 10.74-11.24 0-.648-.066-1.323-.19-1.955H12.24z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative my-7 flex items-center justify-center">
        <div className="w-full border-t border-slate-800/40" />
        <span className="absolute bg-background px-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Or Use Credentials
        </span>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Agency Email or Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="email@agency.gov or +1234567890"
              className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Secure Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          ref={submitBtnRef}
          type="submit"
          disabled={isLoading}
          onMouseEnter={() => submitHoverTl.current?.play()}
          onMouseLeave={() => submitHoverTl.current?.reverse()}
          className="flex w-full items-center justify-center gap-2 rounded-xl neu-green-flat py-3.5 text-sm font-bold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Establish Secure Session</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
