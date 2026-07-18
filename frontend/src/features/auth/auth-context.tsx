"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL, API_PATHS } from '@/lib/api/config';

type User = {
  id: number;
  email: string;
  name?: string;
  number?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current session from NestJS backend on load
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${API_PATHS.me}`, {
          credentials: 'include', // Automatically sends the HttpOnly cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user session', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (newUser: User) => setUser(newUser);
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}${API_PATHS.logout}`, { method: 'POST', credentials: 'include' });
      setUser(null);
      window.location.assign('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
