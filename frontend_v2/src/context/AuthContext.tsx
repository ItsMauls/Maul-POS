"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { login as loginUser, refreshToken as refresh, logout as logoutUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import exp from 'constants';

interface AuthContextProps {
  user: any;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshToken: () => Promise<string>;
}

interface User {
  id: number;
  name: string;
  address: string;
  username: string;
  email: string;
  role: Role;
}

interface Role {
  id: number;
  name: string;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const signIn = async (username: string, password: string) => {
    const data = await loginUser({ username, password });
    const accessTokenExpiry = 1; // 15 minutes
    Cookies.set('access_token', data.data.access_token, { expires: accessTokenExpiry });
    Cookies.set('refresh_token', data.data.refresh_token, { expires: 5 });
    Cookies.set('user', JSON.stringify(data.data.user), { expires: accessTokenExpiry });
    setUser(data.data.user);
  };

  const signOut = async () => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {

      await logoutUser(accessToken);
    }
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    setUser(null);
    // router.push('/auth/login');
    window.location.href = '/auth/login';
  };

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        signOut();
        return false;
      }

      const data = await refresh(refreshToken);
      if (!data.data.access_token) {
        signOut();
        return false;
      }

      console.log('refresh token success');
      // Set expiry to 15 minutes. Convert minutes to days for js-cookie.
      const accessTokenExpiry = 1
      Cookies.set('access_token', data.data.access_token, { expires: accessTokenExpiry, secure: true });
      Cookies.set('refresh_token', data.data.refresh_token, { expires: 5 , secure: true }); // Assuming 7 days expiry for refresh token
      Cookies.set('user', JSON.stringify(data.data.user), { secure: true });

      return data.data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      signOut();
      return "";
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
