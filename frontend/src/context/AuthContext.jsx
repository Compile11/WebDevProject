import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const login = ({ user, token }) => {
    localStorage.setItem("token", token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/auth")
  };

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setCurrentUser(data.user);
      } catch (err) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
  <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
