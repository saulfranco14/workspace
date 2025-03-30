import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectAuthUser, selectAuthLoading, selectAuthError, selectAuthSuccess } from '@/app/selectors/authSelectors';
import { AppDispatch } from '@/app/store/store';
import { logoutUserThunk } from '@/app/store/auth/thunk/authThunk';
import { resetAuthState } from '@/app/store/auth/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);

  const logout = async () => {
    await dispatch(logoutUserThunk());
    router.push('/login');
  };

  const resetAuth = () => {
    dispatch(resetAuthState());
  };

  useEffect(() => {
    if (!user && !loading) {
      console.log('No hay usuario y no está cargando...');
    }
  }, [user, loading, router]);

  return {
    user,
    loading,
    error,
    success,
    isAuthenticated: !!user,
    logout,
    resetAuth,
  };
};
