import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { findResponse, QUICK_REPLIES } from "./chatbotData";

const STORAGE_KEY = "w2w_chat_history";

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const BOT_GREETING = {
  id: 1,
  sender: "bot",
  text: "👋 Hi there! I'm the **Waste2Worth** assistant.\n\nHow can I help you today? Click a quick reply or type your question below!",
  time: getTime(),
};

const ChatBot = () => {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [BOT_GREETING];
    } catch { return [BOT_GREETING]; }
  });
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(0);
  const messagesEndRef         = useRef(null);
  const inputRef               = useRef(null);

  // Persist messages
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  const addBotMessage = (text) => {
    setTyping(true);
    setTimeout(() => {
      const botMsg = { id: Date.now(), sender: "bot", text, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
      if (!open) setUnread((u) => u + 1);
    }, 700 + Math.random() * 400);
  };

  const handleSend = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), sender: "user", text: trimmed, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const response = findResponse(trimmed);
    addBotMessage(response);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const clearHistory = () => {
    setMessages([BOT_GREETING]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Chat with us"
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9000,
          width: 58, height: 58, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg,#40916c,#1b4332)",
          color: "#fff", fontSize: "1.6rem", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(27,67,50,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? "✕" : "💬"}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4, background: "#e63946",
            color: "#fff", borderRadius: "50%", width: 20, height: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 700,
          }}>{unread}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "5rem", right: "1.5rem", zIndex: 9001,
          width: 340, maxWidth: "calc(100vw - 2rem)",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
          border: "1px solid #b7e4c7",
          animation: "slideUp 0.25s ease",
        }}>
          <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "0.9rem 1rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🌿</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>Waste2Worth Bot</div>
              <div style={{ color: "#b7e4c7", fontSize: "0.72rem" }}>🟢 Online · Usually replies instantly</div>
            </div>
            <button onClick={clearHistory} title="Clear chat" style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "0.2rem 0.5rem", cursor: "pointer", fontSize: "0.75rem" }}>🗑️</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.8rem", background: "#fff", minHeight: 280, maxHeight: 340 }}>
            {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {typing && (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#40916c,#1b4332)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🌿</div>
                <div style={{ background: "#f6fdf7", border: "1px solid #b7e4c7", borderRadius: "0 10px 10px 10px", padding: "0.5rem 0.8rem" }}>
                  <span style={{ display: "inline-flex", gap: 3 }}>
                    {[0,1,2].map((i) => (
                      <span key={i} style={{ width: 6, height: 6, background: "#40916c", borderRadius: "50%", display: "inline-block", animation: `bounce 1s ${i*0.2}s infinite` }} />
                    ))}
                  </span>
                  <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding: "0.5rem 0.8rem", background: "#f6fdf7", borderTop: "1px solid #e8f5e9", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {QUICK_REPLIES.slice(0, 4).map((qr) => (
              <button
                key={qr}
                onClick={() => handleSend(qr)}
                style={{
                  padding: "0.25rem 0.6rem", borderRadius: 20, border: "1px solid #b7e4c7",
                  background: "#fff", color: "#2d6a4f", fontSize: "0.72rem",
                  cursor: "pointer", fontWeight: 500, transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1b4332"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#2d6a4f"; }}
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "0.7rem", background: "#fff", borderTop: "1px solid #e8f5e9", gap: "0.5rem" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              style={{
                flex: 1, border: "1px solid #b7e4c7", borderRadius: 20, padding: "0.5rem 0.9rem",
                fontSize: "0.85rem", outline: "none", color: "#333",
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              style={{
                width: 38, height: 38, borderRadius: "50%", border: "none",
                background: input.trim() ? "linear-gradient(135deg,#40916c,#1b4332)" : "#e8f5e9",
                color: input.trim() ? "#fff" : "#aaa",
                cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                transition: "all 0.2s", flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
