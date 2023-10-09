import UserService from "../utility/services/user";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isVendor, setIsVendor] = useState(null);

  const setData = async () => {
    const user = await UserService.getUser();
    if (user && user.token) {
      setUser(user);
      setIsVendor(user.type === "vendor");
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      setData();
      setLoading(false);
    };
    loadToken();
  }, []);

  const logout = async () => {
    UserService.logout();
    setIsAuthenticated(false);
  };

  const login = () => {
    setData();
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isVendor,
    loading,
  };
}
