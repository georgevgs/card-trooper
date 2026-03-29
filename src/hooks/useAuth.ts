import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { getCachedCards } from '@/services/OfflineStore';

const WAS_AUTHENTICATED_KEY = 'cardTrooperWasAuth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      const authed = !!data?.session;
      setIsAuthenticated(authed);
      if (authed) localStorage.setItem(WAS_AUTHENTICATED_KEY, '1');
      else localStorage.removeItem(WAS_AUTHENTICATED_KEY);
      setIsLoading(false);
    }).catch(async () => {
      // Network failed (offline) — check if user was previously authenticated
      if (!navigator.onLine && localStorage.getItem(WAS_AUTHENTICATED_KEY)) {
        const cached = await getCachedCards();
        if (cached.length > 0) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      setIsAuthenticated(false);
      setIsLoading(false);
    });
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message ?? 'Login failed');
    setIsAuthenticated(true);
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const { error } = await authClient.signUp.email({ email, password, name: username });
    if (error) throw new Error(error.message ?? 'Registration failed');
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem(WAS_AUTHENTICATED_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
