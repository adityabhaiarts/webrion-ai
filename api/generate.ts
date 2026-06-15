/* eslint-disable @typescript-eslint/no-explicit-any */

function readPrompt(req: any) {
  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  return typeof body.prompt === "string" ? body.prompt.trim() : "";
}

function getOpenRouterModel() {
  return process.env.OPENROUTER_MODEL || "openrouter/auto";
}

function getOpenRouterKeyOrThrow() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    const err: any = new Error(
      "OpenRouter API key missing. Add OPENROUTER_API_KEY in Vercel Environment Variables."
    );
    err.status = 500;
    err.code = "MISSING_OPENROUTER_KEY";
    throw err;
  }
  return key;
}

function mapOpenRouterError(status: number | undefined, bodyText: string) {
  if (status === 401) {
    return "Invalid API key";
  }
  if (status === 402) {
    return "OpenRouter credits required";
  }
  if (status === 429) {
    return "Rate limit reached, try again later";
  }

  if (bodyText?.toLowerCase?.().includes("model")) {
    return "Model error. Try a different OPENROUTER_MODEL.";
  }

  return bodyText || "OpenRouter request failed";
}

const websiteSystemPrompt = `
You are Webrion AI, an expert website code generation assistant. Generate clean, modern, production-ready website code and UI suggestions. Give complete, useful, structured responses.
If the user asks for website code, include file structure, React/Vite/Tailwind code, responsive design, SEO, and deployment notes.

Return ONLY valid JSON.
Do not use markdown or code fences.

Return this exact JSON structure:
{
  "projectName": "Project name",
  "description": "Short project description",
  "websiteType": "Business type",
  "files": [
    { "name": "index.html", "content": "complete HTML code" }
  ],
  "deploymentSteps": "Short deployment guide",
  "suggestions": ["Suggestion 1","Suggestion 2"]
}
`;

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      result: "Webrion generate API is live",
      env: {
        hasOpenRouter: Boolean(process.env.OPENROUTER_API_KEY),
        model: process.env.OPENROUTER_MODEL || "not set",
      },
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const prompt = readPrompt(req);

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    if (prompt.length > 20000) {
      return res.status(413).json({
        success: false,
        error: "Prompt is too large. Keep it under 20,000 characters.",
      });
    }

    const openRouterKey = getOpenRouterKeyOrThrow();

    const siteUrl = process.env.SITE_URL || "https://webrion.online";
    const siteName = process.env.SITE_NAME || "Webrion AI";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
      },
      body: JSON.stringify({
        model: getOpenRouterModel(),
        messages: [
          { role: "system", content: websiteSystemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    const text = await response.text().catch(() => "");

    if (!response.ok) {
      const msg = mapOpenRouterError(response.status, text);
      return res.status(response.status).json({
        success: false,
        error: msg,
      });
    }

    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      // If parsing fails, still return raw text as result
      return res.status(200).json({
        success: true,
        result: text,
      });
    }

    const result = data?.choices?.[0]?.message?.content;

    if (!result || typeof result !== "string" || !result.trim()) {
      return res.status(500).json({
        success: false,
        error: "OpenRouter returned empty content",
      });
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Generate API error:", error);

    if (error?.code === "MISSING_OPENROUTER_KEY") {
      return res.status(500).json({
        success: false,
        error: "OpenRouter API key missing",
        hint: "Add OPENROUTER_API_KEY in Vercel Environment Variables.",
      });
    }

    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown generate API error",
    });
  }
}


