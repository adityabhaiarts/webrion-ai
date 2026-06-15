import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code2, Download, Eye, Files, MessageSquareText, Sparkles, Wand2 } from "lucide-react";
import { webrionConfig } from "../config/webrion";

const features = [
  "Chat-style website generation like ChatGPT",
  "Preview generated websites in a live iframe",
  "Copy one file, copy all code, or download a ZIP",
  "Save chats and generated websites to your dashboard",
  "Razorpay payment flow with server-side verification",
  "Vercel API routes keep AI keys hidden"
];

export default function Landing() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4" /> Webrion AI is ready for client websites
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Build websites
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-950 bg-clip-text text-transparent">by chatting.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Send a prompt and Webrion AI replies with complete website code, live preview, ZIP download, deployment guide, and improvement suggestions.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-xl shadow-slate-200 transition hover:bg-emerald-600">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-100">Login</Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-300" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">AI Chat Preview</span>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex justify-end"><div className="max-w-[85%] rounded-3xl bg-slate-950 px-4 py-3 text-sm leading-6 text-white">Create a premium hospital website with doctors, appointment form, WhatsApp button and reviews.</div></div>
            <div className="flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><MessageSquareText className="h-4 w-4" /></div><div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">Done - generated 5 files with preview, ZIP download and deployment steps.</div></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ icon: Files, label: "File tree" }, { icon: Eye, label: "Live preview" }, { icon: Download, label: "ZIP export" }].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><item.icon className="mb-3 h-5 w-5 text-emerald-600" /><p className="text-sm font-bold text-slate-900">{item.label}</p></div>)}
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-800"><Wand2 className="h-4 w-4" /> Generated files</div>
              <div className="grid gap-2 font-mono text-sm text-slate-700">
                {["index.html", "style.css", "script.js", "contact.php", "README.md"].map((file) => <div key={file} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2"><Code2 className="h-4 w-4 text-emerald-600" />{file}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl"><h2 className="text-3xl font-black text-slate-950 sm:text-4xl">Everything needed for a website generator</h2><p className="mt-3 text-slate-500">The full generator, chat history, templates, pricing and settings live behind login.</p></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => <div key={feature} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><CheckCircle2 className="mb-4 h-5 w-5 text-emerald-600" /><p className="text-sm leading-6 text-slate-700">{feature}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <img src={webrionConfig.logoPath} alt="Webrion logo" className="mx-auto mb-6 h-16 w-16 rounded-2xl" />
        <h2 className="text-4xl font-black text-slate-950 sm:text-5xl">Create your next website with Webrion AI.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-slate-600">Start with a business prompt, a Webrion demo template, or one of the local website categories Webrion already builds.</p>
        <Link to="/signup" className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 font-bold text-white shadow-xl shadow-slate-200 transition hover:bg-emerald-600">Get Started <ArrowRight className="h-5 w-5" /></Link>
      </section>
    </div>
  );
}
