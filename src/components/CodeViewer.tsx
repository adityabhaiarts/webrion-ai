import { useMemo, useState } from "react";
import { Check, Copy, Download, Eye, FileArchive, Lightbulb, MonitorPlay } from "lucide-react";
import type { GeneratedProject } from "../types";
import { buildPreviewDocument, downloadFilesAsZip } from "../utils/zip";
import FileTree from "./FileTree";

type Props = {
  project: GeneratedProject;
  onDownload?: () => void;
};

export default function CodeViewer({ project, onDownload }: Props) {
  const [activeFile, setActiveFile] = useState(project.files[0]?.name || "");
  const [copied, setCopied] = useState<string | null>(null);
  const [view, setView] = useState<"code" | "preview">("code");

  const selectedFile = project.files.find((file) => file.name === activeFile) || project.files[0];
  const previewDocument = useMemo(() => buildPreviewDocument(project.files), [project.files]);
  const hasPhp = project.files.some((file) => file.name.toLowerCase().endsWith(".php"));

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const copyAll = () => {
    const content = project.files.map((file) => `/* ${file.name} */\n${file.content}`).join("\n\n");
    copyText(content, "all");
  };

  const downloadZip = async () => {
    await downloadFilesAsZip(project.files);
    onDownload?.();
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-emerald-950/30">
      <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <FileArchive className="h-4 w-4" />
            {project.projectName}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("code")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            <Eye className="h-4 w-4" />
            Code
          </button>
          <button
            type="button"
            onClick={() => setView("preview")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            <MonitorPlay className="h-4 w-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            {copied === "all" ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
            Copy all
          </button>
          <button
            type="button"
            onClick={downloadZip}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
          >
            <Download className="h-4 w-4" />
            Download ZIP
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <FileTree files={project.files} activeFile={selectedFile?.name || ""} onSelect={(name) => { setActiveFile(name); setView("code"); }} />
        <div className="min-h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-black">
          {view === "preview" ? (
            <div className="h-full">
              {hasPhp && (
                <div className="border-b border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                  PHP files are included in the ZIP, but browser preview only runs HTML, CSS, and JavaScript.
                </div>
              )}
              <iframe title="Generated website preview" sandbox="allow-scripts" srcDoc={previewDocument} className="h-[520px] w-full bg-white" />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-4 py-3">
                <span className="font-mono text-xs text-emerald-200">{selectedFile?.name}</span>
                <button
                  type="button"
                  onClick={() => selectedFile && copyText(selectedFile.content, selectedFile.name)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                >
                  {copied === selectedFile?.name ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy code
                </button>
              </div>
              <pre className="h-[520px] overflow-auto p-5 text-sm leading-6 text-slate-200">
                <code>{selectedFile?.content}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 border-t border-white/10 p-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="text-sm font-semibold text-white">Deployment guide</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{project.deploymentSteps || "No deployment guide returned yet."}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Lightbulb className="h-4 w-4 text-emerald-300" />
            Improvement suggestions
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {(project.suggestions.length ? project.suggestions : ["Add real brand photos.", "Review contact details before deployment."]).map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
