import { useEffect, useMemo, useState, type FormEvent } from "react";
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { Download, Eraser, Loader2, Send, Sparkles, Terminal } from "lucide-react";
import { useLocation } from "react-router-dom";
import CodeViewer from "../../components/CodeViewer";
import PromptSuggestions from "../../components/PromptSuggestions";
import Toast from "../../components/Toast";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/auth";
import type { GeneratedFile, GeneratedProject, GenerationOptions } from "../../types";
import { defaultGenerationOptions, optionsToPromptSuffix } from "../../utils/prompts";
import { downloadFilesAsZip } from "../../utils/zip";
import { webrionConfig } from "../../config/webrion";

type ChatMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  project?: GeneratedProject;
};

function titleFromPrompt(prompt: string) {
  return prompt.trim().replace(/\s+/g, " ").slice(0, 64) || "Untitled Website";
}

function normalizeProject(raw: any, prompt: string): GeneratedProject {
  const files = (raw.files || raw.generated_files || []) as GeneratedFile[];
  const suggestionsRaw = raw.suggestions || raw.improvement_suggestions || [];
  const suggestions = Array.isArray(suggestionsRaw)
    ? suggestionsRaw.map(String)
    : String(suggestionsRaw || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean);

  return {
    projectName: raw.projectName || raw.project_name || titleFromPrompt(prompt),
    description: raw.description || `Generated from prompt: ${titleFromPrompt(prompt)}`,
    websiteType: raw.websiteType || raw.website_type || "AI Generated Website",
    files,
    deploymentSteps: raw.deploymentSteps || raw.deployment_steps || raw.deployment || "",
    suggestions,
  };
}

function parseAIResult(result: string, prompt: string) {
  let cleaned = result.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return normalizeProject(JSON.parse(cleaned), prompt);
}

