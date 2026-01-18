
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { QuizQuestion } from '../types';

interface QuizInterfaceProps {
  quiz: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ quiz, onAnswer, onNext }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setShowExplanation(true);
    onAnswer(idx === quiz.correctAnswerIndex);
  };

  const isCorrectChoice = selectedIdx === quiz.correctAnswerIndex;

  return (
    <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full py-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden transform hover:scale-[1.01] transition-transform">
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-4 right-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Single Selection</div>
          <h3 className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Question Content
          </h3>
          <div className="prose prose-invert max-w-none text-lg font-bold">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {quiz.question}
            </ReactMarkdown>
          </div>
        </div>

        <div className="p-8 space-y-4 bg-slate-50/30">
          <div className="grid grid-cols-1 gap-4">
            {quiz.options.map((option, idx) => {
              const isCorrect = idx === quiz.correctAnswerIndex;
              const isSelected = idx === selectedIdx;
              
              let buttonClass = "w-full text-left p-6 rounded-3xl border-4 transition-all font-black flex items-center justify-between group shadow-sm ";
              
              if (selectedIdx === null) {
                buttonClass += "border-slate-100 bg-white hover:border-indigo-500 hover:shadow-indigo-500/10 text-slate-700 active:scale-95";
              } else if (isCorrect) {
                // Always green if it is the correct answer after selection
                buttonClass += "border-green-500 bg-green-50 text-green-700 shadow-green-200/50 scale-[1.02]";
              } else if (isSelected && !isCorrect) {
                // Red only if selected and wrong
                buttonClass += "border-red-500 bg-red-50 text-red-700 animate-shake";
              } else {
                buttonClass += "border-transparent bg-white text-slate-300 opacity-40";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedIdx !== null}
                  className={buttonClass}
                >
                  <div className="prose prose-sm max-w-none text-inherit">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {option}
                    </ReactMarkdown>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {selectedIdx !== null && isCorrect && (
                      <div className="bg-green-500 text-white p-1 rounded-full shadow-lg shadow-green-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {isSelected && !isCorrect && (
                      <div className="bg-red-500 text-white p-1 rounded-full shadow-lg shadow-red-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={`mt-6 p-8 rounded-[2rem] border-2 animate-in slide-in-from-top-4 duration-500 shadow-xl ${
              isCorrectChoice ? 'bg-green-50 border-green-100 shadow-green-500/5' : 'bg-red-50 border-red-100 shadow-red-500/5'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-lg ${
                   isCorrectChoice ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {isCorrectChoice ? '✓' : '!'}
                </div>
                <h4 className={`text-sm font-black uppercase tracking-widest ${
                  isCorrectChoice ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrectChoice ? 'Brilliant Result! 👍' : 'The Learning Moment 🤝'}
                </h4>
              </div>
              <div className="prose prose-sm max-w-none text-slate-800 font-bold leading-relaxed mb-8">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {quiz.explanation}
                </ReactMarkdown>
              </div>
              <button
                onClick={onNext}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 group text-lg"
              >
                Next Challenge
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};
