import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ArrowDownToLine,
  Bot,
  Code2,
  Eraser,
  Loader2,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import CodeViewer from "../../components/CodeViewer";
import PromptSuggestions from "../../components/PromptSuggestions";
import Toast from "../../components/Toast";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/auth";
import type {
  GeneratedFile,
  GeneratedProject,
  GenerationOptions,
} from "../../types";
import {
  defaultGenerationOptions,
  optionsToPromptSuffix,
} from "../../utils/prompts";
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
    : String(suggestionsRaw || "")
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    projectName: raw.projectName || raw.project_name || titleFromPrompt(prompt),
    description:
      raw.description || `Generated from prompt: ${titleFromPrompt(prompt)}`,
    websiteType:
      raw.websiteType || raw.website_type || "AI Generated Website",
    files,
    deploymentSteps:
      raw.deploymentSteps ||
      raw.deployment_steps ||
      raw.deployment ||
      "Upload these files to any static host like Vercel, Netlify, or shared hosting.",
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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState("");
  const [options, setOptions] =
    useState<GenerationOptions>(defaultGenerationOptions);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Webrion AI. Send a website idea and I’ll reply with clean code, preview, ZIP download, and deployment steps.",
      createdAt: Date.now(),
    },
  ]);

  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const lastProject = useMemo(() => {
    return (
      [...messages].reverse().find((message) => message.project)?.project ||
      null
    );
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (location.state?.initialPrompt) {
      setInput(location.state.initialPrompt);
    }
  }, [location.state?.initialPrompt]);

  useEffect(() => {
    if (location.state?.newChat) {
      startNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          orderBy("createdAt", "asc")
        );

        const snapshot = await getDocs(q);

        const loaded = snapshot.docs.map((messageDoc) => ({
          id: messageDoc.id,
          ...(messageDoc.data() as ChatMessage),
        }));

        setChatId(requestedChatId);

        if (loaded.length) {
          setMessages(loaded);
        }
      } catch (error) {
        console.warn("[Webrion] Chat load skipped:", error);
        showToast("Chat history is offline, but generator still works.");
      } finally {
        setIsLoading(false);
      }
    }

    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.chatId, user]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const startNewChat = () => {
    setChatId(null);
    setInput("");
    setMessages([
      {
        role: "assistant",
        content: "New chat ready. Describe the website you want to create.",
        createdAt: Date.now(),
      },
    ]);
  };

  const toggleOption = (key: keyof GenerationOptions) => {
    setOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const ensureChat = async (prompt: string) => {
    if (!user || !db) return null;
    if (chatId) return chatId;

    try {
      const ref = await addDoc(collection(db, "chats"), {
        userId: user.uid,
        title: titleFromPrompt(prompt),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      setChatId(ref.id);
      return ref.id;
    } catch (error) {
      console.warn("[Webrion] Firestore chat save skipped:", error);
      showToast("Saving is offline, generation continues locally.");
      return null;
    }
  };

  const saveMessage = async (
    currentChatId: string | null,
    message: ChatMessage
  ) => {
    if (!user || !db || !currentChatId) return;

    try {
      await addDoc(collection(db, "chats", currentChatId, "messages"), {
        userId: user.uid,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
        ...(message.project ? { project: message.project } : {}),
      });

      await updateDoc(doc(db, "chats", currentChatId), {
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.warn("[Webrion] Message save skipped:", error);
    }
  };

  const saveGeneratedWebsite = async (
    currentChatId: string | null,
    prompt: string,
    project: GeneratedProject
  ) => {
    if (!user || !db) return;

    try {
      await addDoc(collection(db, "generatedWebsites"), {
        userId: user.uid,
        chatId: currentChatId || "local",
        title: project.projectName,
        websiteType: project.websiteType,
        prompt,
        files: project.files,
        deploymentSteps: project.deploymentSteps,
        suggestions: project.suggestions,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.warn("[Webrion] Website save skipped:", error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!input.trim() || isLoading) return;

    const prompt = input.trim();

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      createdAt: Date.now(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    let currentChatId: string | null = null;

    // Firestore should never block AI generation.
    // This runs in background while /api/generate starts immediately.
    const chatSavePromise = ensureChat(prompt)
      .then(async (id) => {
        currentChatId = id;
        await saveMessage(id, userMessage);
        return id;
      })
      .catch((error) => {
        console.warn("Firestore save skipped before generation:", error);
        return null;
      });

    try {
      const controller = new AbortController();

      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, 120000);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: `${prompt}${optionsToPromptSuffix(
            options
          )}\n\nBrand context: ${webrionConfig.liveSiteSummary}`,
          options,
        }),
      });

      window.clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "AI API failed. Check OPENAI_API_KEY in Vercel."
        );
      }

      const project = parseAIResult(data?.result || "", prompt);

      if (!project.files.length) {
        throw new Error("AI returned no files. Try a more detailed prompt.");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: `Done — I generated ${project.files.length} files for ${project.projectName}. Preview, copy, or download the ZIP below.`,
        project,
        createdAt: Date.now(),
      };

      setMessages((current) => [...current, assistantMessage]);

      // Save generated result in background, but don't block UI.
      chatSavePromise
        .then((savedChatId) => {
          const finalChatId = savedChatId || currentChatId;

          return Promise.all([
            saveMessage(finalChatId, assistantMessage),
            saveGeneratedWebsite(finalChatId, prompt, project),
          ]);
        })
        .catch((error) => {
          console.warn("Post-generation save skipped:", error);
        });

      showToast("Website generated.");
    } catch (err: any) {
      const errorMessage =
        err.name === "AbortError"
          ? "Generation timed out. Try a smaller prompt."
          : err.message || "Unknown error";

      const failure: ChatMessage = {
        role: "assistant",
        content: `I could not generate this yet: ${errorMessage}\n\nCheck Vercel: OPENAI_API_KEY, /api/generate route, and deployment logs.`,
        createdAt: Date.now(),
      };

      setMessages((current) => [...current, failure]);
      showToast("Generation failed. Check API keys and logs.");
    } finally {
      setIsLoading(false);
    }
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
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-3 py-4 text-slate-950 md:px-6">
      <Toast message={toast} />

      <header className="mb-4 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Webrion AI Generator
          </div>

          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            Build websites by chatting
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Send a prompt, get code, preview, ZIP, and deployment steps.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadLast}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Download last ZIP
        </button>
      </header>

      <PromptSuggestions onSelect={setInput} />

      <section className="custom-scrollbar mb-4 flex min-h-[48vh] flex-1 flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-5">
        {messages.map((message, index) => (
          <div
            key={`${message.createdAt}-${index}`}
            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            {message.role === "assistant" && message.project ? (
              <div className="w-full">
                <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  {message.content}
                </div>

                <CodeViewer
                  project={message.project}
                  onDownload={() => showToast("ZIP download started.")}
                />
              </div>
            ) : (
              <div
                className={`flex max-w-[92%] gap-3 rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm md:max-w-[76%] ${
                  message.role === "user"
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <div
                  className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    message.role === "user"
                      ? "bg-white text-slate-950"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserRound className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              Generating code
              <span className="flex gap-1">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </section>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70"
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            ["html", "HTML"],
            ["css", "CSS"],
            ["javascript", "JS"],
            ["php", "PHP form"],
            ["readme", "README"],
            ["deploymentGuide", "Deploy guide"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              <input
                type="checkbox"
                checked={options[key as keyof GenerationOptions]}
                onChange={() => toggleOption(key as keyof GenerationOptions)}
                className="h-3.5 w-3.5 accent-emerald-600"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            rows={2}
            placeholder="Message Webrion AI... e.g. Create a premium hospital website with doctors, booking and WhatsApp button"
            className="custom-scrollbar min-h-14 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />

          <button
            type="button"
            onClick={() => setInput("")}
            className="hidden rounded-2xl border border-slate-200 p-4 text-slate-500 hover:bg-slate-50 sm:block"
            aria-label="Clear prompt"
          >
            <Eraser className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-2xl bg-emerald-600 p-4 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send prompt"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 px-1 text-xs text-slate-400">
          <Code2 className="h-3.5 w-3.5" />
          Code generation uses serverless API routes, so API keys stay hidden.
        </div>
      </form>
    </div>
  );
}