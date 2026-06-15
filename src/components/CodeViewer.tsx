import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Eye,
  FileArchive,
  Lightbulb,
  MonitorPlay,
} from "lucide-react";
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

  const selectedFile =
    project.files.find((file) => file.name === activeFile) || project.files[0];
  const previewDocument = useMemo(
    () => buildPreviewDocument(project.files),
    [project.files]
  );
  const hasPhp = project.files.some((file) =>
    file.name.toLowerCase().endsWith(".php")
  );

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const copyAll = () => {
    const content = project.files
      .map((file) => `/* ${file.name} */\n${file.content}`)
      .join("\n\n");
    copyText(content, "all");
  };

  const downloadZip = async () => {
    await downloadFilesAsZip(project.files);
    onDownload?.();
  };

  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <FileArchive className="h-4 w-4 text-emerald-600" />
            {project.projectName}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("code")}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
              view === "code"
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Eye className="h-4 w-4" />
            Code
          </button>
          <button
            type="button"
            onClick={() => setView("preview")}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
              view === "preview"
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <MonitorPlay className="h-4 w-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copied === "all" ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copy all
          </button>
          <button
            type="button"
            onClick={downloadZip}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            ZIP
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[230px_minmax(0,1fr)]">
        <FileTree
          files={project.files}
          activeFile={selectedFile?.name || ""}
          onSelect={(name) => {
            setActiveFile(name);
            setView("code");
          }}
        />

        <div className="min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
          {view === "preview" ? (
            <div className="h-full bg-white">
              {hasPhp && (
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  PHP files are included in the ZIP, but browser preview only
                  runs HTML, CSS, and JavaScript.
                </div>
              )}
              <iframe
                title="Generated website preview"
                sandbox="allow-scripts"
                srcDoc={previewDocument}
                className="h-[520px] w-full bg-white"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
                <span className="font-mono text-xs text-emerald-300">
                  {selectedFile?.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    selectedFile && copyText(selectedFile.content, selectedFile.name)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-slate-100 hover:bg-white/15"
                >
                  {copied === selectedFile?.name ? (
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy
                </button>
              </div>
              <pre className="custom-scrollbar h-[520px] overflow-auto p-5 text-sm leading-6 text-slate-100">
                <code>{selectedFile?.content}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 border-t border-slate-200 p-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-black text-slate-950">
            Deployment guide
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {project.deploymentSteps || "No deployment guide returned yet."}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Lightbulb className="h-4 w-4 text-emerald-600" />
            Improvement suggestions
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {(project.suggestions.length
              ? project.suggestions
              : [
                  "Add real brand photos.",
                  "Review contact details before deployment.",
                ]
            ).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-600">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
