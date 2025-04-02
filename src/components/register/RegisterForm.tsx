'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { RegisterFormData } from '@/validations/authValidation';
import { resetAuthState } from '@/store/auth/slices/authSlice';
import { selectAuthLoading, selectAuthError, selectAuthSuccess } from '@/selectors/authSelectors';
import { AppDispatch } from '@/store/store';
import { registerUserThunk } from '@/store/auth/thunk/authThunk';
import { FormContainer, FormTitle, FormLink } from '@/styles/components/FormStyles';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import AuthFormStatus from '../shared/FormStatus';
import RegisterFormFields from '@/components/register/RegisterFormFields';
export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useAuthRedirect(success, router);

  const onSubmit = (data: RegisterFormData) => {
    dispatch(registerUserThunk(data));
  };

  return (
    <FormContainer>
      <FormTitle>Registrarte</FormTitle>

      <AuthFormStatus error={error} success={success} successMessage="Registro exitoso. Serás redirigido en breve." />

      <RegisterFormFields onSubmit={onSubmit} loading={loading} success={success} />

      <FormLink>
        ¿Ya tienes una cuenta? <Link href="/login">Iniciar Sesión</Link>
      </FormLink>
    </FormContainer>
  );
}
