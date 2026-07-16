import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomePage from '@/components/WelcomePage';
import MainPage from '@/components/MainPage';
import LoadingSpinner from '@/components/LoadingSpinner';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, handleLogin, handleRegister, handleLogout } = useAuth();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);
  const userAcceptedUpdate = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/service-worker.js').then(reg => {
      // An update finished downloading in a previous visit and is still waiting
      if (reg.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(reg.waiting);
        setShowReload(true);
      }
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(nw);
            setShowReload(true);
          }
        });
      });
    }).catch(e => console.error('SW registration failed:', e));

    // clients.claim() also fires this on first install — only reload when the
    // user explicitly accepted an update via the banner.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (userAcceptedUpdate.current) window.location.reload();
    });
  }, []);

  const reloadPage = () => {
    userAcceptedUpdate.current = true;
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ background: 'var(--bg)' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {showReload && (
        <div className="fixed top-0 left-0 right-0 px-4 py-2.5 text-center z-50 flex items-center justify-center gap-3"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>A new version is available</span>
          <button onClick={reloadPage} className="text-[13px] font-semibold px-3 py-1 rounded-md btn-primary">Update</button>
        </div>
      )}
      {isAuthenticated ? <MainPage onLogout={handleLogout} /> : <WelcomePage onLogin={handleLogin} onRegister={handleRegister} />}
    </>
  );
};

export default App;
