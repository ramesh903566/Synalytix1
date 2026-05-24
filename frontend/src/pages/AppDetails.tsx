import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS, MOCK_ACCOUNTS } from '../data/mockData';
import { ArrowLeft, Plus, Heart, MessageCircle, Send, Bookmark, X, Eye, Activity, UserPlus, Info } from 'lucide-react';

export default function AppDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { connectedApps, connectApp, disconnectApp } = useAppContext();
  
  const appInfo = MOCK_APPS.find(a => a.id === id);
  const isConnected = connectedApps.includes(id as any);
  
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const EMPTY_ARRAY: any[] = [];
  const accounts = id ? (MOCK_ACCOUNTS[id as string] || EMPTY_ARRAY) : EMPTY_ARRAY;

  useEffect(() => {
    // If connected, auto select first account for the 'story view'
    if (isConnected && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [isConnected, accounts, selectedAccount]);

  if (!appInfo) return <div>App not found</div>;

  // MOCK CONNECTION HANDLER
  const handleConnect = () => {
    // In real app, this redirects to OAuth
    connectApp(id as any);
  };

  if (!isConnected) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center mt-20">
         <div className={`w-20 h-20 mx-auto rounded-3xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm font-semibold text-3xl mb-8 ${appInfo.color}`}>
            {appInfo.name.charAt(0)}
         </div>
         <h1 className="text-3xl font-semibold tracking-tight mb-4">Connect {appInfo.name}</h1>
         <p className="text-zinc-500 font-light mb-10 leading-relaxed max-w-lg mx-auto">
           Authorized access will allow Sinalytix to publish posts on your behalf, retrieve engagement analytics, and help AI optimize your content for {appInfo.name}.
         </p>
         
         <div className="flex gap-4 justify-center">
            <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-full font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleConnect} className="px-6 py-3 rounded-full font-medium text-white bg-black hover:bg-zinc-800 transition-colors">
              Authorize Application
            </button>
         </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <button 
        onClick={() => navigate('/app/apps')} 
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors width-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>

      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
           <div className={`w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm font-semibold text-2xl ${appInfo.color}`}>
              {appInfo.name.charAt(0)}
           </div>
           <div>
             <h1 className="text-3xl font-semibold tracking-tight">{appInfo.name} Workspace</h1>
             <p className="text-zinc-500 font-light">Manage accounts and platform-specific analytics.</p>
           </div>
        </div>
      </div>

      {/* Story-style Account Selector */}
      <div className="mb-12">
         <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400 mb-4">Active Accounts</h3>
         <div className="flex gap-6 overflow-x-auto pb-4">
            {accounts.map((acc: any) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className="flex flex-col items-center gap-3 w-20 flex-shrink-0"
              >
                <div className={`w-16 h-16 rounded-full p-1 transition-all ${selectedAccount?.id === acc.id ? 'border-2 border-black' : 'border border-transparent hover:border-zinc-300'}`}>
                   <img src={acc.avatarUrl} alt={acc.username} className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-xs font-medium truncate w-full text-center" title={acc.username}>
                  {acc.username}
                </span>
              </button>
            ))}
            <button className="flex flex-col items-center gap-3 w-20 flex-shrink-0 group">
               <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:border-black transition-colors bg-white">
                 <Plus className="w-6 h-6" />
               </div>
                <span className="text-xs font-medium text-zinc-400 group-hover:text-black transition-colors">Add</span>
            </button>
         </div>
      </div>

      {/* Selected Account Analytics & Posts */}
      {selectedAccount && (
        <>
          {appInfo.id === 'github' ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold mb-2">Popular repositories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'ramesh988025', desc: 'Config files for my GitHub profile.', lang: 'HTML', color: 'bg-orange-500' },
                  { name: 'Portfolio', desc: 'About me', lang: 'HTML', color: 'bg-orange-500' },
                  { name: 'Landing-page', desc: 'This my First Landing page for freelancing', lang: 'HTML', color: 'bg-orange-500' },
                  { name: 'HOROLOGIUM-', desc: 'Details of the watch brands', lang: 'JavaScript', color: 'bg-yellow-400' },
                  { name: 'Churn-Predection-System-', desc: 'Production-ready ML system that predicts customer churn...', lang: 'Python', color: 'bg-blue-500' },
                  { name: 'Stock-Pro', desc: '', lang: 'HTML', color: 'bg-orange-500' }
                ].map(repo => (
                  <div key={repo.name} className="border border-[#EFEFEF] rounded-xl p-5 bg-white flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[#0969DA] font-semibold hover:underline cursor-pointer">{repo.name}</h3>
                      <span className="text-[10px] border border-neutral-200 px-2 py-0.5 rounded-full text-neutral-500 font-semibold">Public</span>
                    </div>
                    {repo.desc && <p className="text-xs text-[#666] line-clamp-2">{repo.desc}</p>}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                       <span className={`w-3 h-3 rounded-full ${repo.color}`}></span>
                       <span className="text-[10px] text-neutral-500 font-medium">{repo.lang}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-[#EFEFEF] rounded-xl p-6 bg-white mt-4">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-lg font-medium">89 contributions in the last year</h2>
                   <div className="text-sm font-medium text-neutral-500 border border-neutral-200 px-3 py-1 rounded-lg">Contribution settings ▾</div>
                 </div>
                 <div className="w-full flex-col flex gap-2">
                   {/* Heatmap mockup */}
                   <div className="w-full h-32 bg-[#F5F5F5] rounded-xl flex items-center justify-center border border-neutral-100">
                      <div className="flex gap-1 overflow-x-hidden p-2 opacity-50">
                        {Array.from({length: 40}).map((_, col) => (
                           <div key={col} className="flex flex-col gap-1">
                              {Array.from({length: 7}).map((_, row) => {
                                const isFilled = Math.random() > 0.8;
                                const isDark = Math.random() > 0.95;
                                return (
                                  <div key={row} className={`w-3 h-3 rounded-[2px] ${isDark ? 'bg-green-600' : isFilled ? 'bg-green-300' : 'bg-neutral-200'}`} />
                                )
                              })}
                           </div>
                        ))}
                      </div>
                   </div>
                   <div className="flex justify-between text-xs text-neutral-500 px-2">
                      <span>Learn how we count contributions</span>
                      <div className="flex items-center gap-2">
                        <span>Less</span>
                        <div className="flex gap-1"><div className="w-3 h-3 bg-neutral-200"/><div className="w-3 h-3 bg-green-200"/><div className="w-3 h-3 bg-green-300"/><div className="w-3 h-3 bg-green-500"/><div className="w-3 h-3 bg-green-700"/></div>
                        <span>More</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          ) : appInfo.id === 'leetcode' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="col-span-2">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold">Practice History</h2>
                     <button className="text-xs font-medium border border-neutral-200 px-3 py-1.5 rounded-lg flex items-center gap-1"><Activity className="w-3 h-3"/> Filter</button>
                  </div>
                  <div className="bg-white border text-sm border-[#EFEFEF] rounded-xl overflow-hidden">
                     <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#F5F5F5] text-xs font-semibold text-neutral-500 uppercase">
                        <div className="col-span-3">Last Submitted ▾</div>
                        <div className="col-span-5">Problem ▾</div>
                        <div className="col-span-2">Last Result</div>
                        <div className="col-span-2">Submissions ▾</div>
                     </div>
                     {[
                       { date: '2025.12.16', title: '352. Data Stream as Disjoint Intervals', diff: 'Hard', result: 'Wrong Answer', subs: 1, pass: false },
                       { date: '2025.12.16', title: '382. Linked List Random Node', diff: 'Med.', result: 'Accepted', subs: 1, pass: true },
                       { date: '2025.12.16', title: '460. LFU Cache', diff: 'Hard', result: 'Accepted', subs: 3, pass: true },
                       { date: '2025.12.16', title: '685. Redundant Connection II', diff: 'Hard', result: 'Accepted', subs: 1, pass: true },
                       { date: '2025.12.16', title: '42. Trapping Rain Water', diff: 'Hard', result: 'Accepted', subs: 1, pass: true },
                     ].map((item, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-[#F5F5F5] last:border-0 hover:bg-neutral-50 transition-colors">
                           <div className="col-span-3 text-neutral-500">{item.date}</div>
                           <div className="col-span-5">
                             <div className="font-semibold text-[#1A1A1A] truncate">{item.title}</div>
                             <div className={`text-[10px] font-bold ${item.diff === 'Hard' ? 'text-red-500' : 'text-yellow-500'}`}>{item.diff}</div>
                           </div>
                           <div className={`col-span-2 font-medium ${item.pass ? 'text-green-600' : 'text-red-500'}`}>{item.result}</div>
                           <div className="col-span-2 flex justify-between">{item.subs} <ArrowLeft className="w-4 h-4 rotate-[-90deg] opacity-40"/></div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="col-span-1 flex flex-col gap-4">
                  <h2 className="text-xl font-semibold mb-0">Summary</h2>
                  <div className="bg-white border border-[#EFEFEF] rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                       <div>
                         <div className="text-sm text-neutral-500 font-medium mb-1">Total Solved</div>
                         <div className="text-3xl font-bold text-[#1A1A1A]"><span className="text-blue-500">28</span> <span className="text-sm font-medium text-neutral-400">Problems</span></div>
                       </div>
                       <div className="text-xs font-semibold bg-neutral-100 rounded px-2 py-1">👏 Beats 42.2%</div>
                    </div>
                    <div className="flex justify-between gap-2">
                       <div className="flex-1 bg-green-50 text-green-700 text-center rounded-md py-1 text-xs font-bold">Easy <span className="text-black">10</span></div>
                       <div className="flex-1 bg-yellow-50 text-yellow-700 text-center rounded-md py-1 text-xs font-bold">Med. <span className="text-black">10</span></div>
                       <div className="flex-1 bg-red-50 text-red-700 text-center rounded-md py-1 text-xs font-bold">Hard <span className="text-black">8</span></div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 bg-white border border-[#EFEFEF] rounded-xl p-4">
                       <div className="text-xs text-neutral-500 mb-1">Submissions</div>
                       <div className="text-2xl font-bold text-fuchsia-600">37</div>
                     </div>
                     <div className="flex-1 bg-white border border-[#EFEFEF] rounded-xl p-4">
                       <div className="text-xs text-neutral-500 mb-1">Acceptance</div>
                       <div className="text-2xl font-bold text-green-500">94.6<span className="text-sm">%</span></div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#EFEFEF] p-8">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#F5F5F5]">
                  <img src={selectedAccount.avatarUrl} className="w-12 h-12 rounded-full" alt="" />
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">{selectedAccount.username}</div>
                    <div className="text-[10px] text-[#666] font-bold uppercase tracking-widest">{selectedAccount.type} Account</div>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-[#FBFBFB] border border-[#EFEFEF] rounded-xl p-6">
                    <div className="text-[10px] text-[#999] uppercase tracking-widest font-bold mb-2">Followers / Audience</div>
                    <div className="text-3xl font-light text-[#1A1A1A]">14.2K</div>
                  </div>
                  <div className="bg-[#FBFBFB] border border-[#EFEFEF] rounded-xl p-6">
                    <div className="text-[10px] text-[#999] uppercase tracking-widest font-bold mb-2">Monthly Reach</div>
                    <div className="text-3xl font-light text-[#1A1A1A]">89.4K</div>
                  </div>
                  <div className="bg-[#FBFBFB] border border-[#EFEFEF] rounded-xl p-6">
                    <div className="text-[10px] text-[#999] uppercase tracking-widest font-bold mb-2">Avg. Engagement Rate</div>
                    <div className="text-3xl font-light text-[#1A1A1A]">4.8%</div>
                  </div>
              </div>

              <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} onClick={() => setSelectedPost(i)} className="p-4 border border-[#EFEFEF] bg-[#FBFBFB] rounded-xl hover:bg-neutral-50 cursor-pointer flex justify-between items-center transition-colors">
                          <span className="font-medium text-[#1A1A1A] text-xs">Post insight overview for campaign {i}</span>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#999]">VIEW DETAILS</span>
                        </div>
                    ))}
                  </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Post Insights Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={() => setSelectedPost(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full ${appInfo.id === 'x' ? 'max-w-xl' : 'max-w-sm max-h-[85vh]'} bg-[#0A0A0A] ${appInfo.id === 'x' ? 'rounded-2xl' : 'rounded-[32px] overflow-y-auto hide-scrollbar'} overflow-hidden flex flex-col text-white shadow-2xl`}
            >
              <div className={`sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md z-10 px-6 py-4 flex items-center gap-4 ${appInfo.id === 'x' ? '' : 'border-b border-white/10'}`}>
                 {appInfo.id === 'x' ? (
                   <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2"><X className="w-5 h-5"/></button>
                 ) : (
                   <button onClick={() => setSelectedPost(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><ArrowLeft className="w-5 h-5"/></button>
                 )}
                 <h2 className="text-xl font-bold tracking-tight text-white">{appInfo.id === 'x' ? 'Post Analytics' : 'Post insights'}</h2>
              </div>
              
              {appInfo.id === 'x' ? (
                 <div className="p-6 pt-2 flex flex-col gap-4 bg-[#0A0A0A]">
                    <div className="border border-white/10 rounded-xl p-4 flex gap-4">
                        <img src={selectedAccount.avatarUrl} className="w-10 h-10 rounded-full" alt="avatar" />
                        <div>
                           <div className="flex gap-2 text-sm text-zinc-400 mb-2">
                             <span className="font-bold text-white">ramesh</span>
                             <span>@ramesh903566</span>
                             <span>·</span>
                             <span>May 20</span>
                           </div>
                           <p className="text-[15px] leading-snug mb-3">
                             Building Synalytix 🚀<br/><br/>
                             AI-powered dashboard for developers & creators to track coding, productivity, social growth, and creator analytics in one place....
                           </p>
                        </div>
                    </div>
                    
                    <div className="border border-white/10 rounded-xl p-6 flex justify-around items-center">
                        <div className="flex flex-col items-center gap-2"><Heart className="w-6 h-6 text-zinc-500" /><span className="text-xl font-bold">0</span></div>
                        <div className="flex flex-col items-center gap-2"><Activity className="w-6 h-6 text-zinc-500" /><span className="text-xl font-bold">0</span></div>
                        <div className="flex flex-col items-center gap-2"><MessageCircle className="w-6 h-6 text-zinc-500" /><span className="text-xl font-bold">0</span></div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 p-4">
                       <div className="flex flex-col gap-1">
                          <span className="text-sm text-zinc-400 flex items-center gap-1">Impressions <Info className="w-3.5 h-3.5" /></span>
                          <span className="text-3xl font-bold">2</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-sm text-zinc-400 flex items-center gap-1">Engagements <Info className="w-3.5 h-3.5" /></span>
                          <span className="text-3xl font-bold">0</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-sm text-zinc-400 flex items-center gap-1">Detail expands <Info className="w-3.5 h-3.5" /></span>
                          <span className="text-3xl font-bold">0</span>
                       </div>
                       <div className="flex flex-col gap-1 mt-4">
                          <span className="text-sm text-zinc-400 flex items-center gap-1">Profile visits <Info className="w-3.5 h-3.5" /></span>
                          <span className="text-3xl font-bold">0</span>
                       </div>
                    </div>
                 </div>
              ) : (
                <div className="p-6 pt-2 flex flex-col gap-6">
                  <div className="flex flex-col items-center border-b border-white/10 pb-6">
                     <div className="w-32 h-40 bg-zinc-800 rounded-xl mb-4 overflow-hidden">
                       <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50" />
                     </div>
                     <span className="text-zinc-400 text-sm mb-6">April 18 at 10:00 PM</span>
                     
                     <div className="flex w-full justify-between px-6 text-white text-center">
                       <div className="flex flex-col items-center gap-2"><Heart className="w-6 h-6" /><span className="text-sm font-semibold">248</span></div>
                       <div className="flex flex-col items-center gap-2"><MessageCircle className="w-6 h-6" /><span className="text-sm font-semibold">10</span></div>
                       <div className="flex flex-col items-center gap-2"><Send className="w-6 h-6" /><span className="text-sm font-semibold">40</span></div>
                       <div className="flex flex-col items-center gap-2"><Activity className="w-6 h-6" /><span className="text-sm font-semibold">0</span></div>
                       <div className="flex flex-col items-center gap-2"><Bookmark className="w-6 h-6" /><span className="text-sm font-semibold">4</span></div>
                     </div>
                  </div>
  
                  <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
                     <h3 className="text-lg font-semibold flex items-center gap-2">Overview <Info className="w-4 h-4 text-zinc-500" /></h3>
                     <div className="flex flex-col gap-4">
                       <div className="flex justify-between items-center"><span className="text-zinc-300">Views</span><span className="font-semibold text-lg">9,948</span></div>
                       <div className="flex justify-between items-center"><span className="text-zinc-300">Interactions</span><span className="font-semibold text-lg">302</span></div>
                       <div className="flex justify-between items-center"><span className="text-zinc-300">Profile activity</span><span className="font-semibold text-lg">93</span></div>
                     </div>
                  </div>
  
                  <div className="flex flex-col gap-6 pb-6 border-b border-white/10">
                     <h3 className="text-lg font-semibold flex items-center gap-2">Views <Info className="w-4 h-4 text-zinc-500" /></h3>
                     <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
                       {/* Simplified doughnut chart SVG */}
                       <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                         <circle cx="50" cy="50" r="45" fill="transparent" stroke="#2A2A2A" strokeWidth="8"/>
                         <circle cx="50" cy="50" r="45" fill="transparent" stroke="url(#viewGradient)" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="80"/>
                         <defs>
                           <linearGradient id="viewGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#d946ef" />
                             <stop offset="100%" stopColor="#8b5cf6" />
                           </linearGradient>
                         </defs>
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-sm text-zinc-400">Views</span>
                         <span className="text-3xl font-bold">9,948</span>
                       </div>
                     </div>
                     
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-fuchsia-500"/> <span className="text-zinc-300 text-sm">Followers</span></div><span className="text-sm">30.2%</span></div>
                       <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500"/> <span className="text-zinc-300 text-sm">Non-followers</span></div><span className="text-sm">69.8%</span></div>
                     </div>
  
                     <div className="mt-4">
                       <h4 className="font-medium text-sm mb-4">Top sources of views</h4>
                       <div className="flex flex-col gap-4">
                         <div>
                           <div className="flex justify-between text-sm text-zinc-300 mb-1"><span>Stories</span><span>68.5%</span></div>
                           <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden"><div className="bg-fuchsia-500 h-full rounded-full" style={{width: '68.5%'}}/></div>
                         </div>
                         <div>
                           <div className="flex justify-between text-sm text-zinc-300 mb-1"><span>Feed</span><span>18.9%</span></div>
                           <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden"><div className="bg-fuchsia-500 h-full rounded-full" style={{width: '18.9%'}}/></div>
                         </div>
                         <div>
                           <div className="flex justify-between text-sm text-zinc-300 mb-1"><span>Profile</span><span>10.6%</span></div>
                           <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden"><div className="bg-fuchsia-500 h-full rounded-full" style={{width: '10.6%'}}/></div>
                         </div>
                       </div>
                     </div>
                  </div>
  
                  <div className="flex flex-col gap-6">
                     <h3 className="text-lg font-semibold flex items-center gap-2">Audience <Info className="w-4 h-4 text-zinc-500" /></h3>
                     <div className="flex gap-2">
                       <div className="px-4 py-1.5 rounded-full bg-[#2A2A2A] text-sm text-white font-medium">Gender</div>
                       <div className="px-4 py-1.5 rounded-full text-zinc-400 text-sm">Country</div>
                       <div className="px-4 py-1.5 rounded-full text-zinc-400 text-sm">Age</div>
                     </div>
                     
                     <div className="flex flex-col gap-4 mt-2">
                        <div>
                           <div className="flex justify-between text-sm text-zinc-300 mb-1"><span>Men</span><span>77.5%</span></div>
                           <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden"><div className="bg-fuchsia-500 h-full rounded-full" style={{width: '77.5%'}}/></div>
                         </div>
                         <div>
                           <div className="flex justify-between text-sm text-zinc-300 mb-1"><span>Women</span><span>22.5%</span></div>
                           <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden"><div className="bg-violet-500 h-full rounded-full" style={{width: '22.5%'}}/></div>
                         </div>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
