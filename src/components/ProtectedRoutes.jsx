// components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const { vendor, admin } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAuthenticated = vendor || admin;

  const authorized = () => {
    const path = location.pathname;

    if (admin) {
      return path.startsWith("/dashboard/admin");
    }

    if (!vendor) {
      return false;
    }

    if (!vendor.isOnboarded) {
        return path.startsWith("/auth/vendor/onboarding");
    }

    const businessType = vendor.vendorType;

    if (businessType === 'restaurant' && path.startsWith('/dashboard/restaurant') ) {
      return true;
    }
    if (businessType === 'hotel' && path.startsWith('/dashboard/hotel')) {
      return true;
    }
    if (businessType === 'club' && path.startsWith('/dashboard/club')) {
        return true;
    }
    return false;
  }
  const isAuthorized = authorized();

  if (!isAuthenticated) {
    // Redirect to appropriate login based on the path
    if (location.pathname.startsWith("/dashboard/admin")) {
      return <Navigate to="/auth/admin/login" replace />;
    }
    return <Navigate to="/auth/vendor/login" replace />;
  }

  if (!isAuthorized) {
    if (admin) {
      return <Navigate to="/dashboard/admin" replace />;
    }
    if (vendor && !vendor.isOnboarded) {
        return <Navigate to="/auth/vendor/onboarding" replace />;
    }
    if (vendor) {
        // Redirect to their correct dashboard if they try to access a wrong one
        return <Navigate to={`/dashboard/${vendor.vendorType}`} replace />;
    }
    // Fallback if something is wrong
    return <Navigate to="/auth/vendor/login" replace />;
  }

  return <Outlet />;
}