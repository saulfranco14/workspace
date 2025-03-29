import { supabase } from '@/app/config/supabaseClient';
import { RegisterFormData } from '@/app/validations/authValidation';

export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error al obtener la sesión:', error.message);
    return null;
  }

  return session;
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user || null;
};

export const registerUser = async (userData: RegisterFormData) => {
  const { email, password } = userData;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { data, success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return { error: 'Error desconocido durante el registro', success: false };
  }
};
