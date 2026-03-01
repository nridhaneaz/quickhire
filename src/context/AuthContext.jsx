import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load হলে localStorage থেকে user restore করো
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (stored && token) {
      try {
        const userData = JSON.parse(stored);
        // Normalize user data (ensure name and role are consistent)
        const normalized = {
          ...userData,
          name: userData.name || userData.email?.split('@')[0] || 'User',
          role: userData.role === 'ADMIN' ? 'admin' : userData.role === 'USER' ? 'user' : userData.role,
        };
        setUser(normalized);
      } catch (_) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    const { user: userData, accessToken, refreshToken } = data.data;

    // Normalize role first so we can reject admins
    const role = userData.role === 'ADMIN' ? 'admin' : 'user';
    if (role === 'admin') {
      throw new Error('Admin accounts must log in via the Admin Portal.');
    }

    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    const normalized = {
      ...userData,
      role: 'user',
      name: userData.name || email.split('@')[0],
    };

    setUser(normalized);
    return { success: true, role: 'user' };
  };

  // Update local user state + localStorage (e.g. after avatar upload)
  const updateUser = (patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const register = async (name, email, password) => {
    await authAPI.register(name, email, password);
    return { success: true };
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}