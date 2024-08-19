import React, { useState, useEffect } from 'react';
import WelcomePage from './WelcomePage';
import MainPage from './MainPage';
import AuthProvider from './AuthProvider';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // After successful registration, automatically log in the user
      await handleLogin(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthProvider>
      {isAuthenticated ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <WelcomePage onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </AuthProvider>
  );
};

export default App;