import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? stored : null;
  });

  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  const login = (data, token) => {
    setAuth(token);
    setUserData(data)
    setRole(data.role)
    localStorage.setItem("token", token);
    localStorage.setItem("role", data.role);
  };

  const logout = () => {
    setAuth(null);
    setUserData(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}auth/get-user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setUserData(res.data);
      } else {
        setUserData(null);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (auth) {
      getUserData()
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, userData, role, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
