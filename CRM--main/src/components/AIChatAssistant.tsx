/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Trash2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { DUMMY_CONTACTS, DUMMY_DEALS, DUMMY_TASKS } from '../constants';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { label: "Show high-value leads", icon: Target },
  { label: "What deals are closing this week?", icon: Calendar },
  { label: "Summarize Sarah Johnson's profile", icon: Users },
  { label: "Predict conversion likelihood", icon: TrendingUp },
];

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your Nexus AI Assistant. I can help you analyze your CRM data, summarize leads, and provide insights. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const context = `
        You are an AI CRM Assistant for Nexus CRM. 
        Current CRM Data:
        Contacts: ${JSON.stringify(DUMMY_CONTACTS)}
        Deals: ${JSON.stringify(DUMMY_DEALS)}
        Tasks: ${JSON.stringify(DUMMY_TASKS)}

        Instructions:
        - Answer questions based on the provided CRM data.
        - Be professional, concise, and helpful.
        - Use markdown for formatting.
        - If asked about high-value leads, look for leads with high 'value'.
        - If asked about deals closing, look at 'expectedClose' dates.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          { role: 'user', parts: [{ text }] }
        ],
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || "I'm sorry, I couldn't process that request." 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please check your API key or try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-64px)] flex flex-col max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-black shadow-sm border border-gray-200">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Nexus AI Assistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Always Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: "Hello! I'm your Nexus AI Assistant. I can help you analyze your CRM data, summarize leads, and provide insights. How can I help you today?" }])}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 card-base !p-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={cn(
              "flex items-start gap-3 md:gap-4 max-w-[90%] md:max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                m.role === 'user' 
                  ? "bg-white border-border-gray text-text-secondary" 
                  : "bg-gray-100 border-gray-200 text-black"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
              <div className={cn(
                "p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                m.role === 'user' 
                  ? "bg-black text-white rounded-tr-none" 
                  : "bg-gray-50 text-text-primary rounded-tl-none border border-gray-100"
              )}>
                <div className="markdown-body prose prose-sm max-w-none prose-gray">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 md:gap-4 max-w-[90%] md:max-w-[85%]">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-black shrink-0 shadow-sm">
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Nexus is analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 border-t border-border-gray bg-gray-50 space-y-4">
          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.label)}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-gray-100 hover:text-black rounded-xl text-[10px] font-bold text-text-secondary transition-all text-left border border-border-gray hover:border-gray-200 shadow-sm uppercase tracking-widest"
                >
                  <s.icon className="w-4 h-4 shrink-0 text-black" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="Ask Nexus anything..."
              className="w-full bg-white border border-border-gray rounded-2xl px-4 md:px-5 py-3 md:py-4 pr-14 md:pr-16 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all shadow-sm group-hover:border-gray-300"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-xl transition-all",
                input.trim() && !isLoading 
                  ? "bg-black text-white hover:bg-neutral-800 hover:scale-105 active:scale-95" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-text-secondary font-bold uppercase tracking-widest">
            Powered by Gemini 1.5 Flash • Nexus AI can make mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
