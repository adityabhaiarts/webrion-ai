import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import FirebaseSetupNotice from "../components/FirebaseSetupNotice";
import { ensureUserProfile } from "../lib/firestore";
import { PasswordStrengthMeter } from "../components/PasswordStrengthMeter";
import { webrionConfig } from "../config/webrion";

const passwordChecks = (password: string) => [
  { label: "Minimum 8 characters", valid: password.length >= 8 },
  { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
  { label: "One lowercase letter", valid: /[a-z]/.test(password) },
  { label: "One number", valid: /[0-9]/.test(password) },
  { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) }
];

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checks = passwordChecks(password);
  const isPasswordValid = checks.every((check) => check.valid);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables in Vercel and redeploy.");
      return;
    }
    setError(null);

    if (!isPasswordValid) {
      setError("Password does not meet the security rules.");
      return;
    }

    if (!passwordsMatch) {
      setError("Password and confirm password must match.");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: fullName });
      await ensureUserProfile(credential.user, fullName);
      navigate("/dashboard/generator");
    } catch (err: any) {
      // Duplicate email (user already exists)
      if (err?.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.");
        return;
      }

      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables in Vercel and redeploy.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await ensureUserProfile(credential.user);
      navigate("/dashboard/generator");
    } catch (err: any) {
      setError(err.message || "Unable to continue with Google.");
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <FirebaseSetupNotice />;

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] w-full max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-11 w-11 rounded-xl" />
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Create your account</h2>
            <p className="text-sm text-slate-500">Start generating websites with Webrion AI.</p>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Aditya Chaurasiya"
            />
          </label>

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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Strong password"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Repeat password"
              />
            </label>
          </div>

          <PasswordStrengthMeter password={password} />

          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
            {checks.map((check) => (
              <div key={check.label} className={check.valid ? "text-emerald-700" : "text-slate-500"}>
                {check.valid ? "OK" : "--"} {check.label}
              </div>
            ))}
            <div className={passwordsMatch ? "text-emerald-700" : "text-slate-500"}>
              {passwordsMatch ? "OK" : "--"} Passwords match
            </div>
          </div>

          <button
            type="submit"
            disabled={!isPasswordValid || !passwordsMatch || loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
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
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <Mail className="h-4 w-4 text-emerald-600" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-600">
            Log in
          </Link>
        </p>
      </section>

      <section className="hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 p-8 text-white shadow-2xl shadow-emerald-950/30 lg:block">
        <img src={webrionConfig.logoPath} alt="Webrion logo" className="mb-8 h-16 w-16 rounded-2xl" />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Premium builder</p>
        <h1 className="mb-5 text-5xl font-bold leading-tight">Generate client-ready websites in one workspace.</h1>
        <p className="max-w-xl text-base leading-7 text-slate-300">
          Built for local businesses, agencies, and creators who need code, live previews, saved history, and ZIP exports.
        </p>
      </section>
    </div>
  );
}
