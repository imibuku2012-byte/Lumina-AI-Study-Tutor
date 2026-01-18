
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { ChatInterface } from './components/ChatInterface';
import { QuizInterface } from './components/QuizInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { AppState, GradeLevel, Subject, Message, GroundingSource, QuizQuestion, Language, UserProfile, AdminSettings } from './types';
import { geminiTutor } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({ globalAnnouncement: '', aiModifier: '' });
  
  // Quiz specific state
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizStats, setQuizStats] = useState({ correct: 0, total: 0 });

  // Load admin settings from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lumina_admin_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setAdminSettings(settings);
      geminiTutor.setAdminSettings(settings);
    }
  }, []);

  const updateAdminSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    geminiTutor.setAdminSettings(newSettings);
    localStorage.setItem('lumina_admin_settings', JSON.stringify(newSettings));
  };

  const startSession = async (selectedGrade: GradeLevel, selectedSubject: Subject, topic: string, userProfile: UserProfile) => {
    setGrade(selectedGrade);
    setSubject(selectedSubject);
    setProfile(userProfile);
    setAppState(AppState.STUDYING);
    setIsTyping(true);

    // Record user login for GEO dashboard
    const userLogs = JSON.parse(localStorage.getItem('lumina_user_logs') || '[]');
    if (!userLogs.find((u: UserProfile) => u.email === userProfile.email)) {
      userLogs.push(userProfile);
      localStorage.setItem('lumina_user_logs', JSON.stringify(userLogs));
    }

    try {
      const stream = await geminiTutor.startNewSession(
        selectedGrade, 
        selectedSubject, 
        userProfile.language, 
        userProfile.country, 
        topic
      );
      
      let fullContent = '';
      let sources: GroundingSource[] = [];
      setMessages([{ role: 'model', content: '', timestamp: Date.now() }]);

      for await (const chunk of stream) {
        fullContent += chunk.text || '';
        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((c: any) => {
            if (c.web) {
              const newSource = { uri: c.web.uri, title: c.web.title };
              if (!sources.find(s => s.uri === newSource.uri)) sources.push(newSource);
            }
          });
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          if (lastIdx >= 0) {
            newMessages[lastIdx] = { ...newMessages[lastIdx], content: fullContent, sources: sources.length > 0 ? sources : undefined };
          }
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const startQuiz = async () => {
    if (!grade || !subject || !profile) return;
    setIsGeneratingQuiz(true);
    setAppState(AppState.QUIZZING);
    
    try {
      const context = messages.map(m => m.content).join('\n').slice(-3000);
      const quizPromise = geminiTutor.generateQuizQuestion(grade, subject, profile.language, context);
      const [quiz] = await Promise.all([quizPromise, new Promise(res => setTimeout(res, 5000))]);
      setCurrentQuiz(quiz);
    } catch (err) {
      setAppState(AppState.STUDYING);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;
    const lowerInput = inputValue.toLowerCase();
    if (lowerInput.includes('test') || lowerInput.includes('toets') || lowerInput.includes('quiz')) {
      setInputValue('');
      await startQuiz();
      return;
    }

    const userMessage: Message = { role: 'user', content: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const stream = await geminiTutor.sendMessage(userMessage.content);
      let fullContent = '';
      setMessages(prev => [...prev, { role: 'model', content: '', timestamp: Date.now() }]);
      for await (const chunk of stream) {
        fullContent += chunk.text || '';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullContent;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, startQuiz]);

  return (
    <Layout 
      headerTitle={appState === AppState.ONBOARDING ? "Lumina Study Tutor" : `${subject} Mentor`} 
      profile={profile}
      onReset={() => window.location.reload()}
      onOpenAdmin={() => setAppState(AppState.ADMIN_DASHBOARD)}
    >
      {adminSettings.globalAnnouncement && appState !== AppState.ONBOARDING && (
        <div className="bg-indigo-600 text-white py-2 overflow-hidden whitespace-nowrap sticky top-[73px] z-10 shadow-md">
          <div className="animate-marquee inline-block pl-[100%] font-black uppercase text-xs tracking-widest">
            {adminSettings.globalAnnouncement} • {adminSettings.globalAnnouncement} • {adminSettings.globalAnnouncement}
          </div>
        </div>
      )}

      {appState === AppState.ONBOARDING && (
        <Onboarding onStart={startSession} />
      )}
      
      {appState === AppState.ADMIN_DASHBOARD && (
        <AdminDashboard 
          settings={adminSettings}
          onUpdateSettings={updateAdminSettings}
          onClose={() => setAppState(AppState.STUDYING)}
        />
      )}

      {appState === AppState.STUDYING && (
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={startQuiz}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.427z" /></svg>
              Start Testing Me
            </button>
          </div>
          <ChatInterface 
            messages={messages}
            inputValue={inputValue}
            isTyping={isTyping}
            onInputChange={setInputValue}
            onSend={handleSendMessage}
          />
        </>
      )}

      {appState === AppState.QUIZZING && (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setAppState(AppState.STUDYING)} className="bg-white border px-4 py-2 rounded-xl text-slate-500 font-bold flex items-center gap-2">
              ← Back to Study
            </button>
            <div className="text-indigo-600 font-black">{quizStats.correct} / {quizStats.total} Correct</div>
          </div>
          {isGeneratingQuiz ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-slate-900 p-8 rounded-[3rem] text-center text-white border border-slate-700 animate-in zoom-in duration-300">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="font-black uppercase tracking-[0.2em] text-xs text-indigo-400 mb-2">Knowledge Core</p>
                <h3 className="text-xl font-bold">Generating Test...</h3>
              </div>
            </div>
          ) : (
            currentQuiz && <QuizInterface quiz={currentQuiz} onAnswer={(c) => setQuizStats(p => ({correct: p.correct + (c?1:0), total: p.total+1}))} onNext={startQuiz} />
          )}
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </Layout>
  );
};

export default App;
