"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { SafetyResource } from "@/config/safety-resources";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  urgent?: boolean;
  resources?: SafetyResource[];
};

const suggestions = [
  "My child gets upset when screen time ends.",
  "My daughter is not listening when I call her.",
  "میرا بچہ چھوٹی چھوٹی باتوں پر غصہ کرتا ہے۔"
];

function isUrdu(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event?: FormEvent, preset?: string) {
    event?.preventDefault();
    const content = (preset ?? input).trim();
    if (!content || loading) return;

     const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to get a response.");

      setMessages((current) => [
        ...current,
       {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          urgent: Boolean(data.urgent),
          resources: data.resources ?? []
       }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function startNewConversation() {
    setMessages([]);
    setInput("");
    setError("");
    inputRef.current?.focus();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Parenting Support Coach home">
          <span className="brand-mark">♡</span>
          <span>little steps</span>
        </a>
        <div className="topbar-right">
          <span className="language-note">English · اردو</span>
          <button className="new-chat" onClick={startNewConversation} disabled={messages.length === 0 && !input}>
            <span aria-hidden="true">＋</span> New chat
          </button>
        </div>
      </header>

      <section className="main-content">
        <div className="intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> A LITTLE SUPPORT FOR THE BIG JOB</div>
          <h1>You don’t have to figure it all out <em>alone.</em></h1>
          <p className="intro-copy">A calm space to think through parenting challenges, find a small next step, and keep going.</p>
        </div>

        <section className="chat-panel" aria-label="Parenting coach conversation">
          <div className="chat-heading">
            <div className="coach-avatar">✳</div>
            <div>
              <div className="coach-name">Your parenting coach</div>
              <div className="coach-status"><span /> Here to listen, not judge</div>
            </div>
            <div className="private-note">PRIVATE SESSION</div>
          </div>

          <div className="conversation" aria-live="polite">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">☀</div>
                <h2>What’s on your mind today?</h2>
                <p>Big feelings, tricky routines, school worries, or just a hard day — start wherever you are.</p>
                <div className="suggestion-label">NOT SURE HOW TO START?</div>
                <div className="suggestions">
                  {suggestions.map((suggestion) => (
                    <button key={suggestion} className="suggestion" onClick={() => sendMessage(undefined, suggestion)}>
                      {suggestion}<span>↗</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="message-list">
                {messages.map((message) => (
                  <article key={message.id} className={`message-row ${message.role}`}>
                    {message.role === "assistant" && <div className="message-avatar">✳</div>}
                    <div className={`message-bubble ${message.urgent ? "urgent-bubble" : ""}`} dir={isUrdu(message.content) ? "rtl" : "auto"}>
                      {message.urgent && <div className="urgent-label">URGENT SUPPORT</div>}
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.resources?.length ? (
                        <div className="safety-resources">
                          <strong>Get help in the UAE</strong>

                          {message.resources.map((resource) => (
                            <a
                              key={`${resource.name}-${resource.number}`}
                              href={`tel:${resource.number}`}
                              className="safety-resource"
                            >
                              <span>
                                <strong>{resource.name}</strong>
                                <small>{resource.description}</small>
                              </span>

                              <span className="resource-number">
                                {resource.number} ↗
                              </span>
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
                {loading && (
                  <div className="message-row assistant">
                    <div className="message-avatar">✳</div>
                    <div className="message-bubble typing"><span /><span /><span /></div>
                  </div>
                )}
              </div>
            )}
            {error && <div className="error-message" role="alert">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form className="composer" onSubmit={(event) => sendMessage(event)}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Tell me what’s happening… (English or Urdu)"
              rows={2}
              maxLength={2000}
              aria-label="Describe your parenting concern"
              disabled={loading}
              dir={isUrdu(input) ? "rtl" : "auto"}
            />
            <div className="composer-bottom">
              <span className="input-hint">Be as brief or detailed as you like · Enter to send</span>
              <button type="submit" className="send-button" disabled={!input.trim() || loading} aria-label="Send message">
                {loading ? "…" : "↑"}
              </button>
            </div>
          </form>
        </section>

        <div className="safety-note">
          <span className="safety-icon">♡</span>
          <p><strong>A gentle reminder:</strong> This is general parenting support, not professional medical, mental-health, or legal advice. If anyone is in immediate danger, contact local emergency services.</p>
        </div>
        <footer>Made for the everyday moments that matter. <span>One small step at a time.</span></footer>
      </section>
    </main>
  );
}
