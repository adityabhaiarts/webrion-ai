import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard/generator");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard/generator");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError(null);
    setResetMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 flex flex-col items-center">
      <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mb-8">
        <span className="text-white font-bold text-2xl leading-none">W</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back to Webrion AI</h1>
      <p className="text-gray-600 text-sm mb-8">Enter your credentials to access your dashboard.</p>

      {error && <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
      {resetMessage && <div className="w-full bg-brand-50 text-brand-700 p-3 rounded-lg text-sm mb-4 border border-brand-100">{resetMessage}</div>}

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-brand-500 outline-none transition-colors shadow-sm" 
            placeholder="user@example.com" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-brand-500 outline-none transition-colors shadow-sm" 
            placeholder="••••••••" 
          />
          <div className="flex justify-end mt-1">
            <button type="button" onClick={handleForgotPassword} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              Forgot password?
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors mt-4 disabled:opacity-50 shadow-sm"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="w-full flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <button 
        onClick={handleGoogleLogin}
        className="w-full py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 relative shadow-sm"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 absolute left-4" alt="Google" />
        Sign In with Google
      </button>

      <div className="mt-8 text-sm text-gray-600">
        Don't have an account? <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-medium">Sign up</Link>
      </div>
    </div>
  );
}
