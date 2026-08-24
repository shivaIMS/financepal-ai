import { useEffect, useRef, useState } from "react";
import ProfileForm from "./components/ProfileForm.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { streamChat } from "./api/chat.js";

const SESSION_KEY = "financepal.sessionId";
const PROFILE_KEY = "financepal.profile";

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [view, setView] = useState(() => (loadJson(PROFILE_KEY) ? "chat" : "profile"));
  const [profile, setProfile] = useState(() => loadJson(PROFILE_KEY));
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY));
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const lastUserMessage = useRef("");

  function handleProfileSubmit(p) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
    setView("chat");
  }

  function handleReset() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SESSION_KEY);
    setProfile(null);
    setSessionId(null);
    setMessages([]);
    setError(null);
    setView("profile");
  }

  async function handleSend(text) {
    const clean = text.trim();
    if (!clean || streaming) return;

    lastUserMessage.current = clean;
    setError(null);
    setStreaming(true);
    setMessages((m) => [
      ...m,
      { role: "user", content: clean },
      { role: "assistant", content: "" },
    ]);

    await streamChat({
      sessionId,
      message: clean,
      profile,
      onSession: (id) => {
        setSessionId(id);
        localStorage.setItem(SESSION_KEY, id);
      },
      onToken: (tok) => {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + tok };
          return copy;
        });
      },
      onDone: () => setStreaming(false),
      onError: (msg) => {
        // Drop the empty pending assistant bubble, keep the user message.
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant" && !last.content) copy.pop();
          return copy;
        });
        setError(msg);
        setStreaming(false);
      },
    });
  }

  return (
    <div className="app">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      {view === "profile" ? (
        <ProfileForm onSubmit={handleProfileSubmit} />
      ) : (
        <ChatWindow
          messages={messages}
          streaming={streaming}
          error={error}
          profile={profile}
          onSend={handleSend}
          onRetry={() => handleSend(lastUserMessage.current)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
