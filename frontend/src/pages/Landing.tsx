import { motion } from 'framer-motion';
import { TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white overflow-hidden font-label">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="font-display tracking-wide text-2xl flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
            <span className="text-white font-display text-xl">S</span>
          </div>
          Synalytix
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-2.5 bg-brand-primary text-white text-sm font-label tracking-wider font-bold rounded-xl hover:bg-brand-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-brand-primary/30"
        >
          LOGIN
        </button>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 lg:pt-48 pb-24 px-6 sm:px-12 max-w-[90rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left w-full max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-8 text-brand-primary shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
              Intelligent Command Center
            </div>
            
            <h1 className="font-display text-6xl sm:text-7xl lg:text-[5.5rem] tracking-wide text-slate-900 mb-6 leading-[0.95] uppercase">
              Stop Juggling Tabs. <br />
              <span className="text-brand-primary">Start Growing.</span>
            </h1>

            <p className="font-label text-lg sm:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
              Synalytix unifies your productivity, social growth, and coding analytics into one AI-powered command center. Every metric, one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-label font-bold tracking-widest text-sm rounded-xl hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/30 transform hover:-translate-y-1"
              >
                START FREE NOW →
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/60 backdrop-blur-md border border-white/50 text-slate-800 font-label font-bold tracking-widest text-sm rounded-xl hover:bg-white/80 transition-all shadow-sm">
                SEE DEMO
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3D Hero Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full h-full min-h-[400px] lg:min-h-[600px] relative"
          >
            <div 
              id="spline-hero-container" 
              className="w-full h-full absolute inset-0 rounded-[2.5rem] border border-white/40 bg-white/40 backdrop-blur-3xl flex flex-col items-center justify-center shadow-2xl shadow-brand-tertiary/20 overflow-hidden"
            >
              {/* Symmetrical negative inset to push the watermark out of bounds while keeping the 3D scene centered */}
              <div className="absolute -inset-24 z-10">
                <Suspense fallback={
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="w-16 h-16 mb-4 rounded-2xl bg-white/50 flex items-center justify-center border border-white/50 shadow-inner">
                      <div className="w-8 h-8 rounded-full border-4 border-dashed border-brand-primary/50 animate-[spin_3s_linear_infinite]"></div>
                    </div>
                    <span className="font-label text-brand-tertiary font-bold text-sm tracking-[0.2em] uppercase text-center">
                      Loading 3D Engine...
                    </span>
                  </div>
                }>
                  <Spline scene="https://prod.spline.design/3w2PKTAbdgbSVwWR/scene.splinecode" className="w-full h-full" />
                </Suspense>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Teaser Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-6xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          {/* Card 1 */}
          <div className="p-8 border border-white/40 bg-white/60 backdrop-blur-xl rounded-3xl flex flex-col shadow-xl shadow-brand-tertiary/5 hover:bg-white/80 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-white">
              <Sparkles className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="font-display text-2xl tracking-wide mb-3 text-slate-800 uppercase">AI Studio</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-label">Upload once, let AI tailor your captions, hashtags, and media quality specifically for each platform automatically.</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 border border-white/40 bg-white/60 backdrop-blur-xl rounded-3xl flex flex-col shadow-xl shadow-brand-tertiary/5 hover:bg-white/80 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-white">
              <Zap className="w-6 h-6 text-brand-secondary" />
            </div>
            <h3 className="font-display text-2xl tracking-wide mb-3 text-slate-800 uppercase">Unified Pipeline</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-label">Connect X, LinkedIn, Instagram, GitHub, and LeetCode. Post everywhere with single-click distribution.</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 border border-white/40 bg-white/60 backdrop-blur-xl rounded-3xl flex flex-col shadow-xl shadow-brand-tertiary/5 hover:bg-white/80 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-white">
              <TrendingUp className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="font-display text-2xl tracking-wide mb-3 text-slate-800 uppercase">Deep Analytics</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-label">Get proactive insights on how to grow your engagement and reach more people effectively across all platforms.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
