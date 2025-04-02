'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/validations/authValidation';
import { InputGroup, InputLabel, TextInput, ErrorMessage } from '@/styles/components/InputStyle';
import { SubmitButton } from '@/styles/components/ButtonStyle';
import { FormFooter } from '@/styles/components/FormStyles';
import { RegisterFormFieldsProps } from '@/interfaces/auth.interface';

export default function RegisterFormFields({ onSubmit, loading, success }: RegisterFormFieldsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
        {loading ? 'Creando cuenta...' : 'Crear mi cuenta gratis'}
      </SubmitButton>

      <FormFooter>
        Al registrarte en esta página, aceptas nuestra Política de privacidad y Condiciones de servicio.
      </FormFooter>
    </form>
  );
}
