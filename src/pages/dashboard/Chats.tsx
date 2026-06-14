import React, { useEffect, useState } from "react";
import { MessagesSquare, Search, Trash2, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

interface Chat {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

export default function DashboardChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "chats"),
          where("user_id", "==", user.uid),
          orderBy("updated_at", "desc")
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
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
    if (!window.confirm("Delete this chat?")) return;
    try {
      await deleteDoc(doc(db, "chats", id));
      setChats(prev => prev.filter(c => c.id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Chats</h1>
          <p className="text-gray-600 text-sm">View and manage your past AI generation sessions.</p>
        </div>
        <Link to="/dashboard/generator" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
          New Chat
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border border-gray-200 rounded-2xl bg-white border-dashed">
           <MessagesSquare className="w-12 h-12 mb-4 opacity-30 text-gray-400" />
           <p>No chats found.</p>
           <Link to="/dashboard/generator" className="mt-4 text-brand-600 hover:text-brand-700 text-sm font-medium">Start generating</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {chats.map(chat => (
            <div key={chat.id} className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between group hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <MessagesSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium mb-1 line-clamp-1 max-w-[200px] md:max-w-md">{chat.title || "Untitled Chat"}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(chat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 bg-gray-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link to="/dashboard/generator" state={{ chatId: chat.id }} className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium pr-3">
                  Open <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
