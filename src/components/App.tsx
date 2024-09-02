import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomePage from '@/components/WelcomePage';
import MainPage from '@/components/MainPage';

const App: React.FC = () => {
  const { isAuthenticated, handleLogin, handleRegister, handleLogout } = useAuth();

  if (!isAuthenticated) {
    return <WelcomePage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return <MainPage onLogout={handleLogout} />;
};

export default App;
