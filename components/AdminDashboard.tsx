
import React, { useState, useEffect } from 'react';
import { UserProfile, AdminSettings } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, settings, onUpdateSettings }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('lumina_user_logs') || '[]');
    setUsers(savedUsers);
  }, []);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    alert('GEO Controls Updated Successfully');
  };

  const countries = Array.from(new Set(users.map(u => u.country)));

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[85vh] custom-scrollbar">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-50 py-2 z-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">GEO Control Center</h2>
          <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em] mt-1">imibuku2012@gmail.com Logged In</p>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all transform active:scale-95"
        >
          Exit GEO Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></span>
              Platform Overrides
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">App-Wide Announcement</label>
                <input 
                  type="text"
                  value={localSettings.globalAnnouncement}
                  onChange={(e) => setLocalSettings({...localSettings, globalAnnouncement: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:border-indigo-500 transition-all text-slate-700"
                  placeholder="Broadcast a message to all active users..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Core AI Behavior Modifier</label>
                <textarea 
                  rows={4}
                  value={localSettings.aiModifier}
                  onChange={(e) => setLocalSettings({...localSettings, aiModifier: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 font-bold outline-none focus:border-indigo-500 transition-all text-slate-700 resize-none"
                  placeholder="Inject custom instructions into Lumina's personality... e.g. 'Focus heavily on South African history examples'"
                />
              </div>
              <button 
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
              >
                Sync GEO Controls
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Active Userbase Logs
              </h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                Real-time Data
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Student</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Email</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">GEO Location</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 text-center">Lang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-bold italic">No learning sessions captured in GEO database yet.</td></tr>
                  ) : (
                    users.map((u, i) => (
                      <tr key={i} className="group hover:bg-indigo-50/30 transition-all">
                        <td className="py-4 px-2 font-bold text-slate-900">{u.name}</td>
                        <td className="py-4 px-2 text-slate-500 font-medium text-xs">{u.email}</td>
                        <td className="py-4 px-2">
                           <span className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                             <span className="text-lg">{u.country === 'South Africa' ? '🇿🇦' : '🌍'}</span>
                             {u.country}
                           </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${u.language === 'Afrikaans' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.language}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white border border-slate-800">
            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">GEO Analytics</h3>
            <div className="space-y-8">
              <div className="flex flex-col">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Global Reach</span>
                <span className="text-4xl font-black mt-1">{users.length} <span className="text-sm font-medium text-indigo-400">Users</span></span>
              </div>
              <div className="h-px bg-slate-800 w-full"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-3xl">
                  <span className="text-slate-500 text-[9px] font-black uppercase">RSA Impact</span>
                  <p className="text-2xl font-black">{users.filter(u => u.country === 'South Africa').length}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-3xl">
                  <span className="text-slate-500 text-[9px] font-black uppercase">Afrikaans</span>
                  <p className="text-2xl font-black">{users.filter(u => u.language === 'Afrikaans').length}</p>
                </div>
              </div>
              <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-[2rem]">
                <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-indigo-300">Geo Distribution</h4>
                <div className="space-y-3">
                  {countries.slice(0, 3).map(c => {
                    const count = users.filter(u => u.country === c).length;
                    const pct = Math.round((count / users.length) * 100);
                    return (
                      <div key={c} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{c}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <p className="font-black uppercase tracking-widest text-[10px] mb-3 opacity-80">GEO Executive Brief</p>
             <p className="text-sm font-medium leading-relaxed">
               As the <span className="font-black underline decoration-2 underline-offset-4">GEO</span> of Lumina, you have complete control over the AI's core logic and platform messaging. Your changes affect all users globally in real-time.
             </p>
             <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-3">
               <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">👤</div>
               <div>
                 <p className="text-xs font-black">Admin Active</p>
                 <p className="text-[9px] font-bold opacity-60 italic">Session: Secure & Encrypted</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
