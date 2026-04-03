import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

interface ChatbotProps {
  onClose?: () => void;
  isFloating?: boolean;
}

export default function Chatbot({ onClose, isFloating = false }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Smart Finance Companion AI. How can I help you with your financial goals today?",
      sender: 'ai',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: input }]
          }
        ],
        config: {
          systemInstruction: "You are a Smart Finance Companion AI. Provide helpful, concise financial advice, savings tips, and answer user queries about money management. Keep responses friendly and professional.",
        },
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't process that request.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-white overflow-hidden",
      isFloating ? "fixed bottom-24 right-6 w-[85vw] h-[60vh] rounded-[32px] shadow-2xl border border-slate-100 z-[100]" : "h-full"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Finance AI</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id}
            className={cn(
              "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
              msg.sender === 'user' 
                ? "ml-auto bg-indigo-600 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-700 rounded-tl-none"
            )}
          >
            {msg.text}
          </motion.div>
        ))}
        {isLoading && (
          <div className="bg-slate-100 text-slate-400 p-4 rounded-2xl rounded-tl-none w-16 flex justify-center">
            <Loader2 size={20} className="animate-spin" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about finance..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
              input.trim() && !isLoading ? "bg-indigo-600 text-white" : "text-slate-300"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
