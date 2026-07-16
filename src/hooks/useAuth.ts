import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

const WAS_AUTHENTICATED_KEY = 'cardTrooperWasAuth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const wasAuthed = !!localStorage.getItem(WAS_AUTHENTICATED_KEY);

    // Optimistic startup: if this device was signed in last time, show the
    // wallet immediately (cards render from cache) and verify the session in
    // the background. The API still gates every request server-side.
    if (wasAuthed) {
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    authClient.getSession().then(({ data, error }) => {
      if (data?.session) {
        setIsAuthenticated(true);
        localStorage.setItem(WAS_AUTHENTICATED_KEY, '1');
      } else if (!error) {
        // Server definitively said there is no session
        setIsAuthenticated(false);
        localStorage.removeItem(WAS_AUTHENTICATED_KEY);
      } else {
        // Network or server error (offline, flaky signal, captive portal, 5xx) —
        // trust the last known auth state so cards stay reachable at checkout
        setIsAuthenticated(wasAuthed);
      }
      setIsLoading(false);
    }).catch(() => {
      // Request never reached the server — same fallback
      setIsAuthenticated(wasAuthed);
      setIsLoading(false);
    });
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message ?? 'Login failed');
    localStorage.setItem(WAS_AUTHENTICATED_KEY, '1');
    setIsAuthenticated(true);
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const { error } = await authClient.signUp.email({ email, password, name: username });
    if (error) throw new Error(error.message ?? 'Registration failed');
    localStorage.setItem(WAS_AUTHENTICATED_KEY, '1');
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
