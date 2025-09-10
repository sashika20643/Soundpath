
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface AuthUser {
  id: number;
  username: string;
}

interface AuthContextType {
  isAdmin: boolean;
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in by verifying stored token
    const verifyExistingToken = async () => {
      try {
        const adminToken = localStorage.getItem('admin_token');
        if (adminToken) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setIsAdmin(true);
              setUser(result.data.user);
            } else {
              // Invalid token, remove it
              localStorage.removeItem('admin_token');
            }
          } else {
            // Invalid token, remove it
            localStorage.removeItem('admin_token');
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('admin_token');
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingToken();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Call the new login API endpoint
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        password
      });

      const result = await response.json();

      if (result.success) {
        // Store the JWT token
        localStorage.setItem('admin_token', result.data.token);
        setIsAdmin(true);
        setUser(result.data.user);
        return true;
      } else {
        console.error('Login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (optional)
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call result
      setIsAdmin(false);
      setUser(null);
      localStorage.removeItem('admin_token');
    }
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
