"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  User,
  Phone,
  KeyRound,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  
  // Registration Mode: email registration or phone registration
  const [mode, setMode] = useState<"email" | "phone">("email");
  
  // For email registration, we have steps: "register" -> "verify"
  const [step, setStep] = useState<"register" | "verify">("register");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // UI States
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // GSAP Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const sendOtpBtnRef = useRef<HTMLButtonElement>(null);
  
  const submitHoverTl = useRef<gsap.core.Timeline | null>(null);
  const sendOtpHoverTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    submitHoverTl.current = gsap.timeline({ paused: true })
      .to(submitBtnRef.current, { scale: 1.02, duration: 0.2, ease: "power1.out" })
      .to(submitBtnRef.current, { boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)", duration: 0.2 }, 0);

    if (sendOtpBtnRef.current) {
      sendOtpHoverTl.current = gsap.timeline({ paused: true })
        .to(sendOtpBtnRef.current, { scale: 1.01, duration: 0.2, ease: "power1.out" });
    }
  }, { scope: containerRef, dependencies: [mode, step, otpSent] });

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle switching tabs
  const handleModeChange = (newMode: "email" | "phone") => {
    setMode(newMode);
    setStep("register");
    setError("");
    setSuccessMsg("");
    setOtp("");
    setOtpSent(false);
  };

  // Submit initial Email Sign Up Form (triggers verification code send)
  const handleEmailRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccessMsg("An OTP code has been sent to your email.");
      setStep("verify");
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      // Shake submit button on error
      if (submitBtnRef.current) {
        gsap.fromTo(
          submitBtnRef.current,
          { x: -6 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Email OTP verification
  const handleEmailVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp) {
      setError("Please enter the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP code.");
      }

      setSuccessMsg("Account successfully verified! Redirecting to login...");
      setTimeout(() => {
        router.push(`/login?registered=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
      if (submitBtnRef.current) {
        gsap.fromTo(
          submitBtnRef.current,
          { x: -6 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Phone verification code send
  const handlePhoneSendOtp = async () => {
    setError("");
    setSuccessMsg("");

    if (!phone) {
      setError("Please enter your phone number first.");
      return;
    }

    setIsOtpSending(true);

    try {
      const res = await fetch("/api/register/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send code.");
      }

      setOtpSent(true);
      setCountdown(60);
      
      let msg = "Verification code sent successfully.";
      if (data.mock) {
        msg += ` (Dev Mode OTP: ${data.message.split(":").pop()?.trim() || "See console"})`;
      }
      setSuccessMsg(msg);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsOtpSending(false);
    }
  };

  // Submit full Phone registration form (Credentials + OTP)
  const handlePhoneRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name || !phone || !password || !otp) {
      setError("Please fill in all fields including the verification code.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          password,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Phone registration failed.");
      }

      setSuccessMsg("Phone registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      if (submitBtnRef.current) {
        gsap.fromTo(
          submitBtnRef.current,
          { x: -6 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Resend email OTP
  const handleResendEmailOtp = async () => {
    setError("");
    setSuccessMsg("");
    setCountdown(60);

    try {
      const res = await fetch("/api/register/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }

      setSuccessMsg("A new verification code has been sent.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
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

      {/* Mode Selection Tabs (Only show if not in email verification step) */}
      {step === "register" && (
        <div className="flex rounded-xl neu-tabs mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("email")}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === "email"
                ? "neu-tab-active text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Email signup
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("phone")}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === "phone"
                ? "neu-tab-active text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Phone signup
          </button>
        </div>
      )}

      {/* EMAIL SIGNUP FLOW */}
      {mode === "email" && (
        <>
          {step === "register" ? (
            <form onSubmit={handleEmailRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    placeholder="John Doe"
                    className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Agency Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="email@agency.gov"
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
                    <span>Generate Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Email Verification Step */
            <form onSubmit={handleEmailVerifySubmit} className="space-y-5">
              <div>
                <p className="text-sm text-slate-400 mb-4 text-center">
                  We've sent a 6-digit verification code to <span className="font-bold text-slate-300">{email}</span>. Please enter it below.
                </p>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verification OTP
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <KeyRound className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                    placeholder="123456"
                    className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 tracking-widest text-center font-mono"
                  />
                </div>
              </div>

              {/* Submit Verification Button */}
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
                    <span>Verify & Complete Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Resend Controls */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleResendEmailOtp}
                  className={`text-xs font-bold transition-all ${
                    countdown > 0
                      ? "text-slate-500 cursor-not-allowed"
                      : "text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  }`}
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Verification Code"}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* PHONE SIGNUP FLOW */}
      {mode === "phone" && (
        <form onSubmit={handlePhoneRegisterSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                placeholder="Jane Doe"
                className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Phone Number
            </label>
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Phone className="h-4.5 w-4.5" />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading || otpSent}
                  placeholder="+1234567890"
                  className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                />
              </div>
              <button
                ref={sendOtpBtnRef}
                type="button"
                disabled={isOtpSending || countdown > 0}
                onClick={handlePhoneSendOtp}
                onMouseEnter={() => sendOtpHoverTl.current?.play()}
                onMouseLeave={() => sendOtpHoverTl.current?.reverse()}
                className="rounded-xl neu-flat-interactive px-4 py-3 text-xs font-bold text-slate-200 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-w-[100px]"
              >
                {isOtpSending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent mx-auto" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  "Send Code"
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verification Code (OTP)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <KeyRound className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                placeholder="123456"
                className="w-full rounded-xl neu-sunken py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 tracking-widest text-center font-mono"
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
                <span>Register Phone Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
