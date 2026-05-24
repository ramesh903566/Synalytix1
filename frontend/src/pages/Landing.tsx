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
      <main className="w-full h-[calc(100vh-2rem)] pt-28 pb-12 px-6 sm:px-12 flex items-center justify-center">
        <div className="w-full h-full max-w-[100rem] mx-auto relative rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-tertiary/10 border border-white/40 bg-white/20 backdrop-blur-2xl">
          {/* Symmetrical negative inset to push the watermark out of bounds while keeping the 3D scene centered */}
          <div className="absolute -inset-24 z-10 pointer-events-auto">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-full w-full bg-transparent">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-white/50 flex items-center justify-center border border-white/50 shadow-inner">
                  <div className="w-8 h-8 rounded-full border-4 border-dashed border-brand-primary/50 animate-[spin_3s_linear_infinite]"></div>
                </div>
              </div>
            }>
              <Spline scene="https://prod.spline.design/t1kz57-eOEyxt8UN/scene.splinecode" className="w-full h-full" />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Feature Teaser Cards Container */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-12 pb-24">

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
      </div>
    </div>
  );
}
