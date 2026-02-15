import { useState, useEffect, useCallback } from 'react';
import * as AuthService from '@/services/AuthService';

const AUTH_CACHE_KEY = 'cardTrooperAuthCache';

interface AuthCache {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthCache = useCallback(
    (isAuth: boolean, accToken: string | null, refToken: string | null) => {
      localStorage.setItem(
        AUTH_CACHE_KEY,
        JSON.stringify({
          isAuthenticated: isAuth,
          accessToken: accToken,
          refreshToken: refToken,
        }),
      );
    },
    [],
  );

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;

    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await AuthService.refreshToken(refreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setIsAuthenticated(true);
      updateAuthCache(true, newAccessToken, newRefreshToken);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }, [refreshToken, updateAuthCache]);

  useEffect(() => {
    const initAuth = async () => {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (cached) {
        const {
          isAuthenticated: cachedIsAuth,
          accessToken: cachedToken,
          refreshToken: cachedRefreshToken,
        } = JSON.parse(cached) as AuthCache;
        if (cachedIsAuth && cachedToken && cachedRefreshToken) {
          setIsAuthenticated(true);
          setAccessToken(cachedToken);
          setRefreshToken(cachedRefreshToken);
          if (navigator.onLine) {
            // Try to refresh the token on init
            try {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                await AuthService.refreshToken(cachedRefreshToken);
              setAccessToken(newAccessToken);
              setRefreshToken(newRefreshToken);
              setIsAuthenticated(true);
              updateAuthCache(true, newAccessToken, newRefreshToken);
            } catch (error) {
              console.error('Failed to refresh token on init:', error);
              // If refresh fails, clear the cache
              setAccessToken(null);
              setRefreshToken(null);
              setIsAuthenticated(false);
              updateAuthCache(false, null, null);
            }
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [updateAuthCache]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await AuthService.login(email, password);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setIsAuthenticated(true);
      updateAuthCache(true, newAccessToken, newRefreshToken);
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
      const response = await AuthService.register(username, email, password);

      // If email confirmation is required, throw an error with the message
      if (response.emailConfirmationRequired) {
        throw new Error(
          response.message || 'Please check your email to confirm your account before logging in',
        );
      }

      // Otherwise, set the tokens and authenticate
      if (response.accessToken && response.refreshToken) {
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setIsAuthenticated(true);
        updateAuthCache(true, response.accessToken, response.refreshToken);
      } else {
        throw new Error('Registration succeeded but no tokens received');
      }
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
        await AuthService.logout(accessToken);
      }
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      updateAuthCache(false, null, null);
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
    refreshAccessToken,
  };
};
