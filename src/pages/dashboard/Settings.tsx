import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { User, Briefcase, Settings2, Palette, Type } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function DashboardSettings() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    photoURL: "",
    businessName: "",
    businessDetails: "",
    theme: "Dark Green",
    font: "Inter",
  });

  useEffect(() => {
    async function loadData() {
      if (!user || !db) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        setFormData({
          fullName: data.fullName || user.displayName || "",
          photoURL: data.photoURL || user.photoURL || "",
          businessName: data.businessName || "",
          businessDetails: data.businessDetails || "",
          theme: data.theme || "Dark Green",
          font: data.font || data.fontPreference || "Inter",
        });
      } catch (err) {
        console.error(err);
        setError("Could not load settings.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !db) return;
    setSaving(true);
    setError(null);

    try {
      if (auth?.currentUser && (user.displayName !== formData.fullName || user.photoURL !== formData.photoURL)) {
        await updateProfile(auth.currentUser, {
          displayName: formData.fullName,
          photoURL: formData.photoURL,
        });
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: formData.fullName,
          photoURL: formData.photoURL,
          businessName: formData.businessName,
          businessDetails: formData.businessDetails,
          theme: formData.theme,
          font: formData.font,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      await refreshProfile();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading settings...</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 text-white md:p-8">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
          <Settings2 className="h-4 w-4" /> Settings
        </div>
        <h1 className="text-3xl font-black">Account settings</h1>
        <p className="mt-2 text-sm text-slate-300">Manage your profile, business details, theme, and font.</p>
      </div>

      {error && <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {success && <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">Settings saved successfully.</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-white">
            <User className="h-5 w-5 text-emerald-300" /> Profile Information
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">Full Name</span>
              <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-400/60" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">Photo URL</span>
              <input name="photoURL" type="url" value={formData.photoURL} onChange={handleChange} placeholder="https://..." className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-400/60" />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-300">Email</span>
              <input type="email" readOnly value={user?.email || ""} className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-400 outline-none" />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-white">
            <Briefcase className="h-5 w-5 text-emerald-300" /> Business Details
          </h2>
          <div className="space-y-5">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">Business Name</span>
              <input name="businessName" type="text" value={formData.businessName} onChange={handleChange} placeholder="e.g. Skyline Logistics" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-400/60" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">Business Description</span>
              <textarea name="businessDetails" value={formData.businessDetails} onChange={handleChange} placeholder="Describe your business..." rows={4} className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-400/60" />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-white">
            <Settings2 className="h-5 w-5 text-emerald-300" /> Aesthetic Preferences
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300"><Palette className="h-4 w-4" /> Interface Theme</span>
              <select name="theme" value={formData.theme} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-400/60">
                <option value="Dark Green">Dark Green</option>
                <option value="Minimal">Minimal</option>
                <option value="Light White">Light White</option>
              </select>
            </label>
            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300"><Type className="h-4 w-4" /> Font Family</span>
              <select name="font" value={formData.font} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-400/60">
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="System Default">System Default</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving || !db} className="rounded-2xl bg-emerald-400 px-6 py-3 font-black text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
