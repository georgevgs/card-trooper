import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomePage from '@/components/WelcomePage';
import MainPage from '@/components/MainPage';
import LoadingSpinner from '@/components/LoadingSpinner';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, handleLogin, handleRegister, handleLogout } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Set a small timeout to ensure smooth transition
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isInitialLoad || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <WelcomePage
          onLogin={handleLogin}
          onRegister={async (...args) => {
            try {
              await handleRegister(...args);
            } catch (error) {}
          }}
        />
      )}
    </>
  );
};

export default App;