export default function DashboardGenerator() {
  const { user } = useAuth();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<GenerationOptions>(defaultGenerationOptions);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "What do you want to create today? Generate full websites, code, landing pages, and deployment guides with Webrion AI.",
      createdAt: Date.now(),
    },
  ]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const lastProject = useMemo(() => {
    return [...messages].reverse().find((message) => message.project)?.project || null;
  }, [messages]);

  useEffect(() => {
    if (location.state?.initialPrompt) {
      setInput(location.state.initialPrompt);
    }
  }, [location.state?.initialPrompt]);

  useEffect(() => {
    if (location.state?.newChat) {
      startNewChat();
    }
  }, [location.state?.newChat]);

  useEffect(() => {
    async function loadChat() {
      const requestedChatId = location.state?.chatId;
      if (!user || !requestedChatId || !db) return;

      setIsLoading(true);
      try {
        const q = query(
          collection(db, "chats", requestedChatId, "messages"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "asc"),
        );
        const snapshot = await getDocs(q);
        const loaded = snapshot.docs.map((messageDoc) => ({
          id: messageDoc.id,
          ...(messageDoc.data() as ChatMessage),
        }));
        setChatId(requestedChatId);
        setMessages(loaded.length ? loaded : messages);
      } catch (error) {
        console.error(error);
        setToast("Could not load that chat.");
      } finally {
        setIsLoading(false);
      }
    }
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.chatId, user]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const startNewChat = () => {
    setChatId(null);
    setInput("");
    setMessages([
      {
        role: "assistant",
        content: "New chat started. Describe the website you want to generate.",
        createdAt: Date.now(),
      },
    ]);
  };

  const toggleOption = (key: keyof GenerationOptions) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  const ensureChat = async (prompt: string) => {
    if (!user) throw new Error("Login required.");
    if (!db) throw new Error("Firebase Firestore is not configured.");
    if (chatId) return chatId;

    const ref = await addDoc(collection(db, "chats"), {
      userId: user.uid,
      title: titleFromPrompt(prompt),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setChatId(ref.id);
    return ref.id;
  };

  const saveMessage = async (currentChatId: string, message: ChatMessage) => {
    if (!user || !db) return;
    await addDoc(collection(db, "chats", currentChatId, "messages"), {
      userId: user.uid,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
      ...(message.project ? { project: message.project } : {}),
    });
    await updateDoc(doc(db, "chats", currentChatId), { updatedAt: Date.now() });
  };

  const saveGeneratedWebsite = async (currentChatId: string, prompt: string, project: GeneratedProject) => {
    if (!user || !db) return;
    await addDoc(collection(db, "generatedWebsites"), {
      userId: user.uid,
      chatId: currentChatId,
      title: project.projectName,
      websiteType: project.websiteType,
      prompt,
      files: project.files,
      deploymentSteps: project.deploymentSteps,
      suggestions: project.suggestions,
      createdAt: Date.now(),
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const prompt = input.trim();
    const userMessage: ChatMessage = { role: "user", content: prompt, createdAt: Date.now() };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const currentChatId = await ensureChat(prompt);
      await saveMessage(currentChatId, userMessage);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}${optionsToPromptSuffix(options)}\n\nBrand context: ${webrionConfig.liveSiteSummary}`,
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to generate website code.");
      }

      const data = await response.json();
      const project = parseAIResult(data.result, prompt);
      if (!project.files.length) throw new Error("AI returned no files.");

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: `Generated ${project.files.length} files for ${project.projectName}. You can preview, copy, or download the ZIP below.`,
        project,
        createdAt: Date.now(),
      };

      setMessages((current) => [...current, assistantMessage]);
      await saveMessage(currentChatId, assistantMessage);
      await saveGeneratedWebsite(currentChatId, prompt, project);
      showToast("Website generated and saved.");
    } catch (err: any) {
      const failure: ChatMessage = {
        role: "assistant",
        content: `Generation failed: ${err.message || "Unknown error"}`,
        createdAt: Date.now(),
      };
      setMessages((current) => [...current, failure]);
      showToast("Generation failed. Check API keys and server logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    showToast("Prompt cleared.");
  };

  const handleDownloadLast = async () => {
    if (!lastProject) {
      showToast("No generated ZIP available yet.");
      return;
    }
    await downloadFilesAsZip(lastProject.files);
    showToast("ZIP download started.");
  };

  return (
    <div className="min-h-full p-4 text-white md:p-8">
      <Toast message={toast} />
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
              <Terminal className="h-4 w-4" />
              AI Generator
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">What do you want to create today?</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Generate full websites, code, landing pages, and deployment guides with Webrion AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={startNewChat} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
              New Chat
            </button>
            <button type="button" onClick={handleDownloadLast} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-300">
              <Download className="h-4 w-4" />
              Download Last ZIP
            </button>
          </div>
        </header>

        <PromptSuggestions onSelect={setInput} />

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/20 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
              {[
                ["html", "Generate HTML"],
                ["css", "Generate CSS"],
                ["javascript", "Generate JavaScript"],
                ["php", "Generate PHP contact form"],
                ["readme", "Include README"],
                ["deploymentGuide", "Include deployment guide"],
              ].map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={options[key as keyof GenerationOptions]}
                    onChange={() => toggleOption(key as keyof GenerationOptions)}
                    className="h-4 w-4 accent-emerald-400"
                  />
                  {label}
                </label>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              rows={7}
              placeholder="Describe the website you want to generate..."
              className="w-full resize-none rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-base leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-black text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                Generate Website
              </button>
              <button type="button" onClick={handleClear} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-bold text-slate-200 hover:bg-white/10">
                <Eraser className="h-5 w-5" />
                Clear
              </button>
              <button type="button" onClick={handleDownloadLast} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 font-bold text-slate-200 hover:bg-white/10">
                <Download className="h-5 w-5" />
                Download Last ZIP
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          {messages.map((message, index) => (
            <div key={`${message.createdAt}-${index}`} className={message.role === "assistant" && message.project ? "" : "rounded-3xl border border-white/10 bg-white/[0.04] p-5"}>
              {message.role === "assistant" && message.project ? (
                <CodeViewer project={message.project} onDownload={() => showToast("ZIP download started.")} />
              ) : (
                <div className="flex gap-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${message.role === "assistant" ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-950"}`}>
                    {message.role === "assistant" ? "W" : "U"}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{message.content}</p>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-100">
              <Loader2 className="h-5 w-5 animate-spin" />
              Crafting your website files...
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
