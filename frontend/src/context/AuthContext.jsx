import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vt_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await loginUser(email, password);
      if (res.code === 200) {
        setUser(res.user);
        localStorage.setItem('vt_user', JSON.stringify(res.user));
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        setAuthError(res.message || "Đăng nhập thất bại");
        return { success: false, message: res.message };
      }
    } catch (e) {
      setAuthError(e.message || "Lỗi mạng hoặc hệ thống");
      return { success: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vt_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        openAuthModal: () => { setAuthError(""); setIsAuthModalOpen(true); },
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        logout,
        authError,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
