import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('user'));
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData) => {
    console.log("AUTH_CONTEXT: Login function called with user:", userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    console.log("AUTH_CONTEXT: Logout called");
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }, [navigate]);

  const refreshProfile = useCallback(() => {
    console.log("AUTH_CONTEXT: Manual refreshProfile called");
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      logout();
    }
  }, [logout]);

  const isAuthenticated = !isLoading && !!user;

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};