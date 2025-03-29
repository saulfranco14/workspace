import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Correo electrónico inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Za-z]/, { message: 'La contraseña debe incluir al menos una letra' })
    .regex(/[0-9]/, { message: 'La contraseña debe incluir al menos un número' })
    .regex(/[$@$!%*?&]/, { message: 'La contraseña debe incluir al menos un símbolo' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
