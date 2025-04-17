import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

const RedirectIfAuthenticated = ({ children }) => {
  const { auth, role } = useAuth();
  const location = useLocation();

  if (auth && location.pathname === "/login") {
    if(role === 'admin'){
      return <Navigate to="/strands" replace />;
    }else{
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RedirectIfAuthenticated;
