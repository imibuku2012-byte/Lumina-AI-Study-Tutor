
import React from 'react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  profile?: UserProfile | null;
  onReset?: () => void;
  onOpenAdmin?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, headerTitle, profile, onReset, onOpenAdmin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-indigo-200 shadow-lg">L</div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">{headerTitle}</h1>
            {profile && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">🇿🇦 {profile.country} • {profile.name}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {profile?.isAdmin && onOpenAdmin && (
            <button 
              onClick={onOpenAdmin}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg hover:bg-indigo-600"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
              GEO Dashboard
            </button>
          )}
          {onReset && (
            <button onClick={onReset} className="text-slate-400 hover:text-indigo-600 transition-all p-2 bg-slate-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" /></svg>
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
        Lumina Core System • Optimized for South African Curriculum
      </footer>
    </div>
  );
};
