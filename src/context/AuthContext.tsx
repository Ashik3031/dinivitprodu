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
  refreshUser: () => Promise<void>;
  updateUserLocal: (partial: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check saved session
    const saved = localStorage.getItem('dis_user_session') || localStorage.getItem('dis_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        if (parsed.token) {
          localStorage.setItem('dis_token', parsed.token);
        }
      } catch (e) {
        localStorage.removeItem('dis_user_session');
        localStorage.removeItem('dis_user');
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const refreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      if (res.user) {
        setUser(prev => ({ ...prev, ...res.user }));
        localStorage.setItem('dis_user_session', JSON.stringify({ ...user, ...res.user }));
        localStorage.setItem('dis_user', JSON.stringify({ ...user, ...res.user }));
      }
    } catch (e) {
      // ignore
    }
  };

  const updateUserLocal = (partial: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem('dis_user_session', JSON.stringify(updated));
      localStorage.setItem('dis_user', JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.login({ username: username.trim(), password: password.trim() });
      if (res.user) {
        const userData = { ...res.user, token: res.token || res.user.token };
        setUser(userData);
        localStorage.setItem('dis_user_session', JSON.stringify(userData));
        localStorage.setItem('dis_user', JSON.stringify(userData));
        if (res.token) {
          localStorage.setItem('dis_token', res.token);
        }
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
    localStorage.removeItem('dis_user');
    localStorage.removeItem('dis_token');
  };

  const setUserDirectly = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('dis_user_session', JSON.stringify(newUser));
      localStorage.setItem('dis_user', JSON.stringify(newUser));
      if (newUser.token) {
        localStorage.setItem('dis_token', newUser.token);
      }
    } else {
      localStorage.removeItem('dis_user_session');
      localStorage.removeItem('dis_user');
      localStorage.removeItem('dis_token');
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
        refreshUser,
        updateUserLocal,
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
