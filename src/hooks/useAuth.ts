import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectAuthUser, selectAuthLoading, selectAuthError, selectAuthSuccess } from '@/selectors/authSelectors';
import { AppDispatch } from '@/store/store';
import { logoutUserThunk } from '@/store/auth/thunk/authThunk';
import { resetAuthState } from '@/store/auth/slices/authSlice';

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
      console.log('No hay usuario logeado');
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
