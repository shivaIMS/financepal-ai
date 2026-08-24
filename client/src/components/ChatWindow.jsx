import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";
import { formatMoney } from "../utils/validation.js";

export default function ChatWindow({ messages, streaming, error, profile, onSend, onRetry, onReset }) {
  const bottomRef = useRef(null);

  // Keep the latest message in view while streaming.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const empty = messages.length === 0;

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="brand">
          <span className="brand-logo">💸</span>
          <div>
            <h1>FinancePal AI</h1>
            <p className="tagline">Personal AI financial advisor</p>
          </div>
        </div>
        <div className="header-actions">
          {profile && (
            <span className="chip" title="Your profile is active">
              💳 Income {formatMoney(profile.monthlyIncome)} · Exp {formatMoney(profile.monthlyExpenses)}
            </span>
          )}
          <button type="button" className="btn ghost small" onClick={onReset}>
            Reset
          </button>
        </div>
      </header>

      <main className="chat-body">
        {empty && (
          <div className="empty-state">
            <div className="empty-emoji">💬</div>
            <h2>How can I help you today?</h2>
            <p className="muted">
              Ask me anything about budgeting, saving, or paying off debt.
              <br />
              I'll factor in your profile: income{" "}
              <strong>{formatMoney(profile?.monthlyIncome)}</strong>, expenses{" "}
              <strong>{formatMoney(profile?.monthlyExpenses)}</strong>.
            </p>
            <div className="suggestions">
              {[
                "How should I budget this month?",
                "How much should I save for an emergency fund?",
                "Best way to pay off my credit card debt?",
              ].map((s) => (
                <button key={s} type="button" className="suggestion-chip" onClick={() => onSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="msg-list">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
        </div>
        <div ref={bottomRef} />
      </main>

      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️ {error}</span>
          {lastUserMessage && (
            <button type="button" className="btn ghost small" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      )}

      <footer className="chat-footer">
        <ChatInput onSend={onSend} disabled={streaming} />
        <p className="disclaimer">
          Not financial advice — educational guidance only.
        </p>
      </footer>
    </div>
  );
}
