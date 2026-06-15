import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import FirebaseSetupNotice from "../components/FirebaseSetupNotice";
import { ensureUserProfile } from "../lib/firestore";
import { webrionConfig } from "../config/webrion";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables and redeploy.");
      return;
    }

    setLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfile(credential.user);
      navigate("/dashboard/generator");
    } catch (err: any) {
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

    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables and redeploy.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Unable to send password reset email.");
    }
  };

  if (!auth) return <FirebaseSetupNotice />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_34%),#f7f7f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_35%),radial-gradient(circle_at_bottom,rgba(2,132,199,0.07),transparent_45%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_430px]">
        <section className="order-2 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-xl shadow-slate-200/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:block">
          <div className="border-b border-white/10 bg-white/60 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/50">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                Premium AI workspace
              </span>

            </div>
          </div>
          <div className="p-7">
            <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-2xl bg-emerald-500 text-white shadow-2xl shadow-emerald-200">
              <Sparkles className="h-9 w-9" />
            </div>

            <h1 className="text-center text-4xl font-black tracking-tight text-slate-950">
              Build websites by chatting.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-center text-base leading-7 text-slate-500">
              Generate HTML, CSS, JavaScript, PHP forms, preview code, and export ZIP files from one premium dashboard.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "OpenRouter-powered code generation",

                "Live preview and copy controls",
                "Saved chats and generated websites",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="order-1 mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7 lg:order-2">
          <div className="mb-8 flex items-center gap-3">
            <img src={webrionConfig.logoPath} alt="Webrion logo" className="h-11 w-11 rounded-xl" />
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Sign in</h2>
              <p className="text-sm text-slate-500">Continue to Webrion AI.</p>
            </div>
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {resetMessage && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{resetMessage}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
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

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter your password"
              />
            </label>

            <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
              Forgot password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign in"}
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
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <Mail className="h-4 w-4 text-emerald-600" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            New to Webrion AI?{" "}
            <Link to="/signup" className="font-bold text-emerald-700 hover:text-emerald-600">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
