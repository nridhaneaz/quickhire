import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../lib/api';

const AdminAuthContext = createContext();

// Use sessionStorage for admin auth (clears when tab closes)
const ADMIN_TOKEN_KEY = 'adminAccessToken';
const ADMIN_USER_KEY  = 'adminUser';
const LAST_ACTIVITY_KEY = 'adminLastActivity';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear admin session
  const clearAdminSession = useCallback(() => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem('adminRefreshToken');
    sessionStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
    setAdmin(null);
  }, []);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    if (admin) {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }, [admin]);

  // Check for inactivity timeout
  useEffect(() => {
    if (!admin) return;

    const checkInactivity = () => {
      const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > INACTIVITY_TIMEOUT) {
          clearAdminSession();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkInactivity, 60000);
    return () => clearInterval(interval);
  }, [admin, clearAdminSession]);

  // Track user activity
  useEffect(() => {
    if (!admin) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [admin, updateActivity]);

  // Restore admin session on page load
  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_USER_KEY);
    const token  = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);

    if (stored && token) {
      // Check if session expired due to inactivity
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > INACTIVITY_TIMEOUT) {
          clearAdminSession();
          setLoading(false);
          return;
        }
      }

      try {
        const userData = JSON.parse(stored);
        const normalized = {
          ...userData,
          name: userData.name || userData.email?.split('@')[0] || 'Admin',
          role: 'admin',
        };
        setAdmin(normalized);
        sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      } catch (_) {
        clearAdminSession();
      }
    }
    setLoading(false);
  }, [clearAdminSession]);

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

    // Store in sessionStorage (clears when tab closes)
    sessionStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    if (data.data.refreshToken) sessionStorage.setItem('adminRefreshToken', data.data.refreshToken);
    sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(normalized));
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    setAdmin(normalized);
    return { success: true, role: 'admin' };
  };

  const logout = async () => {
    try {
      // Call backend logout using the admin token
      await authAPI.logoutWithToken(sessionStorage.getItem(ADMIN_TOKEN_KEY));
    } catch (_) {}
    clearAdminSession();
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
