import { User, Session } from '@supabase/supabase-js';

export type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};
