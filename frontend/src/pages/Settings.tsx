import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { MOCK_APPS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { connectedApps } = useAppContext();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'integrations'>('account');
  const [saved, setSaved] = useState(false);

  // Form states
  const [profile, setProfile] = useState({ name: 'Alex Johnson', email: 'alex@example.com' });
  const [prefs, setPrefs] = useState({ format: 'PNG', tone: 'Professional', aiAggressiveness: 'Medium' });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Settings</h1>
          <p className="text-[#666] text-sm font-light">Customize your Sinalytix experience.</p>
        </div>
        {saved && (
          <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            <CheckCircle2 className="w-4 h-4" /> SAVED
          </span>
        )}
      </header>

      <div className="bg-white rounded-2xl border border-[#EFEFEF] overflow-hidden">
         <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px]">
            {/* Sidebar nav inside settings */}
            <div className="border-r border-[#EFEFEF] bg-[#FBFBFB] p-6">
               <nav className="space-y-1">
                 <button 
                   onClick={() => setActiveTab('account')}
                   className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'account' ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#EFEFEF]' : 'text-[#666] hover:bg-neutral-100'}`}
                 >Account</button>
                 <button 
                   onClick={() => setActiveTab('preferences')}
                   className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'preferences' ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#EFEFEF]' : 'text-[#666] hover:bg-neutral-100'}`}
                 >Preferences</button>
                 <button 
                   onClick={() => setActiveTab('integrations')}
                   className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'integrations' ? 'bg-white text-[#1A1A1A] shadow-sm border border-[#EFEFEF]' : 'text-[#666] hover:bg-neutral-100'}`}
                 >Integrations</button>
               </nav>
            </div>
            
            {/* Content block */}
            <div className="col-span-3 p-8 md:p-12 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 {activeTab === 'account' && (
                   <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                     <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-8 pb-4 border-b border-[#F5F5F5]">Profile Configuration</h2>
                     <div className="space-y-6 max-w-md">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2 block">Full Name</label>
                          <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black text-[#1A1A1A]" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2 block">Email Address</label>
                          <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black text-[#1A1A1A]" />
                        </div>
                        <div className="pt-4">
                          <button onClick={handleSave} className="px-6 py-2 bg-black text-white text-xs font-bold rounded-lg tracking-wide">SAVE CHANGES</button>
                        </div>
                     </div>
                   </motion.div>
                 )}

                 {activeTab === 'preferences' && (
                   <motion.div key="preferences" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                     <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-8 pb-4 border-b border-[#F5F5F5]">Content Optimization Defaults</h2>
                     <div className="space-y-6 max-w-md">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2 block">Default Image Format</label>
                          <select value={prefs.format} onChange={(e) => setPrefs({...prefs, format: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black text-[#1A1A1A]">
                            <option value="PNG">High Quality (PNG)</option>
                            <option value="JPEG">Optimized (JPEG)</option>
                            <option value="WEBP">Web Performance (WEBP)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2 block">Default Description Tone</label>
                          <select value={prefs.tone} onChange={(e) => setPrefs({...prefs, tone: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black text-[#1A1A1A]">
                            <option value="Professional">Professional & Clean</option>
                            <option value="Casual">Casual & Approachable</option>
                            <option value="Energetic">Energetic & Hype</option>
                            <option value="Technical">Technical & Developer-focused</option>
                          </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2 block">AI Optimization Level</label>
                           <div className="flex gap-4">
                             {['Low', 'Medium', 'Aggressive'].map(level => (
                               <button 
                                 key={level}
                                 onClick={() => setPrefs({...prefs, aiAggressiveness: level})}
                                 className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${prefs.aiAggressiveness === level ? 'bg-black text-white border-black' : 'bg-white text-[#666] border-[#EFEFEF] hover:bg-neutral-50'}`}
                               >
                                 {level}
                               </button>
                             ))}
                           </div>
                           <p className="text-[10px] text-[#999] mt-2 italic">How much the AI should alter your original description.</p>
                        </div>
                        <div className="pt-4">
                          <button onClick={handleSave} className="px-6 py-2 bg-black text-white text-xs font-bold rounded-lg tracking-wide">SAVE PREFERENCES</button>
                        </div>
                     </div>
                   </motion.div>
                 )}

                 {activeTab === 'integrations' && (
                   <motion.div key="integrations" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                     <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-8 pb-4 border-b border-[#F5F5F5]">Connected Accounts</h2>
                     <div className="space-y-4">
                        {MOCK_APPS.filter(app => connectedApps.includes(app.id as any)).map(app => (
                           <div key={app.id} className="flex justify-between items-center p-4 rounded-xl border border-[#EFEFEF] bg-[#FBFBFB]">
                             <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-xl bg-white border border-[#EFEFEF] flex items-center justify-center font-bold text-sm ${app.color}`}>
                                 {app.name.charAt(0)}
                               </div>
                               <div>
                                  <h3 className="text-sm font-semibold text-[#1A1A1A]">{app.name}</h3>
                                  <p className="text-[10px] uppercase text-green-600 font-bold tracking-widest">Active Connection</p>
                               </div>
                             </div>
                             <button className="text-xs font-bold text-[#666] hover:text-black hover:bg-neutral-100 px-3 py-1.5 rounded transition-all">Manage</button>
                           </div>
                        ))}
                        {connectedApps.length === 0 && (
                          <div className="text-sm text-[#666]">No active connections. Go to the Apps section.</div>
                        )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
