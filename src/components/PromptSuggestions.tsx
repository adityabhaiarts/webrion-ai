import { ArrowUpRight, Sparkles } from "lucide-react";
import { promptSuggestions } from "../utils/prompts";

type Props = {
  onSelect: (prompt: string) => void;
};

export default function PromptSuggestions({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {promptSuggestions.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={() => onSelect(item.prompt)}
          className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-emerald-400/10"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
              {item.category}
            </span>
            <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-emerald-200" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            {item.title}
          </div>
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{item.prompt}</p>
        </button>
      ))}
    </div>
  );
}
