import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { ensureUserProfile } from "../lib/firestore";
import { webrionConfig } from "../config/webrion";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfile(credential.user);
      navigate("/dashboard/generator");
    } catch (err: any) {
      // If this email was created via Google (or another provider), password login will fail.
      if (err?.code === "auth/account-exists-with-different-credential") {
        setError("This email was created using Google. Please sign in with Google.");
        return;
      }

      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await ensureUserProfile(credential.user);
      navigate("/dashboard/generator");
    } catch (err: any) {
      setError(err.message || "Unable to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email address first, then click forgot password.");
      return;
    }

    setError(null);
    setResetMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Unable to send password reset email.");
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] w-full max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_0.9fr]">
      <section className="hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 p-8 text-white shadow-2xl shadow-emerald-950/30 lg:block">
        <img src={webrionConfig.logoPath} alt="Webrion logo" className="mb-8 h-16 w-16 rounded-2xl" />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Webrion AI</p>
        <h1 className="mb-5 text-5xl font-bold leading-tight">Continue building production websites with AI.</h1>
        <p className="max-w-xl text-base leading-7 text-slate-300">
          Sign in to generate complete website code, preview output, download ZIP files, and save your project history.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-3 text-sm text-slate-300">
          {["Code tabs", "Live preview", "ZIP export"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-11 w-11 rounded-xl" />
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Welcome back</h2>
            <p className="text-sm text-slate-500">Access your Webrion AI dashboard.</p>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {resetMessage && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Enter your password"
            />
          </label>

          <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
            Forgot password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <Mail className="h-4 w-4 text-emerald-600" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          New to Webrion AI?{" "}
          <Link to="/signup" className="font-semibold text-emerald-700 hover:text-emerald-600">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}

