"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Shield,
  Mail,
  Lock,
  User,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  Phone,
  Info
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email") || "";
  const queryStep = searchParams.get("step") || "";

  // Registration Mode
  const [regMethod, setRegMethod] = useState<"email" | "phone" | "google">("email");

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState(queryEmail);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumberOnly, setPhoneNumberOnly] = useState("");
  const phone = `${countryCode}${phoneNumberOnly.trim()}`;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification States
  const [step, setStep] = useState<"register" | "verify">(
    queryStep === "verify" && queryEmail ? "verify" : "register"
  );
  const [verificationType, setVerificationType] = useState<"email" | "phone">("email");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Twilio SMS OTP Mock indicator
  const [isTwilioMock, setIsTwilioMock] = useState(false);

  // DOM Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const registerFormRef = useRef<HTMLDivElement>(null);
  const otpFormRef = useRef<HTMLDivElement>(null);
  const otpGridRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Entrance animations and initial setups
  useGSAP(
    () => {
      // Card slide up + fade in on mount
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Floating background circles
      gsap.to(".bg-glow-1", {
        x: "-30px",
        y: "20px",
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".bg-glow-2", {
        x: "25px",
        y: "-35px",
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // If starting on verify step, set correct slide positions immediately
      if (step === "verify") {
        gsap.set(sliderRef.current, { xPercent: -50 });
        gsap.set(registerFormRef.current, { opacity: 0 });
        gsap.set(otpFormRef.current, { opacity: 1 });
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 300);
      }
    },
    { scope: containerRef }
  );

  // Transition from Register Form to OTP verification
  const transitionToOtp = (type: "email" | "phone") => {
    setVerificationType(type);
    setStep("verify");
    setOtp(Array(6).fill(""));
    setOtpError("");
    setError("");

    const regHeight = registerFormRef.current?.offsetHeight || 550;
    const otpH = otpFormRef.current?.offsetHeight || 380;

    const tl = gsap.timeline({
      onComplete: () => {
        inputRefs.current[0]?.focus();
      }
    });

    tl.to(registerFormRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" })
      .to(sliderRef.current, { xPercent: -50, duration: 0.5, ease: "power3.inOut" }, "-=0.1")
      .fromTo(cardRef.current, { height: regHeight }, { height: otpH, duration: 0.5, ease: "power3.inOut" }, "<")
      .to(otpFormRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.15")
      .set(cardRef.current, { height: "auto" });
  };

  // Transition back to Register details
  const transitionToRegister = () => {
    setStep("register");
    setError("");
    setOtpError("");

    const regHeight = registerFormRef.current?.offsetHeight || 550;
    const otpH = otpFormRef.current?.offsetHeight || 380;

    const tl = gsap.timeline();

    tl.to(otpFormRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" })
      .to(sliderRef.current, { xPercent: 0, duration: 0.5, ease: "power3.inOut" }, "-=0.1")
      .fromTo(cardRef.current, { height: otpH }, { height: regHeight, duration: 0.5, ease: "power3.inOut" }, "<")
      .to(registerFormRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.15")
      .set(cardRef.current, { height: "auto" });
  };

  // Submit Email Registration details
  const handleEmailRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setIsLoading(false);
        gsap.fromTo(
          cardRef.current,
          { x: -8 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
        return;
      }

      setIsLoading(false);
      transitionToOtp("email");
    } catch (err) {
      console.error("Email registration error:", err);
      setError("Failed to register. Check your connection.");
      setIsLoading(false);
    }
  };

  // Submit Phone Registration details (Sends Twilio SMS OTP)
  const handlePhoneRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send SMS OTP.");
        setIsLoading(false);
        gsap.fromTo(
          cardRef.current,
          { x: -8 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
        return;
      }

      setIsLoading(false);
      setIsTwilioMock(!!data.mock);
      transitionToOtp("phone");
      setCooldown(30);
    } catch (err) {
      console.error("Twilio Phone registration error:", err);
      setError("Failed to dispatch SMS code. Check your connection.");
      setIsLoading(false);
    }
  };

  // Handle OTP Submission and API registration verification
  const handleOtpSubmit = async (otpCode: string) => {
    setOtpError("");
    setIsVerifying(true);

    if (verificationType === "email") {
      // Email OTP Verification flow
      try {
        const response = await fetch("/api/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          setOtpError(data.error || "Invalid OTP code.");
          setIsVerifying(false);
          setOtp(Array(6).fill(""));
          inputRefs.current[0]?.focus();
          gsap.fromTo(
            otpGridRef.current,
            { x: -8 },
            { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
          );
          return;
        }

        // Establish NextAuth session automatically
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          router.push(`/login?registered=${encodeURIComponent(email)}`);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Email OTP verification error:", err);
        setOtpError("Connection failed. Try again.");
        setIsVerifying(false);
      }
    } else {
      // Phone OTP Verification flow (Twilio Server-side verify)
      try {
        // Finalize registration and verify code in database
        const response = await fetch("/api/register/phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone: phone.trim(), password, otp: otpCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          setOtpError(data.error || "Invalid verification code.");
          setIsVerifying(false);
          setOtp(Array(6).fill(""));
          inputRefs.current[0]?.focus();
          gsap.fromTo(
            otpGridRef.current,
            { x: -8 },
            { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
          );
          return;
        }

        // Sign in using NextAuth Credentials with phone number inside the email parameter
        const signInRes = await signIn("credentials", {
          email: phone.trim(),
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          router.push(`/login?registered=${encodeURIComponent(phone.trim())}`);
        } else {
          router.push("/dashboard");
        }
      } catch (err: any) {
        console.error("Phone verification callback error:", err);
        setOtpError(err.message || "Invalid OTP code. Please check and try again.");
        setIsVerifying(false);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        gsap.fromTo(
          otpGridRef.current,
          { x: -8 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
      }
    }
  };

  // Trigger resending OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setOtpError("");

    if (verificationType === "email") {
      try {
        const response = await fetch("/api/register/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          setOtpError("Failed to resend code.");
          return;
        }

        setCooldown(30);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        gsap.fromTo(otpGridRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.5 });
      } catch (err) {
        console.error("Resend OTP error:", err);
        setOtpError("Failed to resend OTP.");
      }
    } else {
      // Phone resend via Twilio API
      try {
        const response = await fetch("/api/register/phone/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });

        const data = await response.json();

        if (!response.ok) {
          setOtpError(data.error || "Failed to resend code.");
          return;
        }

        setIsTwilioMock(!!data.mock);
        setCooldown(30);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        gsap.fromTo(otpGridRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.5 });
      } catch (err) {
        console.error("Resend OTP error:", err);
        setOtpError("Failed to resend SMS code.");
      }
    }
  };

  // OTP inputs key handlers
  const handleOtpChange = (val: string, index: number) => {
    const numericVal = val.replace(/[^0-9]/g, "");
    if (!numericVal) return;

    const singleDigit = numericVal[numericVal.length - 1];
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    gsap.fromTo(
      inputRefs.current[index],
      { scale: 0.85 },
      { scale: 1, duration: 0.25, ease: "back.out(2)" }
    );

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");
    if (code.length === 6 && !isVerifying) {
      handleOtpSubmit(code);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digitArr = pastedData.split("");
      setOtp(digitArr);
      inputRefs.current[5]?.focus();
      handleOtpSubmit(pastedData);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 text-slate-100 selection:bg-emerald-600 selection:text-white"
    >
      {/* Background Glow Decors */}
      <div className="bg-glow-1 absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />
      <div className="bg-glow-2 absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-green-500/5 blur-[100px] pointer-events-none" />

      {/* Auth Card Container */}
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-2xl neu-flat z-10 overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* Double-stage horizontal slider */}
        <div ref={sliderRef} className="flex w-[200%] h-full transition-transform duration-0">
          
          {/* STAGE 1: REGISTRATION FORM */}
          <div ref={registerFormRef} className="w-1/2 flex-shrink-0 p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl neu-flat text-emerald-400">
                  <Shield className="h-5.5 w-5.5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                  Coordinator Sign Up
                </h2>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
                  Create Coordinator Credentials
                </p>
              </div>

              {/* Segmented Picker Tabs */}
              {step === "register" && (
                <div className="flex rounded-xl neu-tabs mb-6">
                  <button
                    type="button"
                    onClick={() => setRegMethod("email")}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      regMethod === "email"
                        ? "neu-tab-active text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegMethod("phone")}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      regMethod === "phone"
                        ? "neu-tab-active text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegMethod("google")}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      regMethod === "google"
                        ? "neu-tab-active text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Google
                  </button>
                </div>
              )}

              {/* Error Box */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* TAB 1: EMAIL REGISTRATION */}
              {regMethod === "email" && (
                <form onSubmit={handleEmailRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        placeholder="Officer John Doe"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Official Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        placeholder="johndoe@agency.gov"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="••••••••"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="••••••••"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl neu-green-flat py-3.5 text-sm font-bold text-white cursor-pointer disabled:opacity-50 mt-6"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Register & Send Email OTP</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: PHONE REGISTRATION */}
              {regMethod === "phone" && (
                <form onSubmit={handlePhoneRegisterSubmit} className="space-y-4">
                  {/* Warning for Twilio Mock Mode */}
                  {isTwilioMock && (
                    <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 flex items-start gap-2.5 leading-relaxed">
                      <Info className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                      <div>
                        <strong>Developer Notice</strong>: Twilio credentials not configured in `.env`. OTP code has been printed to the **Server Terminal Console**.
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        placeholder="Officer John Doe"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {/* Region / Country Code Selector */}
                    <div className="w-1/3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Code
                      </label>
                      <div className="relative">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          disabled={isLoading}
                          className="w-full rounded-xl neu-sunken py-2.5 px-3 text-sm text-white outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 appearance-none bg-slate-900 cursor-pointer text-center font-bold"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+971">+971 (AE)</option>
                          <option value="+86">+86 (CN)</option>
                        </select>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="flex-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={phoneNumberOnly}
                          onChange={(e) => setPhoneNumberOnly(e.target.value.replace(/[^0-9]/g, ""))}
                          disabled={isLoading}
                          placeholder="1234567890"
                          className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="••••••••"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="••••••••"
                        className="w-full rounded-xl neu-sunken py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl neu-green-flat py-3.5 text-sm font-bold text-white cursor-pointer disabled:opacity-50 mt-6"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>Register & Send Twilio SMS OTP</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 3: GOOGLE REGISTRATION */}
              {regMethod === "google" && (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Connect your coordination account directly with Google security credentials.
                  </p>
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="flex w-full items-center justify-center gap-3 rounded-xl neu-flat-interactive py-3.5 text-sm font-bold text-slate-200 cursor-pointer"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.488 0-6.319-2.831-6.319-6.319s2.831-6.319 6.319-6.319c1.694 0 3.208.666 4.331 1.761l3.141-3.141C18.602 1.942 15.632 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.74-4.254 10.74-11.24 0-.648-.066-1.323-.19-1.955H12.24z"
                      />
                    </svg>
                    <span>Register with Google account</span>
                  </button>
                </div>
              )}
            </div>

            {/* Back link */}
            <p className="mt-8 text-center text-sm text-slate-400">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Sign In Session
              </Link>
            </p>
          </div>

          {/* STAGE 2: OTP VERIFICATION FORM */}
          <div
            ref={otpFormRef}
            className="w-1/2 flex-shrink-0 p-8 flex flex-col justify-between"
            style={{ opacity: 0 }}
          >
            <div>
              {/* Back Button */}
              <button
                type="button"
                onClick={transitionToRegister}
                disabled={isVerifying}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors mb-5 group disabled:opacity-55 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to credentials
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl neu-flat text-emerald-400">
                  <KeyRound className="h-5.5 w-5.5 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                  Verify OTP Code
                </h2>
                <p className="text-xs text-slate-400 max-w-[280px] mx-auto mt-2 leading-relaxed">
                  Enter the 6-digit confirmation code dispatched to{" "}
                  <strong className="text-emerald-400 font-semibold">
                    {verificationType === "email" ? email : phone}
                  </strong>
                </p>
              </div>

              {/* OTP Error Message */}
              {otpError && (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* OTP Boxes Grid */}
              <div ref={otpGridRef} className="flex justify-between gap-2.5 mb-6" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    disabled={isVerifying}
                    className="h-12 w-12 text-center text-lg font-bold text-white neu-sunken rounded-xl outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all select-none disabled:opacity-50"
                  />
                ))}
              </div>

              {/* Verification status indicator */}
              {isVerifying && (
                <div className="flex items-center justify-center gap-2.5 text-emerald-400 text-sm py-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying authorization log...</span>
                </div>
              )}
            </div>

            {/* Resend & Session options */}
            <div className="mt-8 space-y-4">
              <div className="text-center text-sm">
                <span className="text-slate-400">Did not receive the OTP code?</span>{" "}
                {cooldown > 0 ? (
                  <span className="text-slate-500 font-semibold">Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isVerifying}
                    className="font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
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
          <p className="text-slate-400 animate-pulse text-sm font-bold uppercase tracking-wider">Loading signup...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
