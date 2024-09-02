import { useState, useEffect, useCallback } from 'react';
import * as AuthService from '@/services/AuthService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    try {
      const newAccessToken = await AuthService.refreshToken();
      setAccessToken(newAccessToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsAuthenticated(false);
      setAccessToken(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const session = localStorage.getItem('session');
        if (session) {
          const success = await refreshAccessToken();
          if (!success) {
            localStorage.removeItem('session');
          }
        }
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshAccessToken]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken } = await AuthService.login(email, password);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      localStorage.setItem('session', 'true');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await AuthService.register(username, email, password);
      // After successful registration, log the user in
      await handleLogin(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('session');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    accessToken,
    isLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
