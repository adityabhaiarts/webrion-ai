import { FileCode2 } from "lucide-react";
import type { GeneratedFile } from "../types";
import { cn } from "../lib/utils";

type Props = {
  files: GeneratedFile[];
  activeFile: string;
  onSelect: (fileName: string) => void;
};

export default function FileTree({ files, activeFile, onSelect }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-3">
      <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Files</div>
      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file.name}
            type="button"
            onClick={() => onSelect(file.name)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
              activeFile === file.name
                ? "bg-emerald-400/15 text-emerald-100"
                : "text-slate-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <FileCode2 className="h-4 w-4" />
            <span className="truncate font-mono text-xs">{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
