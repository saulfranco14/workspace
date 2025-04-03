'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SupabaseContextType } from '@/types/provider.type';
import { supabase } from '@/config/supabaseClient';
import { getSession } from '@/services/authService';
import { setSession, logoutUser } from '@/store/auth/slices/authSlice';
import { RootState } from '@/store/store';

const defaultContextValue: SupabaseContextType = {
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
};

const SupabaseContext = createContext<SupabaseContextType>(defaultContextValue);
export const useSupabase = () => useContext(SupabaseContext);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const session = useSelector((state: RootState) => state.auth.session);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const currentSession = await getSession();
        if (currentSession) dispatch(setSession(currentSession));
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [dispatch]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logoutUser());
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
