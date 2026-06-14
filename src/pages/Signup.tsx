import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { PasswordStrengthMeter } from "../components/PasswordStrengthMeter";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reqs = [
    { valid: password.length >= 8 },
    { valid: /[A-Z]/.test(password) },
    { valid: /[a-z]/.test(password) },
    { valid: /[0-9]/.test(password) },
    { valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const isPasswordValid = reqs.every((r) => r.valid);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: fullName });
      
      // Save profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email: user.email,
        photoURL: null,
        plan: "free",
        createdAt: Date.now(),
        theme: "Dark Green",
        fontPreference: "Inter"
      });

      navigate("/dashboard/generator");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Also potentially setup profile in Firestore if it's the first time
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        plan: "free",
        createdAt: Date.now(),
        theme: "Dark Green",
        fontPreference: "Inter"
      }, { merge: true });

      navigate("/dashboard/generator");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 flex flex-col items-center">
      <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mb-8">
        <span className="text-white font-bold text-2xl leading-none">W</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
      <p className="text-gray-600 text-sm mb-8">Start generating websites with Webrion AI.</p>

      {error && <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}

      <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
          <input 
            type="text" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-brand-500 outline-none transition-colors shadow-sm" 
            placeholder="John Doe" 
          />
        </div>
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
        </div>

        <PasswordStrengthMeter password={password} />
        
        <button 
          type="submit" 
          disabled={!isPasswordValid || loading}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors mt-4 relative shadow-sm"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="w-full flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <button 
        onClick={handleGoogleSignup}
        className="w-full py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 relative shadow-sm"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 absolute left-4" alt="Google" />
        Continue with Google
      </button>

      <div className="mt-8 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Log in</Link>
      </div>
    </div>
  );
}
