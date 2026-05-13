import { useCallback, useMemo, useState } from 'react';
import { getCurrentUser, loginUser } from '../api/apiClient';
import { AuthContext } from './authContext';

const TOKEN_STORAGE_KEY = 'ecommerce_token';
const USER_STORAGE_KEY = 'ecommerce_user';

function readStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function readStoredUser() {
  const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(() => readStoredUser());

  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);

    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

    setToken(response.token);
    setUser(response.user);

    return response;
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!token) {
      return null;
    }

    const response = await getCurrentUser(token);

    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);

    return response.user;
  }, [token]);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);

    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
    refreshCurrentUser
  }), [token, user, login, logout, refreshCurrentUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}