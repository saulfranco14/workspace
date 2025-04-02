'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store/store';

import { useAuth } from '@/hooks/useAuth';
import { getSession } from '@/app/services/authService';
import { setUser } from '@/app/store/auth/slices/authSlice';
import { AuthContextType } from '../interfaces/auth.interface';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        dispatch(setUser(session?.user || null));
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
      }
    };

    checkSession();
  }, [dispatch]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};
