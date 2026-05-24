import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Twitter, Chrome, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/app'); // Redirect to dashboard
  };

  const handleProviderLogin = () => {
    login();
    navigate('/app');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Visual Side */}
      <div className="hidden md:flex flex-col bg-zinc-50 p-12 justify-between border-r border-zinc-200 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-2 font-medium tracking-tight text-xl">
          <div className="w-6 h-6 rounded-md overflow-hidden flex items-center justify-center">
            <img src="/icons/Synalytixlogo1.png" alt="Synalytix Icon" className="w-full h-full object-cover scale-[1.15]" />
          </div>
          Synalytix
        </div>
        
        <div className="relative z-10 max-w-md">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-semibold tracking-tight text-balance leading-tight mb-4"
          >
            Step into the command center of your digital identity.
          </motion.h2>
          <p className="text-zinc-500 text-lg font-light leading-relaxed">
            Unify your social and developer platforms. Optimize your reach with AI-driven insights and cross-posting capabilities.
          </p>
        </div>

        {/* Abstract Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-50 to-zinc-50 opacity-60"></div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 relative">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-zinc-500 font-light">
              {isSignUp ? 'Enter your details below to get started' : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="Alex Johnson"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="alex@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-400 text-sm font-light">Or continue with</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button type="button" onClick={handleProviderLogin} className="flex justify-center items-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors overflow-hidden">
              <img src="/icons/google logo.jpeg" alt="Google" className="w-7 h-7 object-cover rounded-full scale-[1.25]" />
            </button>
            <button type="button" onClick={handleProviderLogin} className="flex justify-center items-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors overflow-hidden">
              <img src="/icons/x icon.jpeg" alt="X" className="w-7 h-7 object-cover rounded-md scale-[1.25]" />
            </button>
            <button type="button" onClick={handleProviderLogin} className="flex justify-center items-center p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors overflow-hidden">
              <img src="/icons/githubactuallogo.png" alt="GitHub" className="w-7 h-7 object-cover rounded-full scale-[1.25]" />
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-zinc-500">
            {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-black font-medium hover:underline"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
