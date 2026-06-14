import React, { useEffect, useState } from "react";
import { LayoutPanelLeft, Download, Trash2, Code, ExternalLink } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

interface Website {
  id: string;
  title: string;
  created_at: number;
}

export default function DashboardWebsites() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsites() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "generated_websites"),
          where("user_id", "==", user.uid),
          orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Website));
        setWebsites(fetched);
      } catch (err) {
        console.error("Failed to load websites", err);
      } finally {
        setLoading(false);
      }
    }
    loadWebsites();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this generated website?")) return;
    try {
      await deleteDoc(doc(db, "generated_websites", id));
      setWebsites(prev => prev.filter(w => w.id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Generated Websites</h1>
        <p className="text-gray-600 text-sm">Access, download, and manage your previously generated websites.</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading websites...</div>
      ) : websites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border border-gray-200 rounded-2xl bg-white border-dashed">
           <LayoutPanelLeft className="w-12 h-12 mb-4 opacity-30 text-gray-400" />
           <p>No generated websites round.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map(website => (
            <div key={website.id} className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden flex flex-col group hover:border-brand-300 hover:shadow-md transition-all">
              <div className="h-40 bg-gray-50 p-4 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-brand-500 to-emerald-500" />
                 <Code className="w-10 h-10 text-brand-600 opacity-30" />
              </div>
              <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
                <h3 className="text-gray-900 font-semibold mb-1 line-clamp-1">{website.title || "Untitled Project"}</h3>
                <p className="text-xs text-gray-500 mb-6">Generated on {new Date(website.created_at).toLocaleDateString()}</p>
                
                <div className="flex items-center gap-2 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors">
                    <Download className="w-4 h-4" /> ZIP
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(website.id)} className="p-2 text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors border border-gray-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
