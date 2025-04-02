import { AuthError, AuthResponse as SupabaseAuthResponse } from '@supabase/supabase-js';
import { SignInCredentials, SignUpCredentials } from '@/interfaces/auth.interface';
import { supabase } from '@/config/supabaseClient';

export async function signUp({ email, password, firstName, lastName }: SignUpCredentials) {
  try {
    const response: SupabaseAuthResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    const { data, error } = response;

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error durante el registro:', error);
    return { data: null, error: error as AuthError };
  }
}

export async function signIn({ email, password }: SignInCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    return { data: null, error: error as AuthError };
  }
}

export async function signInWithProvider(provider: 'google' | 'facebook' | 'github') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Error durante el inicio de sesión con ${provider}:`, error);
    return { data: null, error: error as AuthError };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
    return { error: error as AuthError };
  }
}

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error al enviar email de restablecimiento:', error);
    return { data: null, error: error as AuthError };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    return { data: null, error: error as AuthError };
  }
}
