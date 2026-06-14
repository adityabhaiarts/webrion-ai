import { useEffect, useState } from "react";
import { MessagesSquare, Trash2, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export default function DashboardChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      if (!user || !db) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "chats"),
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((chatDoc) => ({ id: chatDoc.id, ...chatDoc.data() } as Chat));
        setChats(fetched);
      } catch (err) {
        console.error("Failed to load chats", err);
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Delete this chat?")) return;

    try {
      await deleteDoc(doc(db, "chats", id));
      setChats((current) => current.filter((chat) => chat.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col p-4 text-white md:p-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
            <MessagesSquare className="h-4 w-4" /> My Chats
          </div>
          <h1 className="text-3xl font-black">Saved generation chats</h1>
          <p className="mt-2 text-sm text-slate-300">View and continue your past Webrion AI sessions.</p>
        </div>
        <Link to="/dashboard/generator" className="rounded-2xl bg-emerald-400 px-4 py-3 text-center text-sm font-black text-slate-950 hover:bg-emerald-300">
          New Chat
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-slate-400">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.04] p-8 text-slate-400">
          <MessagesSquare className="mb-4 h-12 w-12 text-emerald-300/50" />
          <p>No chats found yet.</p>
          <Link to="/dashboard/generator" className="mt-4 text-sm font-bold text-emerald-300 hover:text-emerald-200">Start generating</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {chats.map((chat) => (
            <div key={chat.id} className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/10 transition hover:border-emerald-400/35">
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                  <MessagesSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-white">{chat.title || "Untitled Chat"}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {new Date(chat.updatedAt || chat.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(chat.id)} className="rounded-xl border border-red-400/20 bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20" aria-label="Delete chat">
                  <Trash2 className="h-4 w-4" />
                </button>
                <Link to="/dashboard/generator" state={{ chatId: chat.id }} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-200 hover:bg-white/10">
                  Open <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
