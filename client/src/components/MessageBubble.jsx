export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`msg-row ${isUser ? "user" : "assistant"}`}>
      <div className="avatar">{isUser ? "🙂" : "💸"}</div>
      <div className={`bubble ${isUser ? "user" : "assistant"}`}>
        {message.content || (
          <span className="typing-dots" aria-label="FinancePal is typing">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
    </div>
  );
}
