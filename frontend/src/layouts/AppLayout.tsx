import { useState } from 'react';
import { LayoutDashboard, Wand2, Grid3X3, Settings, BarChart3, Plus, Bell, Activity } from 'lucide-react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout() {
  const { connectedApps } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Studio', path: '/app/studio', icon: Wand2 },
    { name: 'Apps', path: '/app/apps', icon: Grid3X3 },
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#FBFBFB] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#EFEFEF] bg-white flex flex-col z-10 flex-shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Sinalytix</h1>
          </div>
          
          <nav className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-4">Principal</p>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/app'}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-neutral-100 text-black" 
                        : "text-[#666] hover:text-black hover:bg-neutral-50"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>



      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-[#EFEFEF] bg-white flex items-center px-8 justify-between flex-shrink-0">
          <div className="flex items-center gap-6 overflow-x-hidden">
            <div className="flex gap-4">
              {/* Connected apps story style */}
              {connectedApps.map(appId => {
                  const appInfo = MOCK_APPS.find(a => a.id === appId);
                  if (!appInfo) return null;
                  const isActive = location.pathname.includes(`/apps/${appId}`);
                  return (
                    <div key={appId} onClick={() => navigate(`/app/apps/${appId}`)} className={cn("flex flex-col items-center gap-1 cursor-pointer", isActive ? "opacity-100" : "opacity-40 hover:opacity-100 transition-opacity")}>
                      <div className={cn("w-12 h-12 rounded-full border-2 p-[2px]", isActive ? "border-black" : "border-transparent")}>
                        <div className={cn("w-full h-full rounded-full flex items-center justify-center font-bold text-[10px]", isActive ? "bg-black text-white" : "bg-neutral-200 text-[#1A1A1A]")}>{appInfo.name.substring(0, 2).toUpperCase()}</div>
                      </div>
                      <span className="text-[9px] font-semibold uppercase text-[#1A1A1A]">{appInfo.name}</span>
                    </div>
                  );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-[#1A1A1A]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-[320px] bg-white border border-[#EFEFEF] rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Recent Activities</h3>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold">2 NEW</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {[
                      { title: 'Post Published', app: 'X (Twitter)', time: '5m ago' },
                      { title: 'Insight Generated', app: 'Instagram', time: '12m ago' },
                      { title: 'Draft Saved', app: 'LinkedIn', time: '1h ago' }
                    ].map((notif, i) => (
                      <div key={i} className="p-4 border-b border-[#F5F5F5] last:border-0 hover:bg-neutral-50 transition-colors flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-neutral-500" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1A1A1A]">{notif.title}</p>
                          <p className="text-[10px] text-[#666] mt-0.5">{notif.app}</p>
                        </div>
                        <span className="ml-auto text-[9px] text-[#999] whitespace-nowrap">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#F5F5F5] bg-neutral-50 text-center cursor-pointer hover:bg-neutral-100">
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest">Mark all as read</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 cursor-pointer hover:bg-neutral-200 transition-colors">
              <span className="text-[10px] font-bold text-[#1A1A1A]">AJ</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
