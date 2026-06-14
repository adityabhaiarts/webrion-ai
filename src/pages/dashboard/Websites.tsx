import { useEffect, useState } from "react";
import { LayoutPanelLeft, Trash2, Code, Clock } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

interface Website {
  id: string;
  title: string;
  websiteType?: string;
  createdAt: number;
}

export default function DashboardWebsites() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsites() {
      if (!user || !db) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "generatedWebsites"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((websiteDoc) => ({ id: websiteDoc.id, ...websiteDoc.data() } as Website));
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
    if (!db || !window.confirm("Delete this generated website?")) return;

    try {
      await deleteDoc(doc(db, "generatedWebsites", id));
      setWebsites((current) => current.filter((website) => website.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col p-4 text-white md:p-8">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
          <LayoutPanelLeft className="h-4 w-4" /> Generated Websites
        </div>
        <h1 className="text-3xl font-black">Your generated website library</h1>
        <p className="mt-2 text-sm text-slate-300">Access and manage previously generated projects.</p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-slate-400">Loading websites...</div>
      ) : websites.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.04] p-8 text-slate-400">
          <LayoutPanelLeft className="mb-4 h-12 w-12 text-emerald-300/50" />
          <p>No generated websites found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <div key={website.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/35">
              <div className="relative grid h-40 place-items-center bg-gradient-to-br from-emerald-500/20 via-slate-950 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(52,211,153,0.28),transparent_35%)]" />
                <Code className="relative h-10 w-10 text-emerald-200/70" />
              </div>
              <div className="p-5">
                <h3 className="truncate text-lg font-black text-white">{website.title || "Untitled Project"}</h3>
                <p className="mt-1 text-sm text-slate-400">{website.websiteType || "AI Generated Website"}</p>
                <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" /> Generated on {new Date(website.createdAt || Date.now()).toLocaleDateString()}
                </p>
                <button onClick={() => handleDelete(website.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
