import Anthropic from "@anthropic-ai/sdk";

// The Studio front end runs on GitHub Pages (a different origin), so the
// browser sends a CORS preflight before the real request. Only these origins
// may use the proxy.
const ALLOWED_ORIGINS = [
  "https://western-studio.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
];

// The endpoint is public, so the server decides the model and limits —
// whatever the browser sends cannot raise them.
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1000;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 4000;
const MAX_SYSTEM_CHARS = 20000;

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
  }
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: "Conversation too long — please start a fresh chat." });
  }
  const clean = messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, MAX_MESSAGE_CHARS),
  }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: typeof system === "string" ? system.slice(0, MAX_SYSTEM_CHARS) : undefined,
      messages: clean,
    });
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return res.status(err.status ?? 500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Upstream request failed" });
  }
}
