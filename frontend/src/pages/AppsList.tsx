import { motion } from 'framer-motion';
import { MOCK_APPS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';

export default function AppsList() {
  const { connectedApps } = useAppContext();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-end mb-10">
        <header>
          <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Applications</h1>
          <p className="text-[#666] text-sm font-light">Connect your external platforms to start managing and cross-posting.</p>
        </header>
        
        {/* User requested new upcoming apps button upper right */}
        <button className="px-5 py-2.5 bg-white text-[#1A1A1A] border border-[#EFEFEF] rounded-lg font-medium text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-colors">
          <Plus className="w-3 h-3" />
          Request App
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_APPS.map(app => {
          const isConnected = connectedApps.includes(app.id as any);
          
          return (
            <div 
              key={app.id} 
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                isConnected 
                  ? 'bg-white border-[#EFEFEF]' 
                  : 'bg-neutral-50 border-transparent hover:bg-white hover:border-[#EFEFEF]'
              }`}
              onClick={() => isConnected ? navigate(`/app/apps/${app.id}`) : navigate(`/app/apps/${app.id}/connect`)}
            >
              <div className="flex justify-between items-start mb-12">
                <div className={`w-10 h-10 rounded-xl bg-white border border-[#EFEFEF] flex items-center justify-center font-bold text-sm ${app.color}`}>
                  {app.name.charAt(0)}
                </div>
                
                {isConnected ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded text-[9px] font-bold uppercase tracking-widest border border-green-100">
                    <Check className="w-3 h-3" />
                    Connected
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded text-[9px] font-bold uppercase tracking-widest border border-neutral-200">
                    Not Connected
                  </span>
                )}
              </div>
              
              <h3 className="text-sm font-semibold mb-1 text-[#1A1A1A]">{app.name}</h3>
              <p className="text-[#666] text-xs font-light leading-relaxed">
                {isConnected ? 'Manage accounts and view analytics.' : 'Click to authorize connection and sync.'}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 text-center border-t border-[#F5F5F5] pt-16">
         <h3 className="font-bold text-[#999] uppercase tracking-widest text-[10px] mb-6">Upcoming Integrations</h3>
         <div className="flex gap-4 justify-center opacity-50 grayscale">
            <div className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-[#1A1A1A]">TikTok</div>
            <div className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-[#1A1A1A]">Hashnode</div>
            <div className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-[#1A1A1A]">Dev.to</div>
         </div>
      </div>
    </motion.div>
  );
}
