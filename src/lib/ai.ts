import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export interface GenerateConfig {
  prompt: string;
}

export interface ChatConfig {
  prompt: string;
  history?: { role: string; content: string }[];
}

let ai: GoogleGenAI | null = null;
let openai: OpenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is missing in Vercel Environment Variables.");
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is missing in Vercel Environment Variables.");
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export async function generateWebsiteCode({ prompt }: GenerateConfig) {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are Webrion AI, a premium website generator. Return ONLY valid JSON. No markdown fences.

Schema:
{
  "projectName": "short project name",
  "description": "short useful summary",
  "websiteType": "business type",
  "files": [
    { "name": "index.html", "content": "complete code" },
    { "name": "style.css", "content": "complete code" },
    { "name": "script.js", "content": "complete code" }
  ],
  "deploymentSteps": "clear steps to deploy",
  "suggestions": ["short suggestion 1", "short suggestion 2"]
}

Rules:
- Make modern responsive websites.
- Include WhatsApp/contact CTAs when useful.
- Do not include unsafe external scripts except common CDN links when needed.
- Keep code complete and ready to save as files.`
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.25
  });

  return response.choices[0]?.message?.content || "";
}

export async function generateChatReply({ prompt, history }: ChatConfig) {
  const client = getGeminiClient();
  const historyText = history ? history.slice(-8).map((m) => `${m.role}: ${m.content}`).join("\n") : "";
  const combinedPrompt = historyText
    ? `Previous conversation:\n${historyText}\n\nUser: ${prompt}`
    : prompt;

  const response = await client.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: combinedPrompt,
    config: {
      systemInstruction: "You are Webrion AI, a friendly website-building assistant. Give useful, concise replies. When the user asks for code, provide clear code and next steps.",
    }
  });

  return response.text || "";
}
