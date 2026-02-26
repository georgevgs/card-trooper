import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setIsAuthenticated(!!data?.session);
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
