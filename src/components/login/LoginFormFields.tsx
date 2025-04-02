'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/validations/authValidation';
import { InputGroup, InputLabel, TextInput, ErrorMessage } from '@/styles/components/InputStyle';
import { SubmitButton } from '@/styles/components/ButtonStyle';
import { LoginFormFieldsProps } from '@/interfaces/auth.interface';

export default function LoginFormFields({ onSubmit, loading, success }: LoginFormFieldsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <InputLabel>Correo electrónico</InputLabel>
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
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </SubmitButton>
    </form>
  );
}
