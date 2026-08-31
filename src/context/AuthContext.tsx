import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  demoLogin: (roleOrType: 'admin' | 'business_owner' | 'business' | string) => Promise<boolean>;
  logout: () => void;
  setUserDirectly: (user: User | null) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check saved session
    const saved = localStorage.getItem('dis_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('dis_user_session');
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.login({ username: username.trim(), password: password.trim() });
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('dis_user_session', JSON.stringify(res.user));
        setIsLoading(false);
        return true;
      }
      setError('Authentication failed. Please verify your credentials.');
      setIsLoading(false);
      return false;
    } catch (err: any) {
      const message = err.message || 'Invalid credentials. Please contact your system administrator.';
      setError(message);
      setIsLoading(false);
      return false;
    }
  };

  const demoLogin = async (roleOrType: 'admin' | 'business_owner' | 'business' | string): Promise<boolean> => {
    setError(null);
    if (roleOrType === 'admin') {
      return login('admin', 'admin123');
    }
    // Business owner demo
    return login('royal_prints', 'royal123');
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('dis_user_session');
  };

  const setUserDirectly = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('dis_user_session', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('dis_user_session');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        demoLogin,
        logout,
        setUserDirectly,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
