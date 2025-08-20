
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple admin credentials (in production, this should be in environment variables)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken === 'authenticated') {
      setIsAdmin(true);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      localStorage.setItem('admin_token', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, isLoading }}>
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
