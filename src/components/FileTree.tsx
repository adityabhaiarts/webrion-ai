import type { GeneratedFile } from "../types";
import { cn } from "../lib/utils";

export default function FileTree({ files, activeFile, onSelect }: { files: GeneratedFile[]; activeFile: string; onSelect: (name: string) => void }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-3 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Files</p>
      <div className="grid gap-1">
        {files.map((file) => (
          <button
            type="button"
            key={file.name}
            onClick={() => onSelect(file.name)}
            className={cn(
              "truncate rounded-xl px-3 py-2 text-left font-mono text-xs transition",
              activeFile === file.name ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white hover:text-slate-950"
            )}
          >
            {file.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
