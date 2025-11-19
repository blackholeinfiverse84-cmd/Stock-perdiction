import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type ChatRole = 'assistant' | 'user';

interface Message {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hello! I'm Uniguru, your AI trading assistant. Ask me anything about market analysis, trading strategies, or the current predictions.",
    timestamp: new Date().toISOString(),
  },
];

const MOCK_RESPONSES = [
  'Based on current order flow, BTC is showing strong support near $43k. Watch the 4H RSI for confirmation.',
  'ETH/USDT is forming a potential reversal on the 1H timeframe. A close above $2,320 would invalidate the short setup.',
  'Your risk parameters look solid. Consider scaling into the position instead of entering all at once.',
  'Macro volatility is elevated. Keep leverage light and reassess every 15 minutes.',
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const shouldAutoScroll = useRef(true);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (!shouldAutoScroll.current) return;
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const tolerance = 24;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= tolerance;
      shouldAutoScroll.current = atBottom;
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    scrollToBottom(messages.length <= 2 ? 'auto' : 'smooth');
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const appendMessage = (role: ChatRole, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${role}`,
        role,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    appendMessage('user', trimmed);
    setInput('');
    setIsTyping(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (inputRef.current) {
        inputRef.current.style.height = '48px';
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 900));
    const reply = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    appendMessage('assistant', reply);
    setIsTyping(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const el = event.target;
    el.style.height = '48px';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[600px] max-h-[600px] min-h-[600px] flex-col rounded-2xl border border-slate-800/60 bg-slate-950/70 shadow-lg shadow-black/20" style={{ height: '600px', maxHeight: '600px' }}>
      <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Uniguru Chat</span>
          </div>
          <p className="text-sm text-slate-400">AI trading assistant</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/70"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse text-right' : ''}`}
            >
              <div
                className={`h-9 w-9 flex-shrink-0 rounded-full ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-slate-800'
                } flex items-center justify-center`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5 text-white" />
                ) : (
                  <User className="h-5 w-5 text-slate-300" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'assistant'
                    ? 'bg-slate-800/80 text-slate-100'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="mt-2 block text-xs text-white/60">{formatTime(message.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-center gap-3 text-slate-400">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex gap-1 rounded-2xl bg-slate-800/80 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/60 bg-slate-900/60 px-4 py-3">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask Uniguru anything..."
            rows={1}
            className="min-h-[48px] max-h-[140px] flex-1 resize-none overflow-y-auto border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="self-end bg-blue-600 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}