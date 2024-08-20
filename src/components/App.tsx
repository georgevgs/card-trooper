import WelcomePage from '@/components/WelcomePage';
import MainPage from '@/components/MainPage';
import AuthProvider from '@/components/AuthProvider';
import { useAuth } from '@/hooks/useAuth';

const App = ({}) => {
  const { isAuthenticated, handleLogin, handleRegister, handleLogout } = useAuth();

  const renderContent = () => {
    if (isAuthenticated) {
      return <MainPage onLogout={handleLogout} />;
    }

    return <WelcomePage onLogin={handleLogin} onRegister={handleRegister} />;
  };

  return <AuthProvider>{renderContent()}</AuthProvider>;
};

export default App;
