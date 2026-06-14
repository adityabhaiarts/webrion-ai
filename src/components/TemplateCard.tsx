import { ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import type { WebrionTemplate } from "../config/webrion";
import { whatsappUrl, webrionConfig } from "../config/webrion";

type Props = {
  template: WebrionTemplate;
  onUse: (prompt: string) => void;
};

export default function TemplateCard({ template, onUse }: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/40">
      <div className="relative h-44 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.28),transparent_36%)]" />
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur">
          <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-xs font-bold text-slate-950">{template.category}</span>
          <h3 className="mt-3 text-lg font-bold text-white">{template.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="min-h-16 text-sm leading-6 text-slate-400">{template.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <a
            href={template.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            View Demo
          </a>
          <button
            type="button"
            onClick={() => onUse(template.prompt)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
          >
            <Sparkles className="h-4 w-4" />
            Use This
          </button>
          <a
            href={webrionConfig.pricingPage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            Buy Similar
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-400/10"
          >
            <MessageCircle className="h-4 w-4" />
            Contact
          </a>
        </div>
      </div>
    </article>
  );
}
