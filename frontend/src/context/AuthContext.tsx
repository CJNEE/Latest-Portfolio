import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface User {
  user_id: number;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isOwner: boolean;
  editMode: boolean;
  setEditMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cjo_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cjo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [editMode, setEditMode] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('cjo_token', newToken);
    localStorage.setItem('cjo_user', JSON.stringify(newUser));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setEditMode(true);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cjo_token');
    localStorage.removeItem('cjo_user');
    delete apiClient.defaults.headers.common['Authorization'];
    setEditMode(false);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const isOwner = user?.role === 'Owner' || user?.role === 'Developer';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isOwner,
        editMode: isOwner && editMode,
        setEditMode,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
