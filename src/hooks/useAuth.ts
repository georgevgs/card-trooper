import { useState, useEffect } from 'react';
import * as AuthService from '@/services/AuthService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && refreshToken) {
      setAccessToken(storedAccessToken);
      setIsAuthenticated(true);
      setupTokenRefresh();
    } else {
      setIsAuthenticated(false);
      setAccessToken(null);
    }
  };

  const setupTokenRefresh = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    const refreshTokens = async () => {
      try {
        const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
        storeTokens(newAccessToken, refreshToken);
        setTimeout(refreshTokens, 14 * 60 * 1000); // Refresh every 14 minutes
      } catch (error) {
        console.error('Failed to refresh token:', error);
        handleLogout();
      }
    };

    setTimeout(refreshTokens, 14 * 60 * 1000); // Initial refresh after 14 minutes
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { accessToken, refreshToken } = await AuthService.login(email, password);
      storeTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
      setupTokenRefresh();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const { accessToken, refreshToken } = await AuthService.register(username, email, password);
      storeTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
      setupTokenRefresh();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    removeTokens();
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const storeTokens = (newAccessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAccessToken(newAccessToken);
  };

  const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return {
    isAuthenticated,
    accessToken,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
