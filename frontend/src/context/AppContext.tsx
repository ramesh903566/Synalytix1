import { createContext, useContext, useState, ReactNode } from 'react';
import { AppName } from '../types';

export interface ScheduledPost {
  id: string;
  description: string;
  apps: AppName[];
  date: string;
  time: string;
  status: 'scheduled' | 'published';
}

export interface DraftPost {
  id: string;
  description: string;
  apps: AppName[];
  drafts: Record<string, string>;
  createdAt: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  connectedApps: AppName[];
  connectApp: (app: AppName) => void;
  disconnectApp: (app: AppName) => void;
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id' | 'status'>) => void;
  deleteScheduledPost: (id: string) => void;
  savedDrafts: DraftPost[];
  saveDraft: (draft: Omit<DraftPost, 'id' | 'createdAt'>) => void;
  deleteDraft: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedApps, setConnectedApps] = useState<AppName[]>(['github']); // start with one for demo
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<DraftPost[]>([]);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    setConnectedApps([]);
    setScheduledPosts([]);
    setSavedDrafts([]);
  };

  const connectApp = (app: AppName) => {
    if (!connectedApps.includes(app)) {
      setConnectedApps([...connectedApps, app]);
    }
  };

  const disconnectApp = (app: AppName) => {
    setConnectedApps(connectedApps.filter((a) => a !== app));
  };

  const addScheduledPost = (post: Omit<ScheduledPost, 'id' | 'status'>) => {
    const newPost: ScheduledPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      status: 'scheduled'
    };
    setScheduledPosts(prev => [newPost, ...prev]);
  };

  const deleteScheduledPost = (id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
  };

  const saveDraft = (draft: Omit<DraftPost, 'id' | 'createdAt'>) => {
    const newDraft: DraftPost = {
      ...draft,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setSavedDrafts(prev => [newDraft, ...prev]);
  };

  const deleteDraft = (id: string) => {
    setSavedDrafts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        connectedApps,
        connectApp,
        disconnectApp,
        scheduledPosts,
        addScheduledPost,
        deleteScheduledPost,
        savedDrafts,
        saveDraft,
        deleteDraft
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
