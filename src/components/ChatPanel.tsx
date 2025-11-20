import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type ChatRole = "assistant" | "user";

interface Message {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hello! I'm Uniguru, your AI trading assistant. Ask me anything about market analysis, trading strategies, or what's happening right now.",
    timestamp: new Date().toISOString(),
  },
];

const MOCK_RESPONSES = [
  "BTC is showing strong support near $43,000. Check the 4H RSI for confirmation before entering.",
  "ETH/USDT is forming a potential reversal on the 1H timeframe—watch the close around $2,320.",
  "Your risk parameters look solid. Consider scaling in rather than going all-in immediately.",
  "Volatility is still high. Keep position size small and reassess every 15 minutes.",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const autoScroll = useRef(true);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!autoScroll.current) return;
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  };

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <= 24;
      autoScroll.current = nearBottom;
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom(messages.length <= 2 ? "auto" : "smooth");
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const appendMessage = (role: ChatRole, content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${role}`, role, content, timestamp: new Date().toISOString() },
    ]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    appendMessage("user", trimmed);
    setInput("");
    setIsTyping(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (inputRef.current) inputRef.current.style.height = "48px";
    });

    await new Promise((resolve) => setTimeout(resolve, 900));
    const reply = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    appendMessage("assistant", reply);
    setIsTyping(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    event.target.style.height = "48px";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`;
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="flex h-[600px] max-h-[600px] min-h-[600px] flex-col rounded-lg border border-slate-700/50 bg-[#0f1729] shadow-xl"
      style={{ height: "600px", maxHeight: "600px" }}
    >
      {/* Header - matching your site's dark theme */}
      <div className="flex items-center justify-between border-b border-slate-700/50 bg-[#151d31] px-5 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <span className="text-base font-semibold text-white">Uniguru Chat</span>
          </div>
          <span className="text-xs uppercase tracking-[0.35em] text-slate-400">AI TRADING ASSISTANT</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 bg-[#0f1729] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600/40"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[96%] sm:max-w-[75%] items-start gap-3 ${
                    isUser ? "flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center ${
                      isUser 
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
                        : "bg-gradient-to-br from-slate-700 to-slate-600 text-white"
                    } shadow-lg`}
                  >
                    {isUser ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                      isUser
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-500/30"
                        : "bg-[#1a2235] text-slate-200 border border-slate-600/40"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <span 
                      aria-hidden 
                      className={`mt-2 block text-[11px] ${
                        isUser ? "text-blue-200/70" : "text-slate-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 text-white shadow-lg flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex gap-1 rounded-2xl bg-[#1a2235] border border-slate-600/40 px-4 py-3 shadow-lg">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-[#151d31] px-4 py-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask Uniguru anything..."
            aria-label="Ask Uniguru anything"
            aria-multiline="true"
            rows={1}
            className="min-h-[48px] max-h-[140px] flex-1 resize-none overflow-y-auto rounded-xl border border-slate-600/50 bg-[#0f1729] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-colors"
          />
          <Button
            aria-label="Send message"
            aria-disabled={!input.trim() || isTyping}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-3 h-12 hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:from-slate-700 disabled:to-slate-700 transition-all shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}