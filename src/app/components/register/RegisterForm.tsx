'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema, RegisterFormData } from '@/app/validations/authValidation';
import { resetAuthState } from '@/app/store/auth/slices/authSlice';
import { 
  selectAuthLoading, 
  selectAuthError, 
  selectAuthSuccess 
} from '@/app/selectors/authSelectors';
import { AppDispatch } from '@/app/store/store';
import { registerUserThunk } from '@/app/store/auth/thunk/authThunk';
import {
  FormContainer,
  FormTitle,
  FormLink,
  FormFooter
} from '@/app/styles/components/FormStyles';
import { AlertMessage } from '@/app/styles/components/AlertStyle';
import { InputGroup, InputLabel, TextInput, ErrorMessage } from '@/app/styles/components/InputStyle';
import { SubmitButton } from '@/app/styles/components/ButtonStyle';


export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const success = useSelector(selectAuthSuccess);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const onSubmit = (data: RegisterFormData) => {
    dispatch(registerUserThunk(data));
  };

  return (
    <FormContainer>
      <InputLabel>Correo electrónico</InputLabel>
      
      {error && (
        <AlertMessage type="error">
          {error}
        </AlertMessage>
      )}
      
      {success && (
        <AlertMessage type="success">
          Registro exitoso. Serás redirigido en breve.
        </AlertMessage>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <TextInput
            id="email"
            type="email"
            placeholder="Escribe tu correo electrónico"
            {...register('email')}
            disabled={loading || success}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <InputLabel>Contraseña</InputLabel>
          <TextInput
            id="password"
            type="password"
            placeholder="Escribe tu contraseña"
            {...register('password')}
            disabled={loading || success}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </InputGroup>

        <SubmitButton type="submit" disabled={loading || success}>
          {loading ? 'Creando cuenta...' : 'Crear mi cuenta gratis'}
        </SubmitButton>
        
        <FormFooter>
          Al registrarte en esta página, aceptas nuestra Política de privacidad y Condiciones de servicio.
        </FormFooter>
      </form>

      <FormLink>
        ¿Ya tienes una cuenta? <Link href="/login">Iniciar Sesión</Link>
      </FormLink>
    </FormContainer>
  );
} 