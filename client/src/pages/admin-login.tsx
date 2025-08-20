
import { useAuth } from '@/contexts/auth-context';
import { AdminLogin } from '@/components/auth/admin-login';
import { Layout } from '@/components/layout/layout';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  usePageMetadata('admin-login');
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAdmin) {
      setLocation('/dashboards/events');
    }
  }, [isAdmin, setLocation]);

  if (isAdmin) {
    return null;
  }

  return <AdminLogin />;
}
