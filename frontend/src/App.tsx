import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import AppsList from './pages/AppsList';
import AppDetails from './pages/AppDetails';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Planner from './pages/Planner';
import AppLayout from './layouts/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="studio" element={<Studio />} />
        <Route path="apps" element={<AppsList />} />
        <Route path="apps/:id" element={<AppDetails />} />
        <Route path="apps/:id/connect" element={<AppDetails />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="planner" element={<Planner />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
