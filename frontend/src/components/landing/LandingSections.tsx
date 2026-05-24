import { motion } from 'motion/react';
import { Sparkles, CheckCircle, ArrowRight, Star, ChevronDown, Share2, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 }
};

export function LandingSections() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full bg-white relative z-10 overflow-hidden">
      
      {/* 3. Trusted By */}
      <section className="py-20 border-b border-zinc-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-center text-sm font-semibold tracking-widest text-zinc-400 uppercase mb-8">Trusted by creators and teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 opacity-50 grayscale">
             {/* Mock company logos */}
             <div className="text-xl font-bold font-display text-zinc-800">Acme Corp</div>
             <div className="text-xl font-bold font-display text-zinc-800">Quantum</div>
             <div className="text-xl font-bold font-display text-zinc-800">Globalize</div>
             <div className="text-xl font-bold font-display text-zinc-800">Vercel</div>
             <div className="text-xl font-bold font-display text-zinc-800">Stripe</div>
          </div>
        </div>
      </section>

      {/* 4. Problem & 5. Solution */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> The Problem
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-slate-900 leading-tight mb-6">
              You are wasting hours jumping between tabs.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Managing content across X, LinkedIn, Instagram, and GitHub means fragmented analytics, manual cross-posting, and lost audience context. It&apos;s impossible to scale your presence when your tools are disconnected.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20 blur-3xl rounded-full opacity-50"></div>
            <div className="relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-brand-primary/10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest mb-6">
                 <Sparkles className="w-3 h-3" /> The Solution
               </div>
               <h3 className="text-2xl font-display font-semibold mb-4">One Unified Command Center.</h3>
               <ul className="space-y-4">
                 {[
                   'Write once, optimize via AI, publish everywhere.',
                   'Aggregate all your analytics into a single dashboard.',
                   'Track GitHub contributions and LeetCode stats automatically.',
                   'Understand exactly what content drives real growth.'
                 ].map((text, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckCircle className="w-4 h-4 text-green-600" />
                     </div>
                     <span className="text-slate-700 font-medium">{text}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Features */}
      <section className="py-32 bg-slate-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-slate-900 mb-6">Everything you need to grow faster.</h2>
            <p className="text-lg text-slate-600">Powerful features designed to automate the heavy lifting so you can focus on creating high-quality content.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} 
            initial="initial" 
            whileInView="whileInView" 
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeUp} className="p-8 border border-white bg-white rounded-[2rem] flex flex-col shadow-xl shadow-brand-tertiary/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 border border-brand-primary/20">
                <Sparkles className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-3 text-slate-800">AI Studio</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-label">Upload once, let AI tailor your captions, hashtags, and media quality specifically for each platform automatically.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeUp} className="p-8 border border-white bg-white rounded-[2rem] flex flex-col shadow-xl shadow-brand-tertiary/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6 border border-brand-secondary/20">
                <Share2 className="w-6 h-6 text-brand-secondary" />
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-3 text-slate-800">Unified Pipeline</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-label">Connect X, LinkedIn, Instagram, GitHub, and LeetCode. Post everywhere with single-click distribution.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeUp} className="p-8 border border-white bg-white rounded-[2rem] flex flex-col shadow-xl shadow-brand-tertiary/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-3 text-slate-800">Deep Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-label">Get proactive insights on how to grow your engagement and reach more people effectively across all platforms.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. Product Demo */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <motion.div {...fadeUp} className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-slate-900 mb-6">See it in action.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A beautifully designed interface that makes managing your digital footprint feel effortless.</p>
          </motion.div>

          <motion.div {...fadeUp} className="relative mx-auto max-w-6xl rounded-t-3xl overflow-hidden shadow-2xl border border-zinc-200 bg-white pt-6 px-6">
             <div className="w-full flex items-center gap-2 mb-4">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="w-full aspect-[16/9] bg-zinc-950 rounded-t-2xl border-t border-x border-zinc-200 flex items-center justify-center relative overflow-hidden shadow-inner">
                <video 
                  src="/icons/Synalytixvedio.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-[14.5%] right-[7.7%] translate-x-1/2 translate-y-1/2 z-20 flex items-center rounded-2xl overflow-hidden bg-white shadow-lg">
                  <img src="/icons/Synalytixlogo1.png" alt="Synalytix" className="h-14 w-auto object-cover scale-[1.15]" />
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Benefits */}
      <section className="py-32 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
             <motion.div {...fadeUp} className="flex flex-col items-center">
               <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-400 mb-4">10h+</div>
               <h4 className="text-xl font-medium mb-2">Saved Weekly</h4>
               <p className="text-slate-400 text-sm">Automate cross-posting and analytics tracking.</p>
             </motion.div>
             <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="flex flex-col items-center">
               <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-orange-400 mb-4">3x</div>
               <h4 className="text-xl font-medium mb-2">Faster Growth</h4>
               <p className="text-slate-400 text-sm">Make data-driven decisions on what content works.</p>
             </motion.div>
             <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-col items-center">
               <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">100%</div>
               <h4 className="text-xl font-medium mb-2">Platform Visibility</h4>
               <p className="text-slate-400 text-sm">Never miss an important metric or engagement opportunity.</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-slate-900 mb-6">Loved by creators.</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Alex Chen", role: "DevRel Engineer", text: "Synalytix replaced four different tools for me. Being able to track my GitHub commits alongside my Twitter growth is insane." },
              { name: "Sarah Jenkins", role: "Content Creator", text: "The AI Studio is magic. It perfectly formats my LinkedIn posts based on my short-form video captions. A massive time saver." },
              { name: "David Kim", role: "Indie Hacker", text: "Finally, a dashboard that understands developers are creators too. Tracking LeetCode and product launches in one place." }
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-3xl shadow-lg shadow-zinc-200/50 border border-zinc-100">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-brand-secondary text-brand-secondary" />)}
                </div>
                <p className="text-slate-700 mb-8 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                   <div>
                     <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                     <span className="text-xs text-slate-500">{t.role}</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Pricing */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-slate-900 mb-6">Simple, transparent pricing.</h2>
            <p className="text-lg text-slate-600">Start for free, upgrade when you need more power.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
             {/* Starter */}
             <div className="p-8 rounded-[2rem] bg-white border border-zinc-200 shadow-sm">
               <h3 className="text-xl font-bold mb-2">Starter</h3>
               <div className="mb-6"><span className="text-4xl font-display font-bold">$0</span><span className="text-zinc-500">/mo</span></div>
               <p className="text-sm text-zinc-500 mb-8">Perfect for individuals just getting started.</p>
               <ul className="space-y-4 mb-8">
                 <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-zinc-400" /> 2 Connected Accounts</li>
                 <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-zinc-400" /> Basic Analytics</li>
                 <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-zinc-400" /> 10 AI Generations/mo</li>
               </ul>
               <button onClick={() => navigate('/auth')} className="w-full py-3 rounded-xl font-bold text-sm bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-800">Get Started</button>
             </div>

             {/* Pro */}
             <div className="p-1 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-[2rem]"></div>
               <div className="relative p-8 rounded-[1.9rem] bg-white shadow-2xl">
                 <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
                 <h3 className="text-xl font-bold mb-2">Pro</h3>
                 <div className="mb-6"><span className="text-4xl font-display font-bold">$19</span><span className="text-zinc-500">/mo</span></div>
                 <p className="text-sm text-zinc-500 mb-8">For serious creators and developers.</p>
                 <ul className="space-y-4 mb-8">
                   <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="w-4 h-4 text-brand-primary" /> Unlimited Accounts</li>
                   <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="w-4 h-4 text-brand-primary" /> Deep Analytics & History</li>
                   <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="w-4 h-4 text-brand-primary" /> Unlimited AI Studio</li>
                   <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="w-4 h-4 text-brand-primary" /> Auto-Publishing</li>
                 </ul>
                 <button onClick={() => navigate('/auth')} className="w-full py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-black transition-colors text-white shadow-lg">Start Free Trial</button>
               </div>
             </div>

             {/* Custom */}
             <div className="p-8 rounded-[2rem] bg-white border border-zinc-200 shadow-sm">
               <h3 className="text-xl font-bold mb-2">Enterprise</h3>
               <div className="mb-6"><span className="text-4xl font-display font-bold">Custom</span></div>
               <p className="text-sm text-zinc-500 mb-8">For agencies managing multiple clients.</p>
               <ul className="space-y-4 mb-8">
                 <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-zinc-400" /> Team Workspaces</li>
                 <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-zinc-400" /> Custom Integrations</li>
                 <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-zinc-400" /> Dedicated Account Manager</li>
               </ul>
               <button onClick={() => navigate('/auth')} className="w-full py-3 rounded-xl font-bold text-sm border border-zinc-200 hover:bg-zinc-50 transition-colors text-zinc-800">Contact Us</button>
             </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-display font-semibold text-slate-900">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: "Do you post directly to platforms?", a: "Yes, once authorized, Synalytix can publish directly to X, LinkedIn, and Instagram on your behalf." },
              { q: "Is the AI Studio trained on my data?", a: "We use your historical top-performing posts to tailor the tone of voice, but your data is never used to train public models." },
              { q: "Can I connect multiple accounts of the same platform?", a: "Yes! On the Pro tier, you can connect multiple X or LinkedIn accounts and manage them from separate workspaces." }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto px-6 sm:px-12 relative z-10 text-center">
           <h2 className="text-5xl sm:text-6xl font-display font-bold text-white mb-8">Ready to grow your digital presence?</h2>
           <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands of creators and developers who use Synalytix to save time and scale their audience.</p>
           <button onClick={() => navigate('/auth')} className="px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2 mx-auto">
             Get Started for Free <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center rounded-2xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
             <img src="/icons/Synalytixlogo2.png" alt="Synalytix" className="h-10 w-auto object-cover scale-[1.15]" />
           </div>
           <div className="flex gap-6 text-sm">
             <button className="hover:text-white transition-colors">Terms</button>
             <button className="hover:text-white transition-colors">Privacy</button>
             <button className="hover:text-white transition-colors">Contact</button>
           </div>
           <div className="text-sm">
             © 2026 Synalytix. All rights reserved.
           </div>
        </div>
      </footer>

    </div>
  );
}
