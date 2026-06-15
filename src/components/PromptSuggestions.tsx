import { ArrowUpRight, Sparkles } from "lucide-react";
import { promptSuggestions } from "../utils/prompts";

type Props = {
  onSelect: (prompt: string) => void;
};

export default function PromptSuggestions({ onSelect }: Props) {
  return (
    <div className="custom-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 xl:grid xl:grid-cols-4 xl:overflow-visible">
      {promptSuggestions.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={() => onSelect(item.prompt)}
          className="group min-w-[240px] rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md xl:min-w-0"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {item.category}
            </span>
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-emerald-600" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {item.title}
          </div>
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{item.prompt}</p>
        </button>
      ))}
    </div>
  );
}
