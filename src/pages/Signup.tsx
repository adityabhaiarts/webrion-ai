import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
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
  { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
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

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables and redeploy.");
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
      setError("Firebase is not configured yet. Add Firebase env variables and redeploy.");
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_34%),#f7f7f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[430px_1fr]">
        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7">
          <div className="mb-8 flex items-center gap-3">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-11 w-11 rounded-xl" />
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Create account</h2>
              <p className="text-sm text-slate-500">Start generating with Gemini.</p>
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Your name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="Strong password"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Confirm</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="Repeat password"
                />
              </label>
            </div>

            <PasswordStrengthMeter password={password} />

            <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm">
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Creating..." : "Create account"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
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
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <Mail className="h-4 w-4 text-emerald-600" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-600">
              Sign in
            </Link>
          </p>
        </section>

        <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:block">
          <div className="grid min-h-[620px] place-items-center bg-[linear-gradient(180deg,#ffffff,#f2fbf7)] p-8">
            <div className="max-w-xl text-center">
              <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-3xl bg-emerald-500 text-white shadow-2xl shadow-emerald-200">
                <Sparkles className="h-11 w-11" />
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-950">
                Built for clean website code.
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-slate-500">
                Ask for a business website, get files, preview, deployment notes, and saved history in one dashboard.
              </p>
              <div className="mt-8 grid gap-3 text-left">
                {[
                  "Gemini-first website generation",
                  "Responsive UI for mobile and desktop",
                  "Secure server routes keep API keys hidden",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
