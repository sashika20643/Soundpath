import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/api';
import type { User } from '@shared/schema';

interface AuthContextType {
  isAdmin: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await auth.verify(token);
      if (response.success) {
        setUser(response.data.user);
        setIsAdmin(true);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await auth.login(username, password);
      if (response.success) {
        setUser(response.data.user);
        setIsAdmin(true);
        localStorage.setItem('auth_token', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}