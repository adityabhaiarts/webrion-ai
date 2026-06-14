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
    if (!key) throw new Error("GEMINI_API_KEY environment variable is required.");
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY environment variable is required.");
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export async function generateWebsiteCode({ prompt }: GenerateConfig) {
  const client = getOpenAIClient();
  
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are Webrion AI, a professional AI website generator for local businesses. You generate complete website code (HTML, CSS, JS, and sometimes PHP).

Return MUST be a valid JSON object matching this schema exactly. No other text, no markdown fences:
{
  "files": [
    { "name": "index.html", "content": "..." },
    { "name": "style.css", "content": "..." },
    { "name": "script.js", "content": "..." }
  ],
  "deployment_steps": "markdown guide here",
  "suggestions": "short text"
}`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2
  });

  return response.choices[0].message.content;
}

export async function generateChatReply({ prompt, history }: ChatConfig) {
  const client = getGeminiClient();
  
  const historyText = history ? history.map((m: any) => `${m.role}: ${m.content}`).join("\n") : "";
  const combinedPrompt = historyText 
    ? `Previous conversation:\n${historyText}\n\nUser: ${prompt}`
    : prompt;

  const response = await client.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: combinedPrompt,
    config: {
      systemInstruction: "You are Webrion AI, a helpful, professional AI assistant for a website generation platform. You guide users, provide website ideas, and discuss technical setups. If a user asks to generate a website, tell them you can do that and ask for details, or suggest they use the generator. Keep responses concise.",
    }
  });

  return response.text;
}
