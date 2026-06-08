import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: number;
  isBot: boolean;
  text: string;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, isBot: true, text: t("chatbotWelcome") },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => (m.id === 1 ? { ...m, text: t("chatbotWelcome") } : m))
    );
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildHistory = (msgs: Message[]): ApiMessage[] =>
    msgs
      .filter((m) => m.id !== 1)
      .map((m) => ({ role: m.isBot ? "assistant" : "user", content: m.text }));

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now(), isBot: false, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = buildHistory([...messages, userMsg]);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("API error");
      const data = (await res.json()) as { reply: string };

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, isBot: true, text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          isBot: true,
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-8 pb-6 px-4 h-[calc(100vh-4rem)]">
      <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">

        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Bot className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold">{t("navChatbot")}</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-xs text-muted-foreground">{t("alwaysOnline")}</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.isBot ? "bg-primary/20" : "bg-primary"}`}>
                  {msg.isBot
                    ? <Bot className="w-5 h-5 text-primary" />
                    : <User className="w-5 h-5 text-primary-foreground" />}
                </div>
                <div className={`p-4 rounded-2xl whitespace-pre-wrap leading-relaxed ${msg.isBot ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-primary/20">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="p-4 rounded-2xl bg-muted text-muted-foreground rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t("thinking")}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center gap-2">
            <input
              data-testid="input-chat"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t("askQuestion")}
              disabled={isLoading}
              className="flex-1 bg-muted rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
            <button
              data-testid="button-send"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
