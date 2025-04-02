'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@/hooks/useSession';
import { fetchCart } from '@/app/store/cart/thunk/cartThunk';
import { fetchUserFavoriteCollections } from '../store/favorites/thunk/favoritesThunk';
import { AppDispatch } from '@/app/store/store';

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { session } = useSession();

  useEffect(() => {
    const userId = session?.user?.id;
    dispatch(fetchCart(userId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserFavoriteCollections());
  }, [dispatch]);

  return <>{children}</>;
};

export default CartProvider;
