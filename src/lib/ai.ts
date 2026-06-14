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

const websiteSystemPrompt = `
You are Webrion AI, a premium AI website generator.

Return ONLY valid JSON.
Do not return markdown.
Do not use code fences.

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
- Generate complete working code.
- Make the design modern, premium, responsive.
- Add WhatsApp button when useful.
- Do not explain outside JSON.
`;

export async function generateWebsiteCode({ prompt }: GenerateConfig) {
  const openaiClient = getOpenAIClient();

  if (openaiClient) {
    try {
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
    } catch (error) {
      console.warn("OpenAI failed, trying Gemini fallback:", error);
    }
  }

  const geminiClient = getGeminiClient();

  const response = await geminiClient.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: `${websiteSystemPrompt}\n\nUser request:\n${prompt}`,
  });

  return response.text || "";
}

export async function generateChatReply({ prompt, history }: ChatConfig) {
  const geminiClient = getGeminiClient();

  const historyText = history
    ? history
        .slice(-8)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")
    : "";

  const combinedPrompt = historyText
    ? `Previous conversation:\n${historyText}\n\nUser: ${prompt}`
    : prompt;

  const response = await geminiClient.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: combinedPrompt,
    config: {
      systemInstruction:
        "You are Webrion AI, a friendly website-building assistant. Give useful, concise replies. When the user asks for code, provide clear code and next steps.",
    },
  });

  return response.text || "";
}