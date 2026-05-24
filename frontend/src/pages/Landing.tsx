import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] font-sans selection:bg-black selection:text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 backdrop-blur-md bg-white/50 border-b border-[#EFEFEF]">
        <div className="font-medium tracking-tight text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          Sinalytix
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white border border-[#EFEFEF] text-[10px] font-bold uppercase tracking-widest mb-8 text-[#999]">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Elevate your presence
          </div>
          
          <div className="w-full aspect-video max-w-4xl bg-neutral-100 rounded-3xl border border-[#EFEFEF] flex items-center justify-center">
            {/* User can add their mp4 video here */}
            <span className="text-[#999] text-sm font-light">Video Placeholder</span>
          </div>
        </motion.div>

        {/* Feature Teaser Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {/* Card 1 */}
          <div className="p-8 border border-[#EFEFEF] bg-white rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-semibold mb-3">AI Studio Optimization</h3>
            <p className="text-[#666] text-xs leading-relaxed font-light">Upload once, let AI tailor your captions, hashtags, and media quality specifically for each platform automatically.</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 border border-[#EFEFEF] bg-white rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-semibold mb-3">Unified Cross-Posting</h3>
            <p className="text-[#666] text-xs leading-relaxed font-light">Connect X, LinkedIn, Instagram, GitHub, and LeetCode. Post everywhere with single-click distribution.</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 border border-[#EFEFEF] bg-white rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-semibold mb-3">Deep Analytics</h3>
            <p className="text-[#666] text-xs leading-relaxed font-light">Get proactive insights on how to grow your engagement and reach more people effectively.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
