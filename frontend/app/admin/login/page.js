"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAction({ email, password });
    if (!res.success) {
      setError(res.error);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 noise-bg relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-surface-100/60 border border-white/10 backdrop-blur-2xl relative shadow-2xl z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-lavender/10 border border-lavender/20 flex items-center justify-center text-lavender mb-4 shadow-[0_0_20px_rgba(199,184,255,0.2)]">
            <Shield className="w-6 h-6" />
          </div>
          <div className="font-mono text-[10px] text-lavender tracking-widest uppercase mb-1">
            TERMINAL // SECURE ACCESS
          </div>
          <h1 className="font-display text-2xl font-bold text-softwhite">
            ADMIN GATEWAY
          </h1>
          <p className="font-sans text-xs text-muted/70 mt-1">
            Personal Portfolio CMS · Md Ali Azgor
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1.5">
              Email Identifier
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali.azgor.0810@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3.5 px-4 rounded-lg bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(199,184,255,0.3)] disabled:opacity-50"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <a
            href="/"
            className="font-mono text-xs text-muted/60 hover:text-lavender transition-colors tracking-wider uppercase"
          >
            ← Return to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

