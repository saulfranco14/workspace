import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/store/store';
import { getSession } from '@/services/authService';
import { setSession } from '@/store/auth/slices/authSlice';

export const useSession = () => {
  const dispatch = useDispatch();

  const session = useSelector((state: RootState) => state.auth.session);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const initSession = async () => {
      try {
        const currentSession = await getSession();
        if (currentSession) {
          dispatch(setSession(currentSession));
        }
      } catch (error) {
        console.error('Error al inicializar la sesión:', error);
      }
    };

    if (!session) {
      initSession();
    }
  }, [dispatch, session]);

  return { session, user, isAuthenticated };
};
