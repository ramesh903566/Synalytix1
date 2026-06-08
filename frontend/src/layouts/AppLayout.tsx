import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Wand2, Grid3X3, Settings, BarChart3, Plus, Bell, Activity, CalendarCheck, Sparkles } from 'lucide-react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout() {
  const { connectedApps, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Post Published', app: 'X (Twitter)', time: '5m ago', read: false },
    { id: 2, title: 'Insight Generated', app: 'Instagram', time: '12m ago', read: false },
    { id: 3, title: 'Draft Saved', app: 'LinkedIn', time: '1h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Studio', path: '/app/studio', icon: Wand2 },
    { name: 'Apps', path: '/app/apps', icon: Grid3X3 },
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { name: 'AI Recs', path: '/app/recommendations', icon: Sparkles },
    { name: 'Planner', path: '/app/planner', icon: CalendarCheck },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#FBFBFB] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#EFEFEF] bg-white flex flex-col z-10 flex-shrink-0">
        <div className="p-8 flex-1">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Synalytix</h1>
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
        <div className="p-4 border-t border-[#EFEFEF]">
          <button onClick={logout} className="w-full text-left px-3 py-2 text-xs text-[#999] hover:text-black transition-colors rounded-lg hover:bg-neutral-50">
            Sign out
          </button>
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
                      <div className={cn("w-full h-full rounded-full flex items-center justify-center font-bold text-[10px] overflow-hidden")}>
                        <img src={appInfo.iconUrl} alt={appInfo.name} className="w-full h-full object-cover scale-[1.15]" />
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold uppercase text-[#1A1A1A]">{appInfo.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex items-center" ref={notifRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors">
                <Bell className="w-4 h-4 text-[#1A1A1A]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
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
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold">{unreadCount} NEW</span>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-[#F5F5F5] last:border-0 hover:bg-neutral-50 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/40' : ''}`}>
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 relative">
                            <Activity className="w-4 h-4 text-neutral-500" />
                            {!notif.read && (
                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                            )}
                          </div>
                          <div>
                            <p className={`text-xs text-[#1A1A1A] ${!notif.read ? 'font-semibold' : 'font-medium'}`}>{notif.title}</p>
                            <p className="text-[10px] text-[#666] mt-0.5">{notif.app}</p>
                          </div>
                          <span className="ml-auto text-[9px] text-[#999] whitespace-nowrap">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      className="w-full p-3 border-t border-[#F5F5F5] bg-neutral-50 text-center hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="text-[10px] font-bold text-black uppercase tracking-widest">Mark all as read</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div onClick={() => navigate('/app/settings')} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 cursor-pointer hover:bg-neutral-200 transition-colors">
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
