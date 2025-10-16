import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();

  logger.log('ProtectedRoute state:', { user: !!user, isAdmin, isLoading, requireAdmin });

  if (isLoading) {
    logger.log('ProtectedRoute: showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    logger.log('ProtectedRoute: no user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    logger.log('ProtectedRoute: not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  logger.log('ProtectedRoute: rendering children');
  return <>{children}</>;
}