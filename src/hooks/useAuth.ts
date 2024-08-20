import { useState, useEffect } from 'react';
import * as AuthService from '@/services/AuthService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(token !== null);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const token = await AuthService.login(email, password);
      storeAuthToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      handleAuthError('Login error:', error);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await AuthService.register(username, email, password);
      await handleLogin(email, password);
    } catch (error) {
      handleAuthError('Registration error:', error);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
  };

  const storeAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const removeAuthToken = () => {
    localStorage.removeItem('authToken');
  };

  const handleAuthError = (message: string, error: unknown) => {
    console.error(message, error);
    throw error;
  };

  return {
    isAuthenticated,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
