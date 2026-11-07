"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction, getCurrentUserAction } from "@/lib/actions/auth";
import { Lock, UserCheck, ArrowRight, AlertCircle, Shield, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState(null);

  // If already authenticated as admin, redirect immediately to dashboard
  useEffect(() => {
    let isMounted = true;
    async function checkExistingSession() {
      try {
        const res = await getCurrentUserAction();
        if (isMounted && res.success && res.data?.profile?.role === "admin") {
          router.replace("/admin");
          return;
        }
      } catch {
        // No active session, stay on login page
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    }
    checkExistingSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAction({ identifier, password });
    if (!res.success) {
      setError(res.error || "Invalid Admin ID or credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 noise-bg relative">
        <div className="flex flex-col items-center gap-3 text-muted font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-lavender" />
          <span>VERIFYING ACCESS PRIVILEGES...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-12 noise-bg relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-lavender/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-surface-100/70 border border-white/10 backdrop-blur-2xl relative shadow-2xl z-10">
        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-lavender/10 border border-lavender/25 flex items-center justify-center text-lavender mb-4 shadow-[0_0_20px_rgba(199,184,255,0.25)]">
            <Shield className="w-6 h-6" />
          </div>
          <div className="font-mono text-[10px] text-lavender tracking-widest uppercase mb-1">
            SECURITY GATEWAY // RESTRICTED ACCESS
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-softwhite">
            ADMIN PORTAL
          </h1>
          <p className="font-sans text-xs text-muted/80 mt-1">
            Personal Portfolio CMS · Md Ali Azgor
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-400 text-xs font-mono animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-[11px] text-muted tracking-wider uppercase mb-1.5">
              Admin ID or Email
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin or email@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-mono text-[11px] text-muted tracking-wider uppercase">
                Access Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-softwhite transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-lavender" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3.5 px-4 rounded-lg bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(199,184,255,0.3)] hover:shadow-[0_0_25px_rgba(199,184,255,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted/70 hover:text-lavender transition-colors tracking-wider uppercase"
          >
            <span>&larr; Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
