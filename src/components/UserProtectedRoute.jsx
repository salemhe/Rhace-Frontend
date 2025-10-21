import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserProtectedRoute() {
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = user;

  if (!isAuthenticated) {
    return <Navigate to={`/auth/user/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />;
  }

  return <Outlet />;
}