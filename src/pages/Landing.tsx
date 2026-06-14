import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code2, Download, Eye, Files, Sparkles, Wand2 } from "lucide-react";
import { webrionConfig } from "../config/webrion";

const features = [
  "Generate HTML, CSS, JavaScript, PHP and README files",
  "Preview generated websites in a live iframe",
  "Copy one file, copy all code, or download a ZIP",
  "Save chats and generated websites to your dashboard",
  "Use Webrion templates for hotels, clinics, restaurants and local businesses",
  "Keep AI keys server-side instead of exposing them in the browser"
];

export default function Landing() {
  return (
    <div className="bg-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
            <Sparkles className="h-4 w-4" />
            Webrion AI deployed at ai.webrion.online
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Webrion AI
            <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
              website code generator.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Generate complete websites, preview the result, copy production-ready code, and download every file as a ZIP. Built from the Webrion agency workflow for local business websites across India.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-300"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Generator Preview</span>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-semibold text-emerald-200">Prompt</p>
              <p className="mt-2 text-slate-200">
                Create a premium hospital website with doctors, services, appointment form, WhatsApp button, gallery, Google Map and reviews.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Files, label: "File tree" },
                { icon: Eye, label: "Live preview" },
                { icon: Download, label: "ZIP export" }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <item.icon className="mb-3 h-5 w-5 text-emerald-300" />
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-200">
                <Wand2 className="h-4 w-4" />
                Generated files
              </div>
              <div className="grid gap-2 font-mono text-sm text-slate-300">
                {["index.html", "style.css", "script.js", "contact.php", "README.md"].map((file) => (
                  <div key={file} className="flex items-center gap-2 rounded-xl bg-slate-950/70 px-3 py-2">
                    <Code2 className="h-4 w-4 text-emerald-300" />
                    {file}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Feature preview</h2>
            <p className="mt-3 text-slate-400">
              The public page stays simple for logged-out users. The full generator, chat history, templates, pricing and settings live behind login.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                <CheckCircle2 className="mb-4 h-5 w-5 text-emerald-300" />
                <p className="text-sm leading-6 text-slate-200">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <img src={webrionConfig.logoPath} alt="Webrion logo" className="mx-auto mb-6 h-16 w-16 rounded-2xl" />
        <h2 className="text-4xl font-black text-white sm:text-5xl">Create your next website with Webrion AI.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Start with a business prompt, a Webrion demo template, or one of the local website categories Webrion already builds.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-300"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}

