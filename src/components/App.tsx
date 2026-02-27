import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomePage from '@/components/WelcomePage';
import MainPage from '@/components/MainPage';
import LoadingSpinner from '@/components/LoadingSpinner';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, handleLogin, handleRegister, handleLogout } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShowReload(true);
              }
            });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  if (isInitialLoad || isLoading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ background: 'var(--c-cream)' }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {showReload && (
        <div
          className="fixed top-0 left-0 right-0 px-4 py-2.5 text-center z-50 flex items-center justify-center gap-3"
          style={{ background: 'var(--c-ink)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="text-[13px] font-medium text-white">A new version is available</span>
          <button
            onClick={reloadPage}
            className="text-[13px] font-semibold px-3 py-1 rounded-full transition-opacity hover:opacity-90"
            style={{ background: 'var(--c-blue)', color: 'white' }}
          >
            Update
          </button>
        </div>
      )}
      {isAuthenticated ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <WelcomePage onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </>
  );
};

export default App;
