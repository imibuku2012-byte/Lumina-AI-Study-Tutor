
import React, { useState, useEffect } from 'react';
import { GradeLevel, Subject, Language, UserProfile, AppState } from '../types';

interface OnboardingProps {
  onStart: (grade: GradeLevel, subject: Subject, topic: string, profile: UserProfile) => void;
}

const GRADES: GradeLevel[] = ['Grade 6-8', 'Grade 9-10', 'Grade 11-12', 'University'];
const SUBJECTS: Subject[] = [
  'Mathematics', 'Calculus', 'Physics', 'Chemistry', 'Biology',
  'History', 'Languages', 'Afrikaans', 'Computer Science', 'Economics', 'Other'
];
const COUNTRIES = ['South Africa', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Other'];

export const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [step, setStep] = useState<'AUTH' | 'PROFILE'>('AUTH');
  const [grade, setGrade] = useState<GradeLevel>('Grade 6-8');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('South Africa');
  const language: Language = 'English'; // Constant English teaching language

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setStep('PROFILE');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && name.trim()) {
      const isAdmin = email.toLowerCase() === 'imibuku2012@gmail.com';
      onStart(grade, subject, topic, {
        name,
        email,
        country,
        language,
        isAdmin
      });
    }
  };

  if (step === 'AUTH') {
    return (
      <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in duration-500 p-4">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-md w-full border border-slate-100 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black shadow-xl">L</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Welcome to Lumina</h2>
          <p className="text-slate-500 mb-10 font-medium italic">"Login to access your AI Tutor."</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Enter Your Google Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 hover:border-indigo-500 py-4 rounded-2xl transition-all shadow-sm hover:shadow-md group active:scale-95"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-black text-slate-700">Continue with Google</span>
            </button>
          </form>
          
          <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">Global Support 🌍</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-10 px-4 overflow-y-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl p-8 max-w-2xl w-full border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl">L</div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Setup Your Profile</h2>
            <p className="text-slate-500 text-sm font-medium">Lumina is ready for {email}.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Name"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold outline-none appearance-none"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Grade / Level</label>
              <select 
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold outline-none"
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-bold outline-none"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">What are you studying today?</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Fractions, Logic, History..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none font-black text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-xl active:scale-[0.98]"
          >
            Start Learning
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
