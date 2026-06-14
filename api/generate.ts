import { generateWebsiteCode } from "../src/lib/ai";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Webrion generate API is live",
      env: {
        hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
        hasGemini: Boolean(process.env.GEMINI_API_KEY),
        openAIModel: process.env.OPENAI_MODEL || "not set",
        geminiModel: process.env.GEMINI_MODEL || "not set",
      },
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        ok: false,
        error: "Prompt is required",
      });
    }

    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        ok: false,
        error:
          "No AI key found. Add OPENAI_API_KEY or GEMINI_API_KEY in Vercel Environment Variables.",
      });
    }

    const result = await generateWebsiteCode({ prompt });

    if (!result) {
      return res.status(500).json({
        ok: false,
        error: "AI returned empty result.",
      });
    }

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (error: any) {
    console.error("Generate API error:", error);

    return res.status(500).json({
      ok: false,
      error: error?.message || "Unknown generate API error",
      name: error?.name || null,
      status: error?.status || null,
      code: error?.code || null,
    });
  }
}