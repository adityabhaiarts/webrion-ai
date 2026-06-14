import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { GeneratedFile } from "../types";

const safeFileName = (name: string) =>
  name
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export async function downloadGeneratedWebsiteZip(
  files: GeneratedFile[],
  fileName = "webrion-ai-generated-website.zip"
) {
  const zip = new JSZip();

  files.forEach((file) => {
    const path = file.name.trim() || "index.html";
    zip.file(path, file.content ?? "");
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, fileName.endsWith(".zip") ? fileName : `${safeFileName(fileName)}.zip`);
}

export function buildPreviewSrcDoc(files: GeneratedFile[]) {
  const html = files.find((file) => file.name.toLowerCase().endsWith(".html"))?.content ?? "";
  const css = files.find((file) => file.name.toLowerCase().endsWith(".css"))?.content ?? "";
  const js = files.find((file) => file.name.toLowerCase().endsWith(".js"))?.content ?? "";

  if (!html) {
    return "<!doctype html><html><body><p>No HTML file was generated yet.</p></body></html>";
  }

  const styleTag = css ? `<style>${css}</style>` : "";
  const scriptTag = js ? `<script>${js.replace(/<\/script>/gi, "<\\/script>")}</script>` : "";

  if (html.includes("</head>")) {
    return html.replace("</head>", `${styleTag}</head>`).replace("</body>", `${scriptTag}</body>`);
  }

  return `<!doctype html><html><head>${styleTag}</head><body>${html}${scriptTag}</body></html>`;
}

export function getLanguageFromFileName(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".html")) return "HTML";
  if (lower.endsWith(".css")) return "CSS";
  if (lower.endsWith(".js")) return "JavaScript";
  if (lower.endsWith(".php")) return "PHP";
  if (lower.endsWith(".md")) return "Markdown";
  if (lower.endsWith(".json")) return "JSON";
  return "Code";
}

