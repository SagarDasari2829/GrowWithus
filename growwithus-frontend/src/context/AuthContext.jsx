import { createContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { authApi } from "../services/api/authApi";
import { userApi } from "../services/api/userApi";
import { setAccessTokenGetter } from "../services/http";

export const AuthContext = createContext(null);

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.TOKEN) || "");
  const [user, setUser] = useState(getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setAccessTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    const hydrate = async () => {
      try {
        if (!user) {
          const res = await userApi.getMe();
          setUser(res.data);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
        }
      } catch {
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    hydrate();
  }, []);

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    persistSession(res.token, res.user);
  };

  const login = async (payload) => {
    const res = await authApi.login(payload);
    persistSession(res.token, res.user);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isInitializing,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [token, user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}