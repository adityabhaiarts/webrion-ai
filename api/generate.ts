import { generateWebsiteCode } from "../src/lib/ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "Prompt is required" });
    const result = await generateWebsiteCode({ prompt });
    return res.status(200).json({ result });
  } catch (error: any) {
    console.error("Generate API error:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate website" });
  }
}
