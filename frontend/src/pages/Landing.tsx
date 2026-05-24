import { motion } from 'framer-motion';
import { TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LandingSections } from '../components/landing/LandingSections';

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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-slate-600 hover:text-slate-900 text-sm font-label tracking-wider font-bold transition-colors"
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm font-label tracking-wider font-bold rounded-xl hover:bg-brand-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-brand-primary/30"
          >
            START NOW
          </button>
        </div>
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

      <LandingSections />
    </div>
  );
}
