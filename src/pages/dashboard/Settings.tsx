import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { User, Briefcase, Settings2, Palette, Type, AlertCircle } from "lucide-react";
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
    theme: "Light Clean",
    font: "Inter",
  });

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        if (!db) throw new Error("Firestore is not ready");
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        setFormData({
          fullName: data.fullName || user.displayName || "",
          photoURL: data.photoURL || user.photoURL || "",
          businessName: data.businessName || "",
          businessDetails: data.businessDetails || "",
          theme: data.theme || "Light Clean",
          font: data.font || data.fontPreference || "Inter",
        });
      } catch (err) {
        console.warn("[Webrion] Settings using auth fallback:", err);
        setFormData((current) => ({ ...current, fullName: user.displayName || "", photoURL: user.photoURL || "" }));
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
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      if (auth?.currentUser && (user.displayName !== formData.fullName || user.photoURL !== formData.photoURL)) {
        await updateProfile(auth.currentUser, { displayName: formData.fullName, photoURL: formData.photoURL });
      }

      if (db) {
        await setDoc(doc(db, "users", user.uid), { ...formData, updatedAt: Date.now() }, { merge: true });
        await refreshProfile();
      } else {
        setError("Profile saved in Firebase Auth, but Firestore is not configured for dashboard preferences.");
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not save settings. Check Firestore rules and network connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading settings...</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 text-slate-950 md:p-8">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700"><Settings2 className="h-4 w-4" /> Settings</div>
        <h1 className="text-3xl font-black">Account settings</h1>
        <p className="mt-2 text-sm text-slate-500">Manage your profile, business details, theme, and font.</p>
      </div>

      {error && <div className="mb-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle className="h-5 w-5 shrink-0" /> {error}</div>}
      {success && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">Settings saved successfully.</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-950"><User className="h-5 w-5 text-emerald-600" /> Profile Information</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label><span className="mb-2 block text-sm font-semibold text-slate-600">Full Name</span><input name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>
            <label><span className="mb-2 block text-sm font-semibold text-slate-600">Photo URL</span><input name="photoURL" type="url" value={formData.photoURL} onChange={handleChange} placeholder="https://..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>
            <label className="md:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-600">Email</span><input type="email" readOnly value={user?.email || ""} className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none" /></label>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-950"><Briefcase className="h-5 w-5 text-emerald-600" /> Business Details</h2>
          <div className="space-y-5">
            <label><span className="mb-2 block text-sm font-semibold text-slate-600">Business Name</span><input name="businessName" type="text" value={formData.businessName} onChange={handleChange} placeholder="e.g. Skyline Logistics" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>
            <label><span className="mb-2 block text-sm font-semibold text-slate-600">Business Description</span><textarea name="businessDetails" value={formData.businessDetails} onChange={handleChange} placeholder="Describe your business..." rows={4} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-950"><Settings2 className="h-5 w-5 text-emerald-600" /> Aesthetic Preferences</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label><span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600"><Palette className="h-4 w-4" /> Interface Theme</span><select name="theme" value={formData.theme} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"><option value="Light Clean">Light Clean</option><option value="ChatGPT Light">ChatGPT Light</option><option value="Emerald Glow">Emerald Glow</option><option value="Pure Dark">Pure Dark</option><option value="Minimal Black">Minimal Black</option></select></label>
            <label><span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600"><Type className="h-4 w-4" /> Font Family</span><select name="font" value={formData.font} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"><option value="Inter">Inter</option><option value="Poppins">Poppins</option><option value="Roboto">Roboto</option><option value="System Default">System Default</option></select></label>
          </div>
        </div>

        <div className="flex justify-end"><button type="submit" disabled={saving} className="rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save Settings"}</button></div>
      </form>
    </div>
  );
}
