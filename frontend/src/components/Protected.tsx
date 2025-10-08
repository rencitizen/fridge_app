import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}