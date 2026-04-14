import React from "react";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  const formatText = (text) => {
    // Bold **text**
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isBot ? "row" : "row-reverse",
      alignItems: "flex-end",
      gap: "0.5rem",
      marginBottom: "0.8rem",
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: isBot ? "linear-gradient(135deg,#40916c,#1b4332)" : "#e8f5e9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1rem", border: `2px solid ${isBot ? "#b7e4c7" : "#74c69d"}`,
      }}>
        {isBot ? "🌿" : "👤"}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: "78%",
        background: isBot ? "#f6fdf7" : "linear-gradient(135deg,#40916c,#1b4332)",
        color: isBot ? "#1b4332" : "#fff",
        borderRadius: isBot ? "0 12px 12px 12px" : "12px 0 12px 12px",
        padding: "0.6rem 0.9rem",
        fontSize: "0.83rem",
        lineHeight: 1.55,
        border: isBot ? "1px solid #b7e4c7" : "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        whiteSpace: "pre-wrap",
      }}>
        {formatText(message.text)}
        <div style={{
          fontSize: "0.65rem",
          color: isBot ? "#999" : "rgba(255,255,255,0.7)",
          marginTop: "0.3rem",
          textAlign: "right",
        }}>
          {message.time}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
