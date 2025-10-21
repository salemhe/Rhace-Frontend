// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const vendor = useSelector((state) => state.auth.vendor);

  const isAuthenticated = vendor;

  const authorized = () => {
    if (!vendor) return false;
    const businessType = vendor.vendorType;
    const path = window.location.pathname;
    console.log('Business Type:', businessType);
    console.log('Current Path:', path);
    if (businessType === 'restaurant' && path.startsWith('/dashboard/restaurant')) {
      return true;
    }
    if (businessType === 'hotel' && path.startsWith('/dashboard/hotel')) {
      return true;
    }
    if (businessType === 'club' && path.startsWith('/dashboard/club')) {
        return true;
    }
    if (vendor.role === 'admin' && path.startsWith('/dashboard/admin')) {
      return true;
    }
    return false;
  }
  const isAuthorized = authorized();
  console.log('Is Authorized:', isAuthorized);


  if (!isAuthenticated || !isAuthorized) {
    return <Navigate to="/auth/vendor/login" replace />;
  }

  return <Outlet />;
}