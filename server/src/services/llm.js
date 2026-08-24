// LLM provider abstraction: streams response tokens for a message thread.
// Supports two providers selected by env LLM_PROVIDER: "openai" or "ollama".
import { buildSystemPrompt } from "../prompts/system.js";

const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();

export function getProvider() {
  return provider;
}

// Builds the message list sent to the model: system prompt + session history.
export function buildMessages(profile, history) {
  return [{ role: "system", content: buildSystemPrompt(profile) }, ...history];
}

// Core streaming function. Yields text chunks as they arrive.
export async function* streamChat(messages) {
  if (provider === "ollama") {
    yield* streamOllama(messages);
  } else {
    yield* streamOpenAI(messages);
  }
}

async function* streamOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to server/.env or switch LLM_PROVIDER=ollama.");
  }
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  if (!res.body) throw new Error("LLM response has no body stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE lines from OpenAI: "data: {...}\n\n"
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep partial line in buffer
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // Ignore malformed keep-alive/comment lines.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function* streamOllama(messages) {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "llama3.2";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: { temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Ollama request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  if (!res.body) throw new Error("Ollama response has no body stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Ollama emits newline-delimited JSON objects.
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.done) return;
          const delta = json.message?.content;
          if (delta) yield delta;
        } catch {
          // Ignore malformed lines.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
