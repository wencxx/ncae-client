import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

const RedirectIfAuthenticated = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
