// Chat route: POST /api/chat with { sessionId, message }.
// Streams the assistant reply back as Server-Sent Events (SSE).
import { Router } from "express";
import { getOrCreateSession, setProfile, addMessage } from "../store/session.js";
import { buildMessages, streamChat, getProvider } from "../services/llm.js";

const router = Router();

// POST /api/chat
router.post("/", async (req, res) => {
  const { sessionId, message, profile } = req.body ?? {};

  // --- Validate input (system boundary) ---
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }
  const cleanMessage = message.trim().slice(0, 4000);

  const session = getOrCreateSession(sessionId);
  if (profile && typeof profile === "object") {
    setProfile(session, sanitizeProfile(profile));
  }

  addMessage(session, "user", cleanMessage);

  // --- SSE setup ---
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  send("session", { sessionId: session.id });

  let full = "";
  try {
    // session.messages already includes the user message just added above.
    const messages = buildMessages(session.profile, session.messages);
    for await (const chunk of streamChat(messages)) {
      full += chunk;
      send("token", { text: chunk });
    }
    addMessage(session, "assistant", full);
    send("done", {});
  } catch (err) {
    console.error("[chat] streaming error:", err.message);
    send("error", { message: friendlyError(err) });
  } finally {
    res.end();
  }
});

// POST /api/health — simple health check.
router.get("/health", (_req, res) => {
  res.json({ ok: true, provider: getProvider(), uptime: process.uptime() });
});

function sanitizeProfile(profile) {
  const clampMoney = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : fallback;
  };
  return {
    monthlyIncome: clampMoney(profile.monthlyIncome),
    monthlyExpenses: clampMoney(profile.monthlyExpenses),
    savingsGoal: clampMoney(profile.savingsGoal),
    notes: typeof profile.notes === "string" ? profile.notes.slice(0, 500) : "",
  };
}

function friendlyError(err) {
  const msg = err?.message || "Unknown error";
  if (/OPENAI_API_KEY|OLLAMA|failed \(\d+\)|fetch failed|ECONNREFUSED/i.test(msg)) {
    return `I couldn't reach the AI provider (${getProvider()}). Check the server config and that the model service is running, then retry.`;
  }
  return "Something went wrong while generating a reply. Please try again.";
}

export default router;
