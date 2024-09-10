import { useState, useEffect, useCallback } from 'react';
import * as AuthService from '@/services/AuthService';

const AUTH_CACHE_KEY = 'cardTrooperAuthCache';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthCache = useCallback((isAuth: boolean, token: string | null) => {
    localStorage.setItem(
      AUTH_CACHE_KEY,
      JSON.stringify({ isAuthenticated: isAuth, accessToken: token }),
    );
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const newAccessToken = await AuthService.refreshToken();
      setAccessToken(newAccessToken);
      setIsAuthenticated(true);
      updateAuthCache(true, newAccessToken);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }, [updateAuthCache]);

  useEffect(() => {
    const initAuth = async () => {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (cached) {
        const { isAuthenticated: cachedIsAuth, accessToken: cachedToken } = JSON.parse(cached);
        if (cachedIsAuth && cachedToken) {
          setIsAuthenticated(true);
          setAccessToken(cachedToken);
          if (navigator.onLine) {
            await refreshAccessToken();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken } = await AuthService.login(email, password);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      updateAuthCache(true, accessToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await AuthService.register(username, email, password);
      await handleLogin(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (navigator.onLine) {
        await AuthService.logout();
      }
      setAccessToken(null);
      setIsAuthenticated(false);
      updateAuthCache(false, null);
    } catch (error) {
      console.error('Logout failed:', error);
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
