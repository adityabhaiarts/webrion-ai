import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Download, Copy, Play, Loader2, Code, Terminal, Check } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/auth";
import { auth, db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: { name: string; content: string }[];
  deployment?: string;
}

export default function DashboardGenerator() {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to Webrion AI! Describe the website you want to create, or try one of the templates below."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "generate">("generate");
  const [chatId, setChatId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.initialPrompt) {
      setInput(location.state.initialPrompt);
      setMode("generate");
    }
  }, [location.state]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userPrompt = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setIsLoading(true);

    try {
      let currentChatId = chatId;
      if (!currentChatId) {
        const chatRef = await addDoc(collection(db, "chats"), {
          user_id: user.uid,
          title: userPrompt.substring(0, 50) + "...",
          created_at: Date.now(),
          updated_at: Date.now()
        });
        currentChatId = chatRef.id;
        setChatId(currentChatId);
      }

      await addDoc(collection(db, `chats/${currentChatId}/messages`), {
        user_id: user.uid,
        role: "user",
        content: userPrompt,
        created_at: Date.now()
      });

      if (mode === "generate") {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt })
        });

        if (!res.ok) throw new Error("Failed to generate code.");

        const data = await res.json();
        
        let parsedOut;
        try {
          let text = data.result.trim();
          if (text.startsWith("```json")) {
             text = text.substring(7);
             if (text.endsWith("```")) text = text.slice(0, -3);
          }
          parsedOut = JSON.parse(text);
        } catch(err) {
          throw new Error("Invalid output format returned by AI.");
        }

        await addDoc(collection(db, `chats/${currentChatId}/messages`), {
          user_id: user.uid,
          role: "assistant",
          content: "Generated website successfully.",
          created_at: Date.now()
        });

        await addDoc(collection(db, "generated_websites"), {
          user_id: user.uid,
          chat_id: currentChatId,
          title: userPrompt.substring(0, 50),
          prompt: userPrompt,
          generated_files: parsedOut.files || [],
          deployment_steps: parsedOut.deployment_steps || "",
          suggestions: parsedOut.suggestions || "",
          created_at: Date.now()
        });

        setMessages(prev => [...prev, {
          role: "assistant",
          content: "I've generated the website based on your requirements. Here are the files:",
          files: parsedOut.files || [],
          deployment: parsedOut.deployment_steps
        }]);
      } else {
        // Chat mode
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt, history: messages.slice(-5) })
        });

        if (!res.ok) throw new Error("Failed to chat.");

        const data = await res.json();
        const reply = data.result;

        await addDoc(collection(db, `chats/${currentChatId}/messages`), {
          user_id: user.uid,
          role: "assistant",
          content: reply,
          created_at: Date.now()
        });

        setMessages(prev => [...prev, {
          role: "assistant",
          content: reply
        }]);
      }
    } catch(err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const chips = [
    "Hospital website with dark theme", 
    "Modern coaching website", 
    "Hotel booking landing page", 
    "Restaurant menu UI in HTML/CSS", 
    "PHP contact logic", 
    "Minimal portfolio"
  ];

  return (
    <div className="flex flex-col h-full w-full relative bg-gray-50">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 bg-white/90 backdrop-blur-xl flex items-center px-4 shrink-0 sm:px-6">
        <h1 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-600" />
          AI Generator Sandbox
        </h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar" ref={scrollRef}>
        <div className="max-w-4xl mx-auto flex flex-col gap-6 w-full">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3 sm:gap-4 p-4 rounded-3xl", msg.role === 'assistant' ? 'bg-white border border-gray-100 shadow-sm' : '')}>
              <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center", 
                msg.role === 'assistant' ? 'bg-brand-500' : 'bg-gray-800')}>
                {msg.role === 'assistant' ? <span className="text-white font-bold text-lg leading-none">W</span> : <UserAvatar />}
              </div>
              <div className="flex flex-col gap-4 w-full overflow-hidden">
                <div className={cn("text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words", msg.role === 'user' ? 'text-gray-900 font-medium' : 'text-gray-700')}>{msg.content}</div>
                
                {/* Generated Files UI */}
                {msg.files && msg.files.length > 0 && (
                   <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mt-3 shadow-xl">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950">
                         <Code className="w-4 h-4 text-brand-400" />
                         <span className="text-xs font-semibold tracking-wider uppercase text-gray-300">Generated Files</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 gap-6">
                         {msg.files.map((file, i) => {
                            const fileId = `file-${idx}-${i}`;
                            return (
                              <div key={i} className="flex flex-col gap-2 relative group">
                                 <div className="flex items-center justify-between">
                                    <div className="text-xs font-mono text-brand-300 px-2 py-1 rounded bg-brand-900/30 border border-brand-800 inline-block">{file.name}</div>
                                    <button 
                                      onClick={() => handleCopy(file.content, fileId)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs font-medium"
                                    >
                                      {copiedIndex === fileId ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                      {copiedIndex === fileId ? 'Copied' : 'Copy code'}
                                    </button>
                                 </div>
                                 <div className="relative">
                                    <pre className="p-5 rounded-xl bg-black text-sm font-mono text-gray-300 overflow-x-auto border border-gray-800 leading-relaxed">
                                      {file.content}
                                    </pre>
                                 </div>
                              </div>
                            )
                         })}
                      </div>
                   </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm animate-pulse">
              <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-brand-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-3 text-[15px] text-brand-600 font-medium">
                <Loader2 className="w-5 h-5 animate-spin" />
                Crafting your website architecture...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 shrink-0 bg-white/90 backdrop-blur-2xl border-t border-gray-200 pb-safe z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {chips.map(chip => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all shadow-sm"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-3 px-2 sm:px-4">
             <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
               <input 
                 type="radio" 
                 name="mode" 
                 value="chat" 
                 checked={mode === "chat"} 
                 onChange={() => setMode("chat")}
                 className="accent-brand-500 w-4 h-4"
               />
               General Q&A
             </label>
             <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
               <input 
                 type="radio" 
                 name="mode" 
                 value="generate" 
                 checked={mode === "generate"} 
                 onChange={() => setMode("generate")}
                 className="accent-brand-500 w-4 h-4"
               />
               Generate Code
             </label>
          </div>

          <form onSubmit={handleSubmit} className="relative flex items-center shadow-lg rounded-2xl group border border-gray-200 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "generate" ? "Describe the website you want to build..." : "Ask a technical question..."}
              disabled={isLoading}
              className="w-full bg-transparent rounded-2xl px-5 sm:px-6 py-4 sm:py-5 pr-14 sm:pr-16 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 sm:right-3 p-2.5 sm:p-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-100 text-white disabled:text-gray-400 transition-colors disabled:shadow-none"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
          <div className="text-center mt-3 text-[11px] text-gray-500 font-medium">
            AI can make mistakes. Please verify important code before deploying to production.
          </div>
        </div>
      </div>
    </div>
  );
}

function UserAvatar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 text-white">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

