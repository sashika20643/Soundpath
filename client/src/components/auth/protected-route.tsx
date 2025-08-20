
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AdminLogin } from './admin-login';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-warm-white)" }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: "var(--color-dark-gray)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
