import { supabase } from '@/app/config/supabaseClient';

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
