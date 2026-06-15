export interface GenerateConfig {
  prompt: string;
}

export interface ChatConfig {
  prompt: string;
  history?: { role: string; content: string }[];
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

function getOpenRouterKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is missing in server environment variables.");
  return key;
}

function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-70b-instruct";
}

async function openRouterChatCompletions({
  messages,
  temperature,
}: {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
}): Promise<string> {
  const key = getOpenRouterKey();

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: getOpenRouterModel(),
      messages,
      temperature: temperature ?? 0.25,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${res.status}). ${text}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

export async function generateWebsiteCode({ prompt }: GenerateConfig) {
  return await openRouterChatCompletions({
    messages: [
      { role: "system", content: websiteSystemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.25,
  });
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

  return await openRouterChatCompletions({
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: combinedPrompt },
    ],
    temperature: 0.35,
  });
}

