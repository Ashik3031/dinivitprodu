import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { AdminPage } from './pages/AdminPage';
import { PublicViewerPage } from './pages/PublicViewerPage';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'admin' | 'public'>('dashboard');
  const [activeInvitationId, setActiveInvitationId] = useState<string | null>(null);
  const [publicSlug, setPublicSlug] = useState<string | null>(null);

  // Hash-based routing check for public viewers & bookmarks
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/i/')) {
        const slug = hash.replace('#/i/', '').split('?')[0];
        if (slug) {
          setPublicSlug(slug);
          setCurrentView('public');
          return;
        }
      } else if (hash.startsWith('#/editor/')) {
        const id = hash.replace('#/editor/', '').split('?')[0];
        if (id) {
          setActiveInvitationId(id);
          setCurrentView('editor');
          return;
        }
      } else if (hash === '#/admin') {
        setCurrentView('admin');
        return;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If viewing a public invitation, skip auth requirement!
  if (currentView === 'public' && publicSlug) {
    return <PublicViewerPage slug={publicSlug} />;
  }

  // Loading auth session
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center text-amber-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Initializing Invitation Studio...
          </span>
        </div>
      </div>
    );
  }

  // If not logged in, render strict login page
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Navigation callbacks
  const handleOpenEditor = (id: string) => {
    setActiveInvitationId(id);
    setCurrentView('editor');
    window.location.hash = `#/editor/${id}`;
  };

  const handleBackToDashboard = () => {
    setActiveInvitationId(null);
    setCurrentView('dashboard');
    window.location.hash = '#/';
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.location.hash = '#/admin';
  };

  // Views switcher
  if (currentView === 'admin' && user.role === 'admin') {
    return <AdminPage onBackToDashboard={handleBackToDashboard} />;
  }

  if (currentView === 'editor' && activeInvitationId) {
    return (
      <EditorPage
        invitationId={activeInvitationId}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return (
    <DashboardPage
      onOpenEditor={handleOpenEditor}
      onOpenAdmin={user.role === 'admin' ? handleOpenAdmin : undefined}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
