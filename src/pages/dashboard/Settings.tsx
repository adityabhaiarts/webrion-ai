import React, { useState, useEffect } from "react";
import { User, Image as ImageIcon, Briefcase, Settings2, Palette, Type } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function DashboardSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    photoURL: "",
    businessName: "",
    businessDetails: "",
    theme: "Dark Green",
    fontPreference: "Inter",
  });

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.fullName || user.displayName || "",
            photoURL: data.photoURL || user.photoURL || "",
            businessName: data.businessName || "",
            businessDetails: data.businessDetails || "",
            theme: data.theme || "Dark Green",
            fontPreference: data.fontPreference || "Inter",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (user.displayName !== formData.fullName || user.photoURL !== formData.photoURL) {
        await updateProfile(auth.currentUser!, {
          displayName: formData.fullName,
          photoURL: formData.photoURL
        });
      }

      await updateDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        photoURL: formData.photoURL,
        businessName: formData.businessName,
        businessDetails: formData.businessDetails,
        theme: formData.theme,
        fontPreference: formData.fontPreference,
      });
      setSuccess(true);
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading settings...</div>;

  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600 text-sm">Manage your profile, business details, and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-brand-600" /> Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
              <input 
                name="fullName"
                type="text" 
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-500 outline-none" 
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">Photo URL</label>
               <input 
                 name="photoURL"
                 type="url" 
                 value={formData.photoURL}
                 onChange={handleChange}
                 placeholder="https://..."
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-500 outline-none" 
               />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Email (Read Only)</label>
              <input 
                type="email" 
                readOnly
                value={user?.email || ""}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 outline-none cursor-not-allowed" 
              />
            </div>
          </div>
        </div>

        {/* Business */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-brand-600" /> Business Details
          </h2>
          <div className="space-y-6">
             <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Business Name</label>
              <input 
                name="businessName"
                type="text" 
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Skyline Logistics"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Business Description</label>
              <textarea 
                name="businessDetails"
                value={formData.businessDetails}
                onChange={handleChange}
                placeholder="Describe your business. Webrion AI will use this context for future website generations..."
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-500 outline-none resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-brand-600" /> Aesthetic Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2"><Palette className="w-4 h-4"/> Interface Theme</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-500 outline-none appearance-none" 
              >
                <option value="Light White">Light White (Default)</option>
                <option value="Minimal">Minimal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2"><Type className="w-4 h-4"/> Font Family</label>
              <select
                name="fontPreference"
                value={formData.fontPreference}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-500 outline-none appearance-none" 
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="System Default">System Default</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {success && <span className="text-brand-600 font-medium text-sm">Settings saved successfully!</span>}
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
