import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AdminAuthContext = createContext();

// Separate localStorage keys — completely isolated from the user session
const ADMIN_TOKEN_KEY = 'adminAccessToken';
const ADMIN_USER_KEY  = 'adminUser';

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore admin session on page load
  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    const token  = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored && token) {
      try {
        const userData = JSON.parse(stored);
        const normalized = {
          ...userData,
          name: userData.name || userData.email?.split('@')[0] || 'Admin',
          role: 'admin',
        };
        setAdmin(normalized);
      } catch (_) {
        setAdmin(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    const { user: userData, accessToken } = data.data;

    const normalized = {
      ...userData,
      role: userData.role === 'ADMIN' ? 'admin' : userData.role?.toLowerCase(),
      name: userData.name || email.split('@')[0],
    };

    if (normalized.role !== 'admin') {
      throw new Error('Access denied. This portal is for administrators only.');
    }

    // Store under ADMIN-specific keys
    localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    if (data.data.refreshToken) localStorage.setItem('adminRefreshToken', data.data.refreshToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(normalized));

    setAdmin(normalized);
    return { success: true, role: 'admin' };
  };

  const logout = async () => {
    try {
      // Call backend logout using the admin token
      await authAPI.logoutWithToken(localStorage.getItem(ADMIN_TOKEN_KEY));
    } catch (_) {}
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
