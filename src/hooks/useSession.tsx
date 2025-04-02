import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '@/config/supabaseClient';
import { RootState } from '@/app/store/store';
import { migrateCart } from '@/services/cart/cartService';
import { getFingerprint } from '@/services/deviceService';

export const useSession = () => {
  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.auth.session);
  const user = session?.user || null;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        dispatch({ type: 'auth/setSession', payload: session });

        const fingerprint = await getFingerprint();
        if (fingerprint && session.user) {
          migrateCart(session.user.id, fingerprint);
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'auth/clearSession' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return { session, user };
};
