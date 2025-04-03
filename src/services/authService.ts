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

export const createUserProfile = async (userId: string) => {
  try {
    const { error } = await supabase.from('profiles').insert([{ id: userId }]);

    if (error) {
      console.error('Error al crear el perfil:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error al intentar crear el perfil:', err);
    return { success: false, error: 'Error desconocido al crear el perfil' };
  }
};

export const registerUser = async (userData: RegisterFormData): Promise<AuthResponse> => {
  const { email, password } = userData;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      await loginUser({ email, password });
      return {
        data,
        success: true,
        profilePending: true,
      };
    }

    return { data, success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return { error: 'Error desconocido durante el registro', success: false };
  }
};

export const createProfileAfterSignUp = async (userId: string) => {
  try {
    const session = await getSession();

    if (!session) {
      console.warn('No hay sesión activa al intentar crear el perfil');
    }

    return await createUserProfile(userId);
  } catch (err) {
    console.error('Error al crear perfil después del registro:', err);
    return { success: false, error: 'Error al crear perfil después del registro' };
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
