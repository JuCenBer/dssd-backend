import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

/**
 * @param {string} redirectPath - Path to redirect if not authenticated
 * @param {string|string[]|null} permission - Required permission(s)
 * @param {boolean} useLayout - Whether to render inside layout (Outlet)
 * @param {React.ReactNode} errorComponent - Component to show when unauthorized
 */
const ProtectedRoute = ({
  redirectPath = '/login',
  permission = null,
  useLayout = true,
  errorComponent = null,
}) => {
  const { isAuth, hasPermission } = useAuth();

  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  // Handle single or multiple permissions
  const hasAccess =
    !permission ||
    (Array.isArray(permission)
      ? permission.some((p) => hasPermission(p))
      : hasPermission(permission));

  console.log(hasAccess)

  if (!hasAccess) {
    return errorComponent || <Navigate to={redirectPath} replace />;
  }

  return useLayout ? <Outlet /> : null;
};

export default ProtectedRoute;