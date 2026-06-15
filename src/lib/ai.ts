import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export interface GenerateConfig {
  prompt: string;
}

export interface ChatConfig {
  prompt: string;
  history?: { role: string; content: string }[];
}

let gemini: GoogleGenAI | null = null;
let openai: OpenAI | null = null;

function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is missing in Vercel Environment Variables.");
  }

  if (!gemini) {
    gemini = new GoogleGenAI({ apiKey: key });
  }

  return gemini;
}

function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return null;
  }

  if (!openai) {
    openai = new OpenAI({ apiKey: key });
  }

  return openai;
}

function describeAIError(provider: string, error: any) {
  const status = error?.status ? ` ${error.status}` : "";
  const code = error?.code || error?.error?.code || error?.error?.status;
  const message =
    error?.error?.message ||
    error?.message ||
    "Unknown provider error";

  return `${provider}${status}${code ? ` ${code}` : ""}: ${message}`;
}

const websiteSystemPrompt = `
You are Webrion AI, a premium AI website generator.

Return ONLY valid JSON.
Do not return markdown.
Do not use code fences.
Do not include any explanation outside the JSON object.

Return this exact JSON structure:
{
  "projectName": "Project name",
  "description": "Short project description",
  "websiteType": "Business type",
  "files": [
    {
      "name": "index.html",
      "content": "complete HTML code"
    },
    {
      "name": "style.css",
      "content": "complete CSS code"
    },
    {
      "name": "script.js",
      "content": "complete JavaScript code"
    }
  ],
  "deploymentSteps": "Short deployment guide",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}

Rules:
- Generate complete working production-quality code for every requested file.
- Each file must have a "name" and complete "content" string.
- Make the design modern, premium, accessible, fast-loading, and fully responsive.
- Prefer semantic HTML, efficient CSS, and lightweight JavaScript.
- Include SEO metadata, clear CTAs, usable forms, and WhatsApp/call buttons when useful.
- Keep file paths safe and simple, such as index.html, style.css, script.js, contact.php, README.md.
`;

export async function generateWebsiteCode({ prompt }: GenerateConfig) {
  const preferredProvider = (process.env.AI_PROVIDER || "").toLowerCase();
  const failures: string[] = [];

  const runOpenAI = async () => {
    const openaiClient = getOpenAIClient();
    if (!openaiClient) return null;

    const response = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: websiteSystemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.25,
    });

    return response.choices[0]?.message?.content || "";
  };

  const runGemini = async () => {
    if (!hasGeminiKey()) return null;

    const geminiClient = getGeminiClient();
    const response = await geminiClient.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `${websiteSystemPrompt}\n\nUser request:\n${prompt}`,
    });

    return response.text || "";
  };

  const providers: Array<[string, () => Promise<string | null>]> =
    preferredProvider === "gemini"
      ? [
          ["Gemini", runGemini],
          ["OpenAI", runOpenAI],
        ]
      : [
          ["OpenAI", runOpenAI],
          ["Gemini", runGemini],
        ];

  for (const [providerName, runProvider] of providers) {
    try {
      const result = await runProvider();
      if (result) return result;
    } catch (error) {
      failures.push(describeAIError(providerName, error));
      console.warn("AI provider failed, trying fallback if available:", error);
    }
  }

  if (failures.length) {
    throw new Error(`AI providers failed. ${failures.join(" | ")}`);
  }

  throw new Error("No AI key found. Add OPENAI_API_KEY or GEMINI_API_KEY.");
}

export async function generateChatReply({ prompt, history }: ChatConfig) {
  const historyText = history
    ? history
        .slice(-8)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")
    : "";

  const combinedPrompt = historyText
    ? `Previous conversation:\n${historyText}\n\nUser: ${prompt}`
    : prompt;

  const systemInstruction =
    "You are Webrion AI, a concise website-building assistant. Give practical answers. When the user asks for code, provide clear code and next steps.";

  if (hasGeminiKey()) {
    try {
      const geminiClient = getGeminiClient();
      const response = await geminiClient.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: combinedPrompt,
        config: {
          systemInstruction,
        },
      });

      if (response.text) return response.text;
    } catch (error) {
      console.warn("Gemini chat failed, trying OpenAI fallback:", error);
    }
  }

  const openaiClient = getOpenAIClient();
  if (openaiClient) {
    const response = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: combinedPrompt },
      ],
      temperature: 0.35,
    });

    return response.choices[0]?.message?.content || "";
  }

  throw new Error("No AI key found. Add GEMINI_API_KEY or OPENAI_API_KEY.");
}
