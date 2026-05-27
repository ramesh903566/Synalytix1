import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, TrendingUp, Target, Activity, Users, ChevronDown } from 'lucide-react';
import { IG_OVERVIEW, IG_AUDIENCE, IG_CONTENT_POSTS } from '../data/mockData';

type InsightsTab = 'overview' | 'content' | 'audience';
type ContentSort = 'Views' | 'Accounts reached' | 'Follows' | 'Likes' | 'Comments' | 'Reposts' | 'Shares' | 'Saves';

const SORT_KEYS: Record<ContentSort, keyof typeof IG_CONTENT_POSTS[0]> = {
  'Views': 'views', 'Accounts reached': 'accountsReached', 'Follows': 'follows',
  'Likes': 'likes', 'Comments': 'comments', 'Reposts': 'reposts', 'Shares': 'shares', 'Saves': 'saves',
};

const contentSorts: ContentSort[] = ['Views', 'Accounts reached', 'Follows', 'Likes', 'Comments', 'Reposts', 'Shares', 'Saves'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<InsightsTab>('overview');
  const [contentSort, setContentSort] = useState<ContentSort>('Views');
  const [audienceSegment, setAudienceSegment] = useState<'overall' | 'follows' | 'unfollows'>('overall');
  const [locationView, setLocationView] = useState<'Countries' | 'Towns/cities'>('Countries');
  const [activeDay, setActiveDay] = useState('Su');

  const sortedContent = [...IG_CONTENT_POSTS].sort((a, b) => {
    const key = SORT_KEYS[contentSort];
    return (b[key] as number) - (a[key] as number);
  });

  const days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Analytics & Insights</h1>
        <p className="text-[#666] text-sm font-light">Instagram insights • All content • 30 days</p>
      </header>

      {/* AI Banner */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
        <h3 className="text-xs font-semibold mb-5 flex items-center gap-2 uppercase tracking-widest text-[#1A1A1A]">
          <Sparkles className="w-3 h-3 text-orange-500" />
          AI Trend Identification & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-orange-50 border border-orange-100 rounded-xl flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xs font-bold text-orange-900">Optimal Posting Window</p>
            <p className="text-[11px] text-orange-700 leading-relaxed">
              Your followers are most active <strong>Mon–Wed 18–21 IST</strong>. Scheduling your next reel in this window could boost reach by ~35%.
            </p>
          </div>
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-blue-900">Reels vs Posts</p>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Reels drive <strong>9x more views</strong> than static posts (36K vs 3.8K). Shift content mix to 70% Reels to capitalize on algorithm boost.
            </p>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs font-bold text-purple-900">Audience Growth</p>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              57.6% of your views come from <strong>non-followers</strong>. Your "NAM HORI" reel alone generated 4 new follows. More viral-style content = faster follower growth.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="px-5 py-2.5 text-[10px] font-bold text-white bg-black border border-black rounded-lg transition-all hover:bg-neutral-800">
            APPLY AI RECOMMENDATIONS TO STUDIO
          </button>
        </div>
      </div>

      {/* Instagram Insights — Overview / Content / Audience Tabs */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl overflow-hidden">
        {/* Tab Header */}
        <div className="border-b border-[#F5F5F5] flex">
          {(['overview', 'content', 'audience'] as InsightsTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? 'text-[#1A1A1A]' : 'text-[#999] hover:text-[#666]'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-8">
            {/* Metric Cards */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {[
                { label: 'Views', value: IG_OVERVIEW.allContent.views.toLocaleString(), selected: true },
                { label: 'Net followers', value: `+${IG_OVERVIEW.allContent.netFollowers}`, selected: false },
                { label: 'Interactions', value: IG_OVERVIEW.allContent.interactions.toLocaleString(), selected: false },
              ].map(m => (
                <div key={m.label} className={`flex-shrink-0 p-4 rounded-xl border min-w-[140px] ${m.selected ? 'border-neutral-400 bg-white shadow-sm' : 'border-[#EFEFEF] bg-neutral-50'}`}>
                  <div className="text-xs text-[#666] mb-1 font-medium">{m.label}</div>
                  <div className="text-2xl font-bold text-[#1A1A1A]">{m.value}</div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-[#666] mb-1"><span className="font-semibold">{IG_OVERVIEW.allContent.followers_pct}% followers</span></p>
              <p className="text-xs text-[#666]">{IG_OVERVIEW.allContent.nonfollowers_pct}% non-followers</p>
            </div>

            {/* Views chart */}
            <div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={IG_OVERVIEW.viewsHistory}>
                    <defs>
                      <linearGradient id="igGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e879f9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e879f9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dy={6} interval={2} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dx={-6} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #EFEFEF', fontSize: '11px' }} formatter={(v: any) => [v.toLocaleString(), 'Views']} />
                    <Area type="monotone" dataKey="val" stroke="#e879f9" strokeWidth={2.5} fill="url(#igGrad)" dot={false} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Views by content type */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">Views by content type <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              <div className="flex justify-between items-center text-sm font-bold text-[#1A1A1A] mb-4">
                <span>Accounts reached</span><span>{IG_OVERVIEW.allContent.accountsReached.toLocaleString()}</span>
              </div>
              <div className="flex gap-3 text-[10px] text-[#999] font-medium mb-3">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block"></span>Followers</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-300 inline-block"></span>Non-followers</span>
              </div>
              {[
                { label: 'Reels', followers: 60, nonfollowers: 40, total: '36K' },
                { label: 'Stories', followers: 80, nonfollowers: 20, total: '13K' },
                { label: 'Posts', followers: 55, nonfollowers: 45, total: '3.8K' },
                { label: 'Live videos', followers: 0, nonfollowers: 0, total: '0' },
              ].map(row => (
                <div key={row.label} className="mb-4">
                  <div className="flex justify-between text-sm text-[#1A1A1A] mb-1.5 font-medium">
                    <span>{row.label}</span><span className="font-bold">{row.total}</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="bg-fuchsia-500 h-full" style={{ width: `${row.followers}%` }} />
                    <div className="bg-fuchsia-300 h-full" style={{ width: `${row.nonfollowers}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Interactions by content type */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">Interactions by content type <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              {[
                { label: 'Reels', value: 2500, pct: 100 }, { label: 'Stories', value: 639, pct: 26 },
                { label: 'Posts', value: 200, pct: 8 }, { label: 'Live videos', value: 0, pct: 0 },
              ].map(row => (
                <div key={row.label} className="mb-4">
                  <div className="flex justify-between text-sm text-[#1A1A1A] mb-1.5 font-medium">
                    <span>{row.label}</span><span className="font-bold">{row.value >= 1000 ? `${(row.value/1000).toFixed(1)}K` : row.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-fuchsia-500 h-full rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Profile activity */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">Profile activity <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              {[
                { label: 'Profile visits', value: IG_OVERVIEW.allContent.profileVisits.toLocaleString(), icon: '👤' },
                { label: 'Bio link taps', value: IG_OVERVIEW.allContent.bioLinkTaps.toString(), icon: '🔗' },
                { label: 'Business address taps', value: '0', icon: '🏪' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-4 p-4 border-b border-[#F5F5F5] last:border-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-lg">{row.icon}</div>
                  <span className="flex-1 text-sm font-medium text-[#1A1A1A]">{row.label}</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A]">All content <ChevronDown className="w-4 h-4" /></button>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium text-[#666]">30 days <ChevronDown className="w-4 h-4" /></button>
            </div>

            {/* Sort pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {contentSorts.map(s => (
                <button key={s} onClick={() => setContentSort(s)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-xs font-medium transition-all ${contentSort === s ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-white text-[#666] border-neutral-300 hover:border-neutral-400'}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Content list */}
            <div className="space-y-0 divide-y divide-[#F5F5F5]">
              {sortedContent.map(post => {
                const displayVal = post[SORT_KEYS[contentSort]] as number;
                const label = contentSort;
                return (
                  <div key={post.id} className="flex items-center gap-4 py-4 hover:bg-neutral-50 transition-colors cursor-pointer rounded-xl px-2">
                    <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl flex-shrink-0 border border-[#EFEFEF]">
                      {post.emoji || '📹'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1A1A1A] truncate">{post.title || post.emoji || 'Post'}</div>
                      <div className="flex gap-3 mt-1 text-xs text-[#999]">
                        <span>{post.age}</span>
                        <span>❤️ {post.likes >= 1000 ? `${(post.likes/1000).toFixed(1)}K` : post.likes}</span>
                        {post.comments > 0 && <span>💬 {post.comments}</span>}
                        {post.reposts > 0 && <span>🔁 {post.reposts}</span>}
                        {post.shares > 0 && <span>↗️ {post.shares}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-[#1A1A1A]">
                        {displayVal >= 1000 ? `${(displayVal/1000).toFixed(displayVal >= 10000 ? 0 : 1)}K` : displayVal}
                      </div>
                      <div className="text-[10px] text-[#999]">{label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AUDIENCE TAB */}
        {activeTab === 'audience' && (
          <div className="p-6 space-y-8">
            {/* Followers */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-base font-bold text-[#1A1A1A]">Followers</h4>
                <button className="flex items-center gap-1 text-sm text-[#666]">30 days <ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="text-4xl font-bold text-[#1A1A1A] mt-2">{IG_AUDIENCE.followers}</div>
              <div className="text-sm text-green-600 font-semibold mt-1">+{IG_AUDIENCE.followerGrowth}% since {IG_AUDIENCE.followersSince}</div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Follower growth over time</h4>
              <div className="flex gap-2 mb-4">
                {['overall', 'follows', 'unfollows'].map(s => (
                  <button key={s} onClick={() => setAudienceSegment(s as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${audienceSegment === s ? 'bg-neutral-800 text-white border-neutral-800' : 'text-[#666] border-neutral-300'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={IG_AUDIENCE.followerGrowthHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dy={6} interval={2} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dx={-6} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #EFEFEF', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="val" stroke="#e879f9" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">Gender <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              {[{ label: 'Women', value: IG_AUDIENCE.gender.women, color: 'bg-fuchsia-500' }, { label: 'Men', value: IG_AUDIENCE.gender.men, color: 'bg-fuchsia-400' }].map(g => (
                <div key={g.label} className="mb-4">
                  <div className="flex justify-between text-sm text-[#1A1A1A] mb-1.5 font-medium">
                    <span>{g.label}</span><span className="font-bold">{g.value}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`${g.color} h-full rounded-full`} style={{ width: `${g.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Age Range */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">Age range <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              <div className="flex gap-4 text-[10px] text-[#999] font-medium mb-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block"></span>Women</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-300 inline-block"></span>Men</span>
              </div>
              {IG_AUDIENCE.age.map(a => (
                <div key={a.range} className="mb-3">
                  <div className="flex justify-between text-sm text-[#1A1A1A] mb-1 font-medium">
                    <span>{a.range}</span><span className="font-bold">{a.pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="bg-fuchsia-500 h-full" style={{ width: `${a.pct * (IG_AUDIENCE.gender.women / 100)}%` }} />
                    <div className="bg-fuchsia-300 h-full" style={{ width: `${a.pct * (IG_AUDIENCE.gender.men / 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Locations */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">Top locations <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              <div className="flex gap-2 mb-4">
                {['Countries', 'Towns/cities'].map(v => (
                  <button key={v} onClick={() => setLocationView(v as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${locationView === v ? 'bg-neutral-800 text-white border-neutral-800' : 'text-[#666] border-neutral-300'}`}>
                    {v}
                  </button>
                ))}
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5 font-medium"><span>🇮🇳 India</span><span className="font-bold text-[#1A1A1A]">100%</span></div>
                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="bg-fuchsia-500 h-full rounded-full w-full" />
                </div>
              </div>
            </div>

            {/* Follower Active Times */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">Follower active times <span className="text-[10px] text-[#999] font-normal border border-[#EFEFEF] rounded px-1.5 py-0.5">ⓘ</span></h4>
              <div className="flex gap-2 mb-6">
                {days.map(d => (
                  <button key={d} onClick={() => setActiveDay(d)}
                    className={`w-10 h-10 rounded-full text-xs font-semibold transition-all ${activeDay === d ? 'bg-[#1A1A1A] text-white' : 'bg-neutral-100 text-[#666] hover:bg-neutral-200'}`}>
                    {d}
                  </button>
                ))}
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { time: '12a', val: 30 }, { time: '3a', val: 10 }, { time: '6a', val: 55 },
                    { time: '9a', val: 70 }, { time: '12p', val: 75 }, { time: '3p', val: 65 },
                    { time: '6p', val: 85 }, { time: '9p', val: 60 },
                  ]}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #EFEFEF', fontSize: '11px' }} />
                    <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={28}>
                      {[30,10,55,70,75,65,85,60].map((_, i) => (
                        <Cell key={i} fill={i === 6 ? '#e879f9' : '#f0abfc'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <h5 className="text-xs font-bold text-[#1A1A1A]">Top times</h5>
                {IG_AUDIENCE.topTimes.map(t => (
                  <div key={t} className="text-sm text-[#1A1A1A] font-semibold">{t.split(' ')[0]} <span className="text-[#666] font-normal">{t.split(' ').slice(1).join(' ')}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Platform comparison section below */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]">Cross-Platform Engagement Summary</h3>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#666] bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
            <TrendingUp className="w-3 h-3" /> Past 30 Days
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { platform: 'Instagram', views: 53607, interactions: 3344 },
              { platform: 'LeetCode', views: 0, interactions: 37 },
              { platform: 'GitHub', views: 0, interactions: 89 },
              { platform: 'X', views: 2, interactions: 0 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F5F5F5" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
              <YAxis dataKey="platform" type="category" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11, fontWeight: 500 }} width={80} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #EFEFEF', fontSize: '12px' }} />
              <Bar dataKey="views" name="Views" fill="#1A1A1A" radius={[0, 4, 4, 0]} barSize={14} />
              <Bar dataKey="interactions" name="Interactions" fill="#EFEFEF" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
