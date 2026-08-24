// Client-side API helpers.

const CHAT_URL = "/api/chat";

// Parses the SSE stream from the chat endpoint.
// Calls handlers for each event type; resolves when the stream ends.
export async function streamChat({ sessionId, message, profile, onToken, onSession, onDone, onError }) {
  try {
    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message, profile }),
    });

    if (!res.ok) {
      let detail = "Request failed";
      try {
        const body = await res.json();
        detail = body.error || detail;
      } catch {
        /* ignore */
      }
      throw new Error(detail);
    }

    if (!res.body) throw new Error("Streaming not supported by this browser.");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Split into SSE blocks: "event: x\ndata: {...}\n\n"
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop();
      for (const block of blocks) {
        const lines = block.split("\n");
        let event = "message";
        let data = "";
        for (const line of lines) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          if (line.startsWith("data:")) data += line.slice(5).trim();
        }
        if (!data) continue;
        let payload;
        try {
          payload = JSON.parse(data);
        } catch {
          continue;
        }
        if (event === "session") onSession?.(payload.sessionId);
        else if (event === "token") onToken?.(payload.text);
        else if (event === "done") onDone?.();
        else if (event === "error") onError?.(payload.message);
      }
    }
  } catch (err) {
    onError?.(err.message || "Failed to reach the server.");
  }
}

export async function fetchHealth() {
  const res = await fetch("/api/chat/health");
  if (!res.ok) throw new Error("Server unreachable");
  return res.json();
}
