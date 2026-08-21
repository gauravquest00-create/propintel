import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getAuthUser());
  const [loading, setLoading] = useState(false);

  const login = (email, password) => {
    const authData = authService.login(email, password);
    setUser(authData);
    return authData;
  };

  const register = (data) => {
    return authService.register(data);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = (data) => {
    const updated = authService.updateProfile(data);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
