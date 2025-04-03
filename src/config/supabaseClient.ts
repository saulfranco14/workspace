import { createClient } from '@supabase/supabase-js';
import { Database } from '@/interfaces/clientSupabase.interface';
import { getFingerprint } from '@/services/deviceService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_API_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno para Supabase. Verifica tu archivo .env');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: async (input, init) => {
      let fingerprint = await getFingerprint();
      fingerprint = fingerprint ?? '';

      const headers = {
        ...init?.headers,
        'x-device-fingerprint': fingerprint,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: supabaseAnonKey,
      };

      return fetch(input, {
        ...init,
        headers,
      });
    },
  },
});
