import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  return userInfo === null || !userInfo.isVerified ? (
    <Navigate to={'/auth/login'} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
