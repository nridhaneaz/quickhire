import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Admin credentials
const ADMIN_EMAIL = 'admin@quickhire.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, name, role: 'admin' | 'user' }

  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email, name: 'Admin', role: 'admin' };
      setUser(adminUser);
      return { success: true, role: 'admin' };
    }
    // Regular user login (any email/password for demo)
    if (email && password.length >= 6) {
      const regularUser = { email, name: email.split('@')[0], role: 'user' };
      setUser(regularUser);
      return { success: true, role: 'user' };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}