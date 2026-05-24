import { ArrowUpRight, Users, MessageSquare, Eye, Activity, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_POSTS } from '../data/mockData';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { connectedApps, scheduledPosts, savedDrafts } = useAppContext();

  const stats = [
    { label: 'Published Posts', value: '142', change: '+12', icon: Users },
    { label: 'Saved Drafts', value: savedDrafts.length.toString(), change: 'Tasks in process', icon: Eye },
    { label: 'Scheduled', value: scheduledPosts.length.toString(), change: 'Open Task', icon: MessageSquare },
  ];

  const weeklyData = [
    { name: '13', val: 20 },
    { name: '14', val: 40 },
    { name: '15', val: 80 },
    { name: '16', val: 60 },
    { name: '17', val: 90 },
    { name: '18', val: 70 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <header className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Dashboard Overview</h1>
        <p className="text-[#666] text-sm font-light">Here is a summary of your linked application activities.</p>
      </header>

      {/* High level stats matching theme overall summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-[#EFEFEF] p-6 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex justify-between items-start mb-6">
               <h3 className="text-[10px] font-semibold text-[#1A1A1A] uppercase tracking-widest">{stat.label}</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="text-[10px] text-[#666] mt-1 font-bold uppercase tracking-widest">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="col-span-2 bg-white rounded-2xl border border-[#EFEFEF] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]">Weekly Progress</h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} dy={10} />
                <Tooltip cursor={{ stroke: '#F5F5F5', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: '1px solid #EFEFEF', fontSize: '12px' }}/>
                <Line type="monotone" dataKey="val" stroke="#1A1A1A" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-2xl border border-[#EFEFEF] p-6 flex flex-col items-center justify-center">
           <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] w-full text-left mb-6">Month Goals</h3>
           
           <div className="relative w-36 h-36 flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
               <circle cx="50" cy="50" r="45" fill="transparent" stroke="#F5F5F5" strokeWidth="8"/>
               <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1A1A1A" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="50"/>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-bold text-[#1A1A1A]">82%</span>
             </div>
           </div>
           
           <p className="text-xs text-[#666] text-center mt-6">Consistency goal: Post 5 times a week.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <div className="col-span-2 flex flex-col gap-6">
          <h2 className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-2 uppercase tracking-widest">Recent Posts Performance</h2>
          <div className="bg-white rounded-2xl border border-[#EFEFEF] overflow-hidden flex-1">
            <div className="divide-y divide-[#F5F5F5]">
              {MOCK_POSTS.map(post => (
                <div key={post.id} className="p-6 hover:bg-neutral-50 transition-colors group cursor-pointer border-b border-[#F5F5F5] last:border-0">
                  <div className="text-sm font-medium text-[#1A1A1A] mb-2 group-hover:text-black line-clamp-1">{post.content}</div>
                  <div className="flex gap-6 text-xs text-[#666] font-light">
                    <span className="flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3" /> {post.likes} Likes</span>
                    <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> {post.comments} Comments</span>
                    <span className="text-neutral-300">•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status widget */}
        <div className="col-span-1 flex flex-col gap-6">
           <h2 className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-2 uppercase tracking-widest">Network Health</h2>
           <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 space-y-4 flex-1">
             {connectedApps.length === 0 ? (
               <div className="text-xs text-[#666] text-center py-8">
                 No apps connected. Go to the Apps section to connect.
               </div>
             ) : (
               connectedApps.map(app => (
                 <div key={app} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-[#1A1A1A]">{app}</span>
                    <span className="text-green-700 bg-green-100/50 px-2.5 py-1 rounded border border-green-200/50 font-bold uppercase text-[9px]">Active</span>
                 </div>
               ))
             )}
             <button className="w-full py-3 mt-4 text-[10px] font-bold text-neutral-400 hover:text-black border border-neutral-200 rounded-lg transition-all">
               MANAGE CONNECTIONS
             </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
