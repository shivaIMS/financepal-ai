import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [emptyError, setEmptyError] = useState(false);

  function submit() {
    if (disabled) return;
    if (!text.trim()) {
      setEmptyError(true);
      return;
    }
    setEmptyError(false);
    onSend(text);
    setText("");
  }

  function handleKeyDown(e) {
    // Enter sends, Shift+Enter adds a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="chat-input-wrap">
      {emptyError && (
        <p className="field-error inline">Type a message first.</p>
      )}
      <div className="chat-input">
        <textarea
          rows="1"
          placeholder="Ask about budgeting, saving, debt payoff…"
          value={text}
          maxLength={4000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message"
        />
        <button
          type="button"
          className="btn primary send"
          onClick={submit}
          disabled={disabled}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
      <p className="hint">Enter to send · Shift+Enter for a new line</p>
    </div>
  );
}
