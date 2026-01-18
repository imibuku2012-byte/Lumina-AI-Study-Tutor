
import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Message, GroundingSource } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const ThinkingIndicator: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [stage, setStage] = useState(0);
  const stages = [
    "Analyzing Problem...",
    "Deep Reasoning Mode...",
    "Calculating Steps...",
    "Verifying Logic...",
    "Cross-referencing Sources...",
    "Structuring Response..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 0.1);
    }, 100);

    const stageTimer = setInterval(() => {
      setStage(s => (s + 1) % stages.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(stageTimer);
    };
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-slate-900 text-white p-5 rounded-3xl rounded-tl-none border border-slate-700 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-left-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Deep Reasoning</span>
            <span className="text-xs font-bold text-slate-300">{stages[stage]}</span>
          </div>
          <div className="ml-4 pl-4 border-l border-slate-700">
            <span className="text-xs font-mono font-bold text-indigo-400">
              {seconds.toFixed(1)}s
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[loading_10s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  inputValue, 
  isTyping, 
  onInputChange, 
  onSend 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm font-black shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-900 text-white'
              }`}>
                {msg.role === 'user' ? 'ME' : 'AI'}
              </div>
              <div className="flex flex-col gap-2">
                <div className={`p-5 rounded-3xl shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  <article className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'} prose-headings:font-black prose-p:font-medium`}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </article>
                  
                  {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Verified Knowledge Base
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] bg-slate-50 border border-slate-100 text-indigo-600 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all truncate max-w-[180px]"
                            title={src.title}
                          >
                            {src.title || new URL(src.uri).hostname}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && <ThinkingIndicator />}
      </div>

      <div className="p-6 bg-slate-50/50 border-t border-slate-100">
        <div className="relative group">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or work through a problem..."
            rows={2}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-5 pr-14 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none text-slate-800 resize-none shadow-sm transition-all font-bold placeholder:font-medium"
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-3 bottom-3 p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-black">
            Lumina Mentorship System v3.1
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">Deep Thinking Engaged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
