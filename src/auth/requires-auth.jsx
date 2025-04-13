import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, role } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default RequireAuth;
