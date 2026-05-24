import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, Info, Users, Activity, Target } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', engagement: 4000, reach: 2400 },
  { name: 'Tue', engagement: 3000, reach: 1398 },
  { name: 'Wed', engagement: 2000, reach: 9800 },
  { name: 'Thu', engagement: 2780, reach: 3908 },
  { name: 'Fri', engagement: 1890, reach: 4800 },
  { name: 'Sat', engagement: 2390, reach: 3800 },
  { name: 'Sun', engagement: 3490, reach: 4300 },
];

const mockPieData = [
  { name: 'Photos', value: 400 },
  { name: 'Videos', value: 300 },
  { name: 'Links', value: 300 },
  { name: 'Text', value: 200 },
];
const COLORS = ['#1A1A1A', '#666', '#999', '#EFEFEF'];

export default function Analytics() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <header className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Overall Analytics & Intelligence</h1>
        <p className="text-[#666] text-sm font-light">Cross-platform performance and AI-driven growth insights.</p>
      </header>

      {/* AI Insights Banner & Trends */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 mb-10">
           <h3 className="text-xs font-semibold mb-6 flex items-center gap-2 uppercase tracking-widest text-[#1A1A1A]">
             <Sparkles className="w-3 h-3 text-orange-500" />
             AI Trend Identification & Recommendations
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-orange-50 border border-orange-100 rounded-xl flex flex-col gap-2">
                 <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-1">
                   <Target className="w-4 h-4 text-orange-600" />
                 </div>
                 <p className="text-xs font-bold text-orange-900">Optimal Posting Times</p>
                 <p className="text-[11px] text-orange-700 leading-relaxed">
                   Analysis shows your audience engagement across LinkedIn and X peaks sharply at <strong>8:45 AM EST on Tuesdays and Thursdays</strong>. Staging important technical deep-dives for these windows could boost reach by ~35%.
                 </p>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-2">
                 <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
                   <Activity className="w-4 h-4 text-blue-600" />
                 </div>
                 <p className="text-xs font-bold text-blue-900">Emerging Content Trend</p>
                 <p className="text-[11px] text-blue-700 leading-relaxed">
                   Your text-heavy, instructional posts ("How-To" style) are overperforming image-based content by <strong>42%</strong>. We recommend increasing step-by-step tutorial content to capitalize on this format shift.
                 </p>
              </div>

              <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl flex flex-col gap-2">
                 <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-1">
                   <Users className="w-4 h-4 text-purple-600" />
                 </div>
                 <p className="text-xs font-bold text-purple-900">Audience Sentiment</p>
                 <p className="text-[11px] text-purple-700 leading-relaxed">
                   Comments from the past 7 days show a strong positive reaction to open-source contributions. Recommendation: Use the AI Studio to rewrite your next release note into a multi-platform thread.
                 </p>
              </div>
           </div>
           
           <div className="mt-6 flex justify-end">
             <button className="px-5 py-2.5 text-[10px] font-bold text-white bg-black border border-black rounded-lg transition-all hover:bg-neutral-800">APPLY AI RECOMMENDATIONS TO STUDIO</button>
           </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-8 mb-10">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]">Aggregated Engagement</h3>
           <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#666] bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
             <TrendingUp className="w-3 h-3" /> Past 7 Days
           </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #EFEFEF', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: '12px' }}
                cursor={{ stroke: '#F5F5F5', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="engagement" stroke="#1A1A1A" fill="#1A1A1A" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="reach" stroke="#999" fill="#EFEFEF" fillOpacity={0.5} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h3 className="text-xs font-semibold mb-6 uppercase tracking-widest text-[#1A1A1A]">Engagement by Content Type</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EFEFEF', fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
               {mockPieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#666]">
                     <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                     {entry.name}
                  </div>
               ))}
            </div>
         </div>
         
         <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h3 className="text-xs font-semibold mb-6 uppercase tracking-widest text-[#1A1A1A]">Performance History</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 10}} dy={10} />
                  <Tooltip cursor={{ fill: '#FBFBFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid #EFEFEF', fontSize: '12px' }}/>
                  <Bar dataKey="engagement" fill="#1A1A1A" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
