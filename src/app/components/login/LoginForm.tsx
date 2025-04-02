'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { LoginFormData } from '@/validations/authValidation';
import { resetAuthState } from '@/app/store/auth/slices/authSlice';
import { selectAuthLoading, selectAuthError, selectAuthSuccess } from '@/selectors/authSelectors';
import { AppDispatch } from '@/app/store/store';
import { loginUserThunk } from '@/app/store/auth/thunk/authThunk';
import { FormContainer, FormTitle, FormLink } from '@/styles/components/FormStyles';

import AuthFormStatus from '@/app/components/shared/FormStatus';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import LoginFormFields from '@/app/components/login/LoginFormFields';

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useAuthRedirect(success, router);

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUserThunk(data));
  };

  return (
    <FormContainer>
      <FormTitle>Iniciar Sesión</FormTitle>

      <AuthFormStatus
        error={error}
        success={success}
        successMessage="Inicio de sesión exitoso. Serás redirigido en breve."
      />

      <LoginFormFields onSubmit={onSubmit} loading={loading} success={success} />

      <FormLink>
        ¿No tienes una cuenta? <Link href="/registrarse">Regístrate</Link>
      </FormLink>
    </FormContainer>
  );
}
