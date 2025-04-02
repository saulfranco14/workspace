import { supabase } from '@/config/supabaseClient';
import { RegisterFormData, LoginFormData } from '@/validations/authValidation';
import { AuthResponse, LogoutResponse } from '@/interfaces/auth.interface';

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

export const registerUser = async (userData: RegisterFormData): Promise<AuthResponse> => {
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

export const loginUser = async (userData: LoginFormData): Promise<AuthResponse> => {
  const { email, password } = userData;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
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
    return { error: 'Error desconocido durante el inicio de sesión', success: false };
  }
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return { error: 'Error desconocido al cerrar sesión', success: false };
  }
};
