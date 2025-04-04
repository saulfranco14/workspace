'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@/hooks/useSession';
import { fetchCart } from '@/store/cart/thunk/cartThunk';
import { fetchUserFavoriteCollections } from '@/store/favorites/thunk/favoritesThunk';
import { AppDispatch } from '@/store/store';

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      console.log('Tiene una sessión activa en CartProvider');
      const userId = session.user.id;
      if (userId) dispatch(fetchCart(userId));
    } else {
      dispatch(fetchCart(undefined));
    }
  }, [dispatch, session]);

  useEffect(() => {
    dispatch(fetchUserFavoriteCollections());
  }, [dispatch]);

  return <>{children}</>;
};

export default CartProvider;
