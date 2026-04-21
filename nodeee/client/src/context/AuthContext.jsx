import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'coursehub_auth';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStored().user);
  const [token, setToken] = useState(() => readStored().token);

  const setSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      setSession,
      logout,
    }),
    [user, token, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
