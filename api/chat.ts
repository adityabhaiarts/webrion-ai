import { generateChatReply } from "../src/lib/ai";

function readBody(req: any) {
  return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Webrion chat API is live",
      env: {
        hasGemini: Boolean(process.env.GEMINI_API_KEY),
        hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
        preferredProvider: process.env.AI_PROVIDER || "gemini",
      },
    });
  }

  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { prompt, history } = readBody(req);
    if (!prompt || typeof prompt !== "string") return res.status(400).json({ ok: false, error: "Prompt is required" });

    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "No AI key found. Add OPENAI_API_KEY or GEMINI_API_KEY in Vercel Environment Variables.",
      });
    }

    const result = await generateChatReply({ prompt, history });
    return res.status(200).json({ ok: true, result });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({ ok: false, error: error?.message || "Failed to generate reply" });
  }
}
